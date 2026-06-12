import { NextResponse } from 'next/server'
import { ACCESS_TOKEN_TTL_SECONDS, resourceIdentifier, verifyClientCredentials } from '@/oauth/config'
import { consumeAuthorizationCode, issueAccessToken, verifyPkce } from '@/oauth/store'

const errorResponse = (status: number, error: string, description?: string) =>
  NextResponse.json(
    { error, ...(description ? { error_description: description } : {}) },
    { status, headers: { 'Cache-Control': 'no-store', 'Access-Control-Allow-Origin': '*' } }
  )

const parseClientCredentials = (
  req: Request,
  body: URLSearchParams
): { clientId: string; clientSecret: string } | { error: string } => {
  const authHeader = req.headers.get('authorization')
  if (authHeader?.toLowerCase().startsWith('basic ')) {
    try {
      const decoded = Buffer.from(authHeader.slice(6), 'base64').toString('utf-8')
      const idx = decoded.indexOf(':')
      if (idx < 0) return { error: 'Malformed Basic credentials' }
      return {
        clientId: decodeURIComponent(decoded.slice(0, idx)),
        clientSecret: decodeURIComponent(decoded.slice(idx + 1)),
      }
    } catch {
      return { error: 'Malformed Basic credentials' }
    }
  }
  const clientId = body.get('client_id')
  const clientSecret = body.get('client_secret')
  if (!clientId || !clientSecret) return { error: 'Missing client credentials' }
  return { clientId, clientSecret }
}

export const POST = async (req: Request) => {
  const raw = await req.text()
  const body = new URLSearchParams(raw)

  const creds = parseClientCredentials(req, body)
  if ('error' in creds) return errorResponse(401, 'invalid_client', creds.error)
  if (!verifyClientCredentials(creds.clientId, creds.clientSecret))
    return errorResponse(401, 'invalid_client', 'client_id / client_secret mismatch')

  const grantType = body.get('grant_type')
  if (grantType !== 'authorization_code')
    return errorResponse(400, 'unsupported_grant_type', `grant_type=${grantType} is not supported`)

  const code = body.get('code')
  const redirectUri = body.get('redirect_uri')
  const codeVerifier = body.get('code_verifier')
  if (!code) return errorResponse(400, 'invalid_request', 'Missing code')
  if (!redirectUri) return errorResponse(400, 'invalid_request', 'Missing redirect_uri')
  if (!codeVerifier) return errorResponse(400, 'invalid_request', 'Missing code_verifier')

  const consumed = await consumeAuthorizationCode(code)
  if ('error' in consumed) return errorResponse(400, 'invalid_grant', consumed.error)

  if (consumed.client_id !== creds.clientId)
    return errorResponse(400, 'invalid_grant', 'Code was issued to a different client')
  if (consumed.redirect_uri !== redirectUri)
    return errorResponse(400, 'invalid_grant', 'redirect_uri does not match the authorization request')
  if (!verifyPkce(codeVerifier, consumed.code_challenge, consumed.code_challenge_method))
    return errorResponse(400, 'invalid_grant', 'PKCE verification failed')

  const { token, expiresIn } = await issueAccessToken({
    userId: consumed.user_id,
    clientId: consumed.client_id,
    scope: consumed.scope,
    resource: consumed.resource ?? resourceIdentifier(),
  })

  return NextResponse.json(
    {
      access_token: token,
      token_type: 'Bearer',
      expires_in: expiresIn ?? ACCESS_TOKEN_TTL_SECONDS,
      scope: consumed.scope,
    },
    { headers: { 'Cache-Control': 'no-store', 'Access-Control-Allow-Origin': '*' } }
  )
}

export const OPTIONS = () =>
  new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    },
  })

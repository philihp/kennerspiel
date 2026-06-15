import { NextResponse } from 'next/server'
import { registerClient } from '@/oauth/store'

// RFC 7591 Dynamic Client Registration. MCP connectors (Claude.ai's included)
// POST here on first connect to mint their own client_id and (optionally) a
// client_secret — so the human installing the connector never sees either one.

const errorResponse = (status: number, error: string, description: string) =>
  NextResponse.json(
    { error, error_description: description },
    { status, headers: { 'Cache-Control': 'no-store', 'Access-Control-Allow-Origin': '*' } }
  )

export const POST = async (req: Request) => {
  let body: Record<string, unknown>
  try {
    body = (await req.json()) as Record<string, unknown>
  } catch {
    return errorResponse(400, 'invalid_client_metadata', 'Request body must be JSON')
  }

  const redirectUris = body.redirect_uris
  if (!Array.isArray(redirectUris) || !redirectUris.every((u): u is string => typeof u === 'string'))
    return errorResponse(400, 'invalid_redirect_uri', 'redirect_uris must be an array of strings')

  const tokenEndpointAuthMethod =
    typeof body.token_endpoint_auth_method === 'string' ? body.token_endpoint_auth_method : undefined
  const clientName = typeof body.client_name === 'string' ? body.client_name : undefined
  const scope = typeof body.scope === 'string' ? body.scope : undefined

  const result = await registerClient({ redirectUris, tokenEndpointAuthMethod, clientName, scope })
  if ('error' in result) return errorResponse(400, 'invalid_client_metadata', result.error)

  return NextResponse.json(
    {
      client_id: result.client.clientId,
      ...(result.clientSecret ? { client_secret: result.clientSecret } : {}),
      client_id_issued_at: Math.floor(Date.now() / 1000),
      redirect_uris: result.client.redirectUris,
      token_endpoint_auth_method: result.client.tokenEndpointAuthMethod,
      grant_types: ['authorization_code'],
      response_types: ['code'],
      scope: result.client.scope,
      ...(result.client.clientName ? { client_name: result.client.clientName } : {}),
    },
    { status: 201, headers: { 'Cache-Control': 'no-store', 'Access-Control-Allow-Origin': '*' } }
  )
}

export const OPTIONS = () =>
  new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })

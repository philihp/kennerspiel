import { createHash, randomBytes, timingSafeEqual } from 'node:crypto'
import { createClient } from '@supabase/supabase-js'
import {
  ACCESS_TOKEN_TTL_SECONDS,
  AUTHORIZATION_CODE_TTL_SECONDS,
  SCOPE,
  SUPPORTED_TOKEN_ENDPOINT_AUTH_METHODS,
  TokenEndpointAuthMethod,
} from './config'

// The OAuth tables are not in the generated Database type, so we use a plain
// service-role client here. All access bypasses RLS and is enforced by code.
const oauthClient = () =>
  createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

const hash = (value: string): string => createHash('sha256').update(value).digest('hex')

const base64url = (buf: Buffer): string =>
  buf.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')

const randomToken = (bytes = 32): string => base64url(randomBytes(bytes))

export type AuthorizationCodeRecord = {
  user_id: string
  client_id: string
  redirect_uri: string
  scope: string
  code_challenge: string
  code_challenge_method: string
  resource: string | null
}

export const issueAuthorizationCode = async (record: AuthorizationCodeRecord): Promise<string> => {
  const code = randomToken()
  const expiresAt = new Date(Date.now() + AUTHORIZATION_CODE_TTL_SECONDS * 1000).toISOString()
  const { error } = await oauthClient()
    .from('oauth_authorization_code')
    .insert({ ...record, code_hash: hash(code), expires_at: expiresAt })
  if (error) throw new Error(`Failed to issue authorization code: ${error.message}`)
  return code
}

export const consumeAuthorizationCode = async (code: string): Promise<AuthorizationCodeRecord | { error: string }> => {
  const client = oauthClient()
  const { data, error } = await client
    .from('oauth_authorization_code')
    .delete()
    .eq('code_hash', hash(code))
    .select()
    .maybeSingle()
  if (error) return { error: error.message }
  if (!data) return { error: 'Authorization code is unknown or already used' }
  if (new Date(data.expires_at).getTime() < Date.now()) return { error: 'Authorization code has expired' }
  return {
    user_id: data.user_id,
    client_id: data.client_id,
    redirect_uri: data.redirect_uri,
    scope: data.scope,
    code_challenge: data.code_challenge,
    code_challenge_method: data.code_challenge_method,
    resource: data.resource,
  }
}

export type IssuedAccessToken = {
  token: string
  expiresIn: number
}

export const issueAccessToken = async ({
  userId,
  clientId,
  scope,
  resource,
}: {
  userId: string
  clientId: string
  scope: string
  resource: string | null
}): Promise<IssuedAccessToken> => {
  const token = randomToken(48)
  const expiresAt = new Date(Date.now() + ACCESS_TOKEN_TTL_SECONDS * 1000).toISOString()
  const { error } = await oauthClient()
    .from('oauth_access_token')
    .insert({
      token_hash: hash(token),
      user_id: userId,
      client_id: clientId,
      scope,
      resource,
      expires_at: expiresAt,
    })
  if (error) throw new Error(`Failed to issue access token: ${error.message}`)
  return { token, expiresIn: ACCESS_TOKEN_TTL_SECONDS }
}

export type ResolvedAccessToken = {
  userId: string
  clientId: string
  scopes: string[]
  expiresAt: number
  resource: string | null
}

export const resolveAccessToken = async (token: string): Promise<ResolvedAccessToken | undefined> => {
  const client = oauthClient()
  const { data, error } = await client
    .from('oauth_access_token')
    .select('user_id, client_id, scope, expires_at, resource')
    .eq('token_hash', hash(token))
    .maybeSingle()
  if (error || !data) return undefined
  const expiresAtMs = new Date(data.expires_at).getTime()
  if (expiresAtMs < Date.now()) return undefined
  // Best-effort last_used_at update; ignore failures.
  void client
    .from('oauth_access_token')
    .update({ last_used_at: new Date().toISOString() })
    .eq('token_hash', hash(token))
  return {
    userId: data.user_id,
    clientId: data.client_id,
    scopes: data.scope.split(' ').filter(Boolean),
    expiresAt: Math.floor(expiresAtMs / 1000),
    resource: data.resource,
  }
}

export const verifyPkce = (codeVerifier: string, codeChallenge: string, method: string): boolean => {
  if (method !== 'S256') return false
  const expected = base64url(createHash('sha256').update(codeVerifier).digest())
  if (expected.length !== codeChallenge.length) return false
  return timingSafeEqual(Buffer.from(expected), Buffer.from(codeChallenge))
}

export type RegisteredClient = {
  clientId: string
  redirectUris: string[]
  tokenEndpointAuthMethod: TokenEndpointAuthMethod
  scope: string
  clientName: string | null
  hasSecret: boolean
}

export type ClientRegistrationInput = {
  redirectUris: string[]
  tokenEndpointAuthMethod?: string
  clientName?: string
  scope?: string
}

export type ClientRegistrationResult = {
  client: RegisteredClient
  clientSecret: string | null
}

const normalizeAuthMethod = (raw: string | undefined): TokenEndpointAuthMethod | { error: string } => {
  const method = raw ?? 'client_secret_post'
  if (!SUPPORTED_TOKEN_ENDPOINT_AUTH_METHODS.includes(method as TokenEndpointAuthMethod))
    return { error: `token_endpoint_auth_method "${method}" is not supported` }
  return method as TokenEndpointAuthMethod
}

export const registerClient = async (
  input: ClientRegistrationInput
): Promise<ClientRegistrationResult | { error: string }> => {
  if (!input.redirectUris.length) return { error: 'redirect_uris must contain at least one URI' }
  for (const uri of input.redirectUris) {
    try {
      const url = new URL(uri)
      if (url.protocol !== 'https:' && url.hostname !== 'localhost' && url.hostname !== '127.0.0.1')
        return { error: `redirect_uri must be https or localhost: ${uri}` }
    } catch {
      return { error: `redirect_uri is not a valid URL: ${uri}` }
    }
  }

  const authMethod = normalizeAuthMethod(input.tokenEndpointAuthMethod)
  if (typeof authMethod === 'object') return authMethod

  const clientId = `mcp_${randomToken(18)}`
  const clientSecret = authMethod === 'none' ? null : randomToken(32)
  const clientSecretHash = clientSecret ? hash(clientSecret) : null
  const scope = input.scope?.trim() || SCOPE

  const { error } = await oauthClient()
    .from('oauth_client')
    .insert({
      client_id: clientId,
      client_secret_hash: clientSecretHash,
      client_name: input.clientName ?? null,
      redirect_uris: input.redirectUris,
      token_endpoint_auth_method: authMethod,
      scope,
    })
  if (error) throw new Error(`Failed to register client: ${error.message}`)

  return {
    client: {
      clientId,
      redirectUris: input.redirectUris,
      tokenEndpointAuthMethod: authMethod,
      scope,
      clientName: input.clientName ?? null,
      hasSecret: clientSecret !== null,
    },
    clientSecret,
  }
}

export const findClient = async (clientId: string): Promise<RegisteredClient | undefined> => {
  const { data, error } = await oauthClient()
    .from('oauth_client')
    .select('client_id, client_secret_hash, client_name, redirect_uris, token_endpoint_auth_method, scope')
    .eq('client_id', clientId)
    .maybeSingle()
  if (error || !data) return undefined
  return {
    clientId: data.client_id,
    redirectUris: data.redirect_uris,
    tokenEndpointAuthMethod: data.token_endpoint_auth_method as TokenEndpointAuthMethod,
    scope: data.scope,
    clientName: data.client_name,
    hasSecret: data.client_secret_hash !== null,
  }
}

export const verifyClientSecret = async (clientId: string, clientSecret: string): Promise<boolean> => {
  const { data, error } = await oauthClient()
    .from('oauth_client')
    .select('client_secret_hash')
    .eq('client_id', clientId)
    .maybeSingle()
  if (error || !data?.client_secret_hash) return false
  const expected = Buffer.from(data.client_secret_hash)
  const actual = Buffer.from(hash(clientSecret))
  if (expected.length !== actual.length) return false
  return timingSafeEqual(expected, actual)
}

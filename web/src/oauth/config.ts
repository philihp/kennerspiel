// OAuth 2.1 authorization-server configuration. Clients self-register via the
// Dynamic Client Registration endpoint (RFC 7591); per-client allow-listing
// happens against the oauth_client table, not env vars.

export const ACCESS_TOKEN_TTL_SECONDS = 60 * 60 * 24 * 30
export const AUTHORIZATION_CODE_TTL_SECONDS = 60 * 10
export const SCOPE = 'play'

export const SUPPORTED_TOKEN_ENDPOINT_AUTH_METHODS = ['none', 'client_secret_basic', 'client_secret_post'] as const
export type TokenEndpointAuthMethod = (typeof SUPPORTED_TOKEN_ENDPOINT_AUTH_METHODS)[number]

export const issuer = (): string => {
  const fromEnv = process.env.OAUTH_ISSUER
  if (fromEnv) return fromEnv.replace(/\/$/, '')
  const site = process.env.NEXT_PUBLIC_SITE_URL
  if (site) return site.replace(/\/$/, '')
  throw new Error('OAUTH_ISSUER (or NEXT_PUBLIC_SITE_URL) is not configured')
}

// The protected resource identifier is the origin: tokens minted for
// kennerspiel.com cover every MCP endpoint we serve (the cross-instance hub at
// /api/mcp and every per-instance endpoint at /instance/<id>/mcp), so users
// only authorize the connector once.
export const resourceIdentifier = (): string => issuer()

// RFC 8707: clients may pass a `resource` indicator targeting any URL under
// our origin. Accept anything whose origin matches the issuer; reject foreign
// origins so a confused-deputy can't redirect tokens elsewhere.
export const isAllowedResource = (resource: string): boolean => {
  try {
    return new URL(resource).origin === new URL(issuer()).origin
  } catch {
    return false
  }
}

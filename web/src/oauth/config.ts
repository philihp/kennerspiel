// OAuth 2.1 authorization-server configuration. Both the authorize page and
// the token endpoint read from here so they agree on what counts as a valid
// client + redirect.

export const ACCESS_TOKEN_TTL_SECONDS = 60 * 60 * 24 * 30
export const AUTHORIZATION_CODE_TTL_SECONDS = 60 * 10
export const SCOPE = 'play'

export const issuer = (): string => {
  const fromEnv = process.env.OAUTH_ISSUER
  if (fromEnv) return fromEnv.replace(/\/$/, '')
  const site = process.env.NEXT_PUBLIC_SITE_URL
  if (site) return site.replace(/\/$/, '')
  throw new Error('OAUTH_ISSUER (or NEXT_PUBLIC_SITE_URL) is not configured')
}

export const resourceIdentifier = (): string => `${issuer()}/api/mcp`

export const allowedRedirectUris = (): string[] => {
  const raw = process.env.OAUTH_REDIRECT_URIS
  if (!raw) throw new Error('OAUTH_REDIRECT_URIS is not configured')
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

export const verifyClientCredentials = (clientId: string, clientSecret?: string): boolean => {
  const expectedId = process.env.OAUTH_CLIENT_ID
  const expectedSecret = process.env.OAUTH_CLIENT_SECRET
  if (!expectedId || !expectedSecret) throw new Error('OAUTH_CLIENT_ID / OAUTH_CLIENT_SECRET not configured')
  return clientId === expectedId && clientSecret === expectedSecret
}

export const isKnownClientId = (clientId: string): boolean => {
  const expectedId = process.env.OAUTH_CLIENT_ID
  return Boolean(expectedId) && clientId === expectedId
}

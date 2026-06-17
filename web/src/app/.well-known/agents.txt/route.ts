import { issuer } from '@/oauth/config'

// agents-txt.com 1.0 plain-text fallback for clients that don't read agents.json.
export const GET = () => {
  const iss = issuer()
  const body = `Spec-Version: 1.0

Site-Name: Kennerspiel
Site-URL: ${iss}
Site-Description: Digital tabletop for Uwe Rosenberg's Ora et Labora.

Capability: play-ora-et-labora
  Endpoint: ${iss}/api/mcp
  Method: POST
  Protocol: MCP
  Auth: oauth2
  Auth-Endpoint: ${iss}/authorize
  Auth-Docs: ${iss}/.well-known/oauth-authorization-server
  Scopes: play
  Description: List seats, read board state, enumerate legal moves, play moves, consult the strategy guide.

Capability: mcp-discovery
  Endpoint: ${iss}/.well-known/mcp.json
  Method: GET
  Protocol: REST
  Auth: none
  Description: MCP server card.

Capability: openapi-spec
  Endpoint: ${iss}/openapi.json
  Method: GET
  Protocol: REST
  Auth: none
  Description: OpenAPI 3.1 description of the HTTP surface.

Allow: /api/mcp
Allow: /.well-known/*
Allow: /openapi.json
Allow: /llms.txt
Allow: /agents.txt
Allow: /agents.json
Disallow: /account/*
Disallow: /private/*

Agent: *
  Rate-Limit: 60/minute
`
  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'public, max-age=3600',
      'Access-Control-Allow-Origin': '*',
    },
  })
}

export const OPTIONS = () =>
  new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': '*',
    },
  })

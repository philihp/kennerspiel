import { NextResponse } from 'next/server'
import { issuer } from '@/oauth/config'

// agents-txt.com 1.0 capability surface. Declares the MCP transports (the
// hub plus per-instance) and the OAuth endpoints that gate them, so
// well-behaved agents can discover the sanctioned channel without scraping.
export const GET = () => {
  const iss = issuer()
  return NextResponse.json(
    {
      specVersion: '1.0',
      site: {
        name: 'Kennerspiel',
        url: iss,
        description: "Digital tabletop for Uwe Rosenberg's Ora et Labora.",
      },
      capabilities: [
        {
          id: 'play-ora-et-labora-hub',
          description: 'Cross-instance MCP hub. Exposes list_my_games.',
          endpoint: `${iss}/api/mcp`,
          method: 'POST',
          protocol: 'MCP',
          auth: 'oauth2',
          authEndpoint: `${iss}/authorize`,
          authDocs: `${iss}/.well-known/oauth-authorization-server`,
          scopes: ['play'],
        },
        {
          id: 'play-ora-et-labora-instance',
          description:
            'Per-game MCP endpoint. Exposes get_game, join_game, get_legal_moves, make_move, undo_move, wait_for_my_turn, get_strategy_guide. The /mcp suffix is optional — POST/JSON requests to /instance/<uuid> are routed here.',
          endpoint_template: `${iss}/instance/{instance_id}/mcp`,
          method: 'POST',
          protocol: 'MCP',
          auth: 'oauth2',
          authEndpoint: `${iss}/authorize`,
          authDocs: `${iss}/.well-known/oauth-authorization-server`,
          scopes: ['play'],
        },
        {
          id: 'mcp-discovery',
          description: 'MCP server card describing the transports, auth, and tool catalog.',
          endpoint: `${iss}/.well-known/mcp.json`,
          method: 'GET',
          protocol: 'REST',
          auth: 'none',
        },
        {
          id: 'openapi-spec',
          description: 'OpenAPI 3.1 description of the HTTP surface.',
          endpoint: `${iss}/openapi.json`,
          method: 'GET',
          protocol: 'REST',
          auth: 'none',
        },
      ],
      agents: {
        '*': {
          rateLimit: { requests: 60, window: 'minute' },
        },
      },
      allow: [
        '/api/mcp',
        '/instance/*/mcp',
        '/instance/*',
        '/.well-known/*',
        '/openapi.json',
        '/llms.txt',
        '/agents.txt',
        '/agents.json',
      ],
      disallow: ['/account/*', '/private/*'],
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'X-Content-Type-Options': 'nosniff',
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
      },
    }
  )
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

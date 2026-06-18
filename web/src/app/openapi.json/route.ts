import { NextResponse } from 'next/server'
import { issuer, SCOPE } from '@/oauth/config'

// OpenAPI 3.1 description of the HTTP surface exposed by kennerspiel.com:
// the MCP transports (hub at /api/mcp and per-instance at /instance/{id}/mcp)
// plus the OAuth 2.1 authorization-server endpoints. Linked from page <head>
// via rel="service-desc".
export const GET = () => {
  const iss = issuer()
  return NextResponse.json(
    {
      openapi: '3.1.0',
      info: {
        title: 'Kennerspiel',
        version: '1.1.0',
        summary: 'Kennerspiel MCP server (hub + per-instance) and OAuth 2.1 endpoints.',
        description:
          'HTTP surface for kennerspiel.com — the MCP hub at /api/mcp (every tool, with instance_id as an argument), per-game MCP endpoints at /instance/{instance_id}/mcp (also reachable as /instance/{instance_id}, instance_id baked into the URL), and the OAuth 2.1 + PKCE authorization-server endpoints (RFC 7591 dynamic registration, RFC 8414 metadata, RFC 9728 protected-resource metadata) that gate them. One token covers every MCP endpoint on this origin.',
        license: { name: 'GPL-3.0', identifier: 'GPL-3.0' },
        contact: { name: 'philihp', url: 'https://github.com/philihp/kennerspiel' },
      },
      servers: [{ url: iss }],
      components: {
        securitySchemes: {
          oauth2: {
            type: 'oauth2',
            description:
              'OAuth 2.1 authorization code with PKCE. Tokens have a 30-day TTL and cover every MCP endpoint on this origin.',
            flows: {
              authorizationCode: {
                authorizationUrl: `${iss}/authorize`,
                tokenUrl: `${iss}/token`,
                scopes: { [SCOPE]: 'Play Ora et Labora as the signed-in Kennerspiel user.' },
              },
            },
          },
        },
        parameters: {
          InstanceId: {
            name: 'instance_id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
            description: 'The game instance UUID.',
          },
        },
      },
      paths: {
        '/api/mcp': {
          post: {
            operationId: 'mcpHubRpc',
            summary: 'MCP hub (full toolset).',
            description:
              'Streamable-HTTP MCP transport. Exposes every tool: list_my_games, get_game, join_game, get_legal_moves, make_move, undo_move, wait_for_my_turn, get_strategy_guide. Per-game tools take an instance_id argument. This is the recommended endpoint for account-level integrations (claude.ai, ChatGPT) — connect once and play any game.',
            security: [{ oauth2: [SCOPE] }],
            requestBody: {
              required: true,
              content: { 'application/json': { schema: { type: 'object' } } },
            },
            responses: {
              200: {
                description: 'JSON-RPC response.',
                content: { 'application/json': { schema: { type: 'object' } } },
              },
              401: { description: 'Missing or invalid bearer token.' },
            },
          },
        },
        '/instance/{instance_id}/mcp': {
          post: {
            operationId: 'mcpInstanceRpc',
            summary: 'Per-game MCP endpoint.',
            description:
              'Streamable-HTTP MCP transport scoped to one game. Same play-the-game tools as the hub (get_game, join_game, get_legal_moves, make_move, undo_move, wait_for_my_turn, get_strategy_guide), but instance_id is baked into the URL instead of appearing as a tool argument.',
            security: [{ oauth2: [SCOPE] }],
            parameters: [{ $ref: '#/components/parameters/InstanceId' }],
            requestBody: {
              required: true,
              content: { 'application/json': { schema: { type: 'object' } } },
            },
            responses: {
              200: {
                description: 'JSON-RPC response.',
                content: { 'application/json': { schema: { type: 'object' } } },
              },
              401: { description: 'Missing or invalid bearer token.' },
              404: { description: 'instance_id is not a UUID.' },
            },
          },
        },
        '/instance/{instance_id}': {
          post: {
            operationId: 'mcpInstanceAlias',
            summary: 'Per-game MCP endpoint (alias — /mcp suffix optional).',
            description:
              'Same handler as /instance/{instance_id}/mcp. Requests with a Bearer token, JSON-RPC body, or SSE Accept header are routed to the MCP handler so users can paste plain instance URLs into Claude or ChatGPT.',
            security: [{ oauth2: [SCOPE] }],
            parameters: [{ $ref: '#/components/parameters/InstanceId' }],
            requestBody: {
              required: true,
              content: { 'application/json': { schema: { type: 'object' } } },
            },
            responses: {
              200: {
                description: 'JSON-RPC response.',
                content: { 'application/json': { schema: { type: 'object' } } },
              },
              401: { description: 'Missing or invalid bearer token.' },
            },
          },
          get: {
            operationId: 'instanceHtml',
            summary: 'Per-game HTML view (browser).',
            description:
              'Returns the HTML game page for browsers. MCP clients (Bearer token, SSE Accept) are rewritten to the /mcp handler before reaching this page.',
            parameters: [{ $ref: '#/components/parameters/InstanceId' }],
            responses: {
              200: { description: 'HTML page.', content: { 'text/html': {} } },
            },
          },
        },
        '/register': {
          post: {
            operationId: 'registerClient',
            summary: 'RFC 7591 dynamic client registration.',
            requestBody: {
              required: true,
              content: { 'application/json': { schema: { type: 'object' } } },
            },
            responses: {
              201: {
                description: 'Client registered.',
                content: { 'application/json': { schema: { type: 'object' } } },
              },
            },
          },
        },
        '/authorize': {
          get: {
            operationId: 'authorize',
            summary: 'OAuth 2.1 authorization endpoint (PKCE required).',
            parameters: [
              { name: 'response_type', in: 'query', required: true, schema: { type: 'string', enum: ['code'] } },
              { name: 'client_id', in: 'query', required: true, schema: { type: 'string' } },
              { name: 'redirect_uri', in: 'query', required: true, schema: { type: 'string', format: 'uri' } },
              { name: 'code_challenge', in: 'query', required: true, schema: { type: 'string' } },
              {
                name: 'code_challenge_method',
                in: 'query',
                required: true,
                schema: { type: 'string', enum: ['S256'] },
              },
              { name: 'scope', in: 'query', required: false, schema: { type: 'string', default: SCOPE } },
              { name: 'state', in: 'query', required: false, schema: { type: 'string' } },
              {
                name: 'resource',
                in: 'query',
                required: false,
                schema: { type: 'string', format: 'uri' },
                description:
                  'RFC 8707 resource indicator. Any URL whose origin matches this issuer is accepted (e.g. the origin itself, /api/mcp, or /instance/<uuid>/mcp).',
              },
            ],
            responses: {
              302: { description: 'Redirect back to the client with code and state.' },
              200: { description: 'Authorization consent page (when the user is not yet signed in).' },
            },
          },
        },
        '/token': {
          post: {
            operationId: 'token',
            summary: 'OAuth 2.1 token endpoint (authorization_code grant).',
            requestBody: {
              required: true,
              content: {
                'application/x-www-form-urlencoded': {
                  schema: {
                    type: 'object',
                    required: ['grant_type', 'code', 'redirect_uri', 'client_id', 'code_verifier'],
                    properties: {
                      grant_type: { type: 'string', enum: ['authorization_code'] },
                      code: { type: 'string' },
                      redirect_uri: { type: 'string', format: 'uri' },
                      client_id: { type: 'string' },
                      code_verifier: { type: 'string' },
                    },
                  },
                },
              },
            },
            responses: {
              200: {
                description: 'Access token issued.',
                content: { 'application/json': { schema: { type: 'object' } } },
              },
              400: { description: 'Invalid grant.' },
            },
          },
        },
        '/.well-known/oauth-authorization-server': {
          get: {
            operationId: 'oauthAuthorizationServerMetadata',
            summary: 'RFC 8414 authorization server metadata.',
            responses: {
              200: { description: 'JSON metadata.', content: { 'application/json': { schema: { type: 'object' } } } },
            },
          },
        },
        '/.well-known/oauth-protected-resource': {
          get: {
            operationId: 'oauthProtectedResourceMetadata',
            summary: 'RFC 9728 protected resource metadata.',
            responses: {
              200: { description: 'JSON metadata.', content: { 'application/json': { schema: { type: 'object' } } } },
            },
          },
        },
        '/.well-known/mcp.json': {
          get: {
            operationId: 'mcpDiscovery',
            summary: 'MCP server discovery document.',
            responses: {
              200: {
                description: 'JSON server card.',
                content: { 'application/json': { schema: { type: 'object' } } },
              },
            },
          },
        },
      },
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

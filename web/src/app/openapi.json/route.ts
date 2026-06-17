import { NextResponse } from 'next/server'
import { issuer, SCOPE } from '@/oauth/config'

// OpenAPI 3.1 description of the HTTP surface exposed by kennerspiel.com:
// the MCP transport endpoint plus the OAuth 2.1 authorization-server endpoints
// that gate access to it. Linked from page <head> via rel="service-desc".
export const GET = () => {
  const iss = issuer()
  return NextResponse.json(
    {
      openapi: '3.1.0',
      info: {
        title: 'Kennerspiel',
        version: '1.0.0',
        summary: 'Kennerspiel MCP server and OAuth 2.1 endpoints.',
        description:
          'HTTP surface for kennerspiel.com — the MCP transport at /api/mcp plus the OAuth 2.1 + PKCE authorization-server endpoints (RFC 7591 dynamic registration, RFC 8414 metadata, RFC 9728 protected-resource metadata) that gate it.',
        license: { name: 'GPL-3.0', identifier: 'GPL-3.0' },
        contact: { name: 'philihp', url: 'https://github.com/philihp/kennerspiel' },
      },
      servers: [{ url: iss }],
      components: {
        securitySchemes: {
          oauth2: {
            type: 'oauth2',
            description: 'OAuth 2.1 authorization code with PKCE. Tokens have a 30-day TTL.',
            flows: {
              authorizationCode: {
                authorizationUrl: `${iss}/authorize`,
                tokenUrl: `${iss}/token`,
                scopes: { [SCOPE]: 'Play Ora et Labora as the signed-in Kennerspiel user.' },
              },
            },
          },
        },
      },
      paths: {
        '/api/mcp': {
          post: {
            operationId: 'mcpRpc',
            summary: 'Model Context Protocol transport.',
            description:
              'Streamable-HTTP MCP transport. Send JSON-RPC requests for tools/list, tools/call, etc. Tools: list_my_games, get_game, get_legal_moves, join_game, make_move, undo_move, get_strategy_guide, wait_for_my_turn.',
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
              { name: 'resource', in: 'query', required: false, schema: { type: 'string', format: 'uri' } },
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

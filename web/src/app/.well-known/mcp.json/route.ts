import { NextResponse } from 'next/server'
import { issuer, SCOPE } from '@/oauth/config'

// Discovery document for the Kennerspiel MCP server. Combines the shape of the
// SEP-1649 "server card" with the SEP-1960 manifest so either flavor of MCP
// client can locate the transport endpoint, the OAuth metadata, and the tool
// catalog without first completing a JSON-RPC handshake.
export const GET = () => {
  const iss = issuer()
  const mcpUrl = `${iss}/api/mcp`
  return NextResponse.json(
    {
      $schema: 'https://modelcontextprotocol.io/schemas/server-card/v1.0',
      version: '1.0',
      protocolVersion: '2025-06-18',
      serverInfo: {
        name: 'Kennerspiel',
        version: '1.0.0',
        description:
          "MCP server for Uwe Rosenberg's Ora et Labora on kennerspiel.com — read the board, enumerate legal moves, and play as the authenticated user.",
        homepage: iss,
        vendor: 'Kennerspiel',
        license: 'GPL-3.0',
        repository: 'https://github.com/philihp/kennerspiel',
      },
      transport: {
        type: 'streamable-http',
        url: mcpUrl,
      },
      endpoints: [
        {
          url: mcpUrl,
          transport: 'streamable-http',
          capabilities: ['tools'],
          auth: {
            type: 'oauth2',
            authorization_server: `${iss}/.well-known/oauth-authorization-server`,
            protected_resource: `${iss}/.well-known/oauth-protected-resource`,
            scopes: [SCOPE],
          },
        },
      ],
      capabilities: {
        tools: true,
        resources: false,
        prompts: false,
      },
      auth: {
        type: 'oauth2',
        authorization_server: `${iss}/.well-known/oauth-authorization-server`,
        protected_resource: `${iss}/.well-known/oauth-protected-resource`,
        scopes: [SCOPE],
      },
      tools: [
        {
          name: 'list_my_games',
          description:
            'List the Ora et Labora games this agent is seated in. Filter to games waiting on your move with only_my_turn.',
        },
        {
          name: 'get_game',
          description:
            'Read the current board state of one game: rondel, player tableaus and landscapes, scores, whose turn it is, and recent moves.',
        },
        {
          name: 'get_legal_moves',
          description:
            'Enumerate legal next tokens of a move command. Interactive drill-down from an empty partial to a complete command.',
        },
        {
          name: 'join_game',
          description: 'Claim a seat in an Ora et Labora lobby that has not yet started, by game UUID or URL.',
        },
        {
          name: 'make_move',
          description:
            'Play one complete move command in a game where it is your turn (e.g. USE LR2, BUILD G07 3 2, COMMIT).',
        },
        {
          name: 'undo_move',
          description: 'Retract the most recent command. Only the active player can undo, one command at a time.',
        },
        {
          name: 'get_strategy_guide',
          description: 'Return the full strategic coaching guide for Ora et Labora (France variant, long 2p).',
        },
        {
          name: 'wait_for_my_turn',
          description: 'Long-poll until it becomes your turn in the given game, the game ends, or the timeout elapses.',
        },
      ],
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

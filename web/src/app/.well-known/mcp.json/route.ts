import { NextResponse } from 'next/server'
import { issuer, SCOPE } from '@/oauth/config'

// Discovery document for the Kennerspiel MCP server. Combines the shape of the
// SEP-1649 "server card" with the SEP-1960 manifest so either flavor of MCP
// client can locate the transport endpoint, the OAuth metadata, and the tool
// catalog without first completing a JSON-RPC handshake.
//
// Two transports are advertised:
//   - Hub at /api/mcp exposes list_my_games (cross-instance).
//   - Per-instance at /instance/{instance_id}/mcp (alias: /instance/{instance_id})
//     exposes the play-the-game tools. One OAuth token covers both.
export const GET = () => {
  const iss = issuer()
  const hubUrl = `${iss}/api/mcp`
  const perInstanceTemplate = `${iss}/instance/{instance_id}/mcp`
  const oauth = {
    type: 'oauth2',
    authorization_server: `${iss}/.well-known/oauth-authorization-server`,
    protected_resource: `${iss}/.well-known/oauth-protected-resource`,
    scopes: [SCOPE],
  }
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
        url: hubUrl,
      },
      endpoints: [
        {
          url: hubUrl,
          transport: 'streamable-http',
          capabilities: ['tools'],
          auth: oauth,
          description:
            'Cross-instance hub. Exposes list_my_games. Use this to find a game, then connect to its per-instance endpoint to play.',
          tools: ['list_my_games'],
        },
        {
          url_template: perInstanceTemplate,
          transport: 'streamable-http',
          capabilities: ['tools'],
          auth: oauth,
          description:
            'Per-game endpoint. The /mcp suffix is optional — POST/JSON requests to https://kennerspiel.com/instance/<uuid> are routed here. Exposes the play-the-game tools.',
          tools: [
            'get_game',
            'join_game',
            'get_legal_moves',
            'make_move',
            'undo_move',
            'wait_for_my_turn',
            'get_strategy_guide',
          ],
        },
      ],
      capabilities: {
        tools: true,
        resources: false,
        prompts: false,
      },
      auth: oauth,
      tools: [
        {
          name: 'list_my_games',
          endpoint: 'hub',
          description:
            'List the Ora et Labora games this agent is seated in. Filter to games waiting on your move with only_my_turn.',
        },
        {
          name: 'get_game',
          endpoint: 'per-instance',
          description:
            'Read the current board state of this game: rondel, player tableaus and landscapes, scores, whose turn it is, and recent moves.',
        },
        {
          name: 'get_legal_moves',
          endpoint: 'per-instance',
          description:
            'Enumerate legal next tokens of a move command. Interactive drill-down from an empty partial to a complete command.',
        },
        {
          name: 'join_game',
          endpoint: 'per-instance',
          description: 'Claim a seat in the lobby of this game (only while the lobby is still open).',
        },
        {
          name: 'make_move',
          endpoint: 'per-instance',
          description:
            'Play one complete move command in this game when it is your turn (e.g. USE LR2, BUILD G07 3 2, COMMIT).',
        },
        {
          name: 'undo_move',
          endpoint: 'per-instance',
          description: 'Retract the most recent command. Only the active player can undo, one command at a time.',
        },
        {
          name: 'wait_for_my_turn',
          endpoint: 'per-instance',
          description: 'Long-poll until it becomes your turn in this game, the game ends, or the timeout elapses.',
        },
        {
          name: 'get_strategy_guide',
          endpoint: 'per-instance',
          description: 'Return the full strategic coaching guide for Ora et Labora (France variant, long 2p).',
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

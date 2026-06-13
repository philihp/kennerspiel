import { createMcpHandler, withMcpAuth } from 'mcp-handler'
import { AuthInfo } from '@modelcontextprotocol/sdk/server/auth/types.js'
import { z } from 'zod'
import { listMyGames } from '@/mcp/tools/listMyGames'
import { getGame } from '@/mcp/tools/getGame'
import { getLegalMoves } from '@/mcp/tools/getLegalMoves'
import { makeMove } from '@/mcp/tools/makeMove'
import { joinGame } from '@/mcp/tools/joinGame'
import { errorResult } from '@/mcp/content'
import { resolveAccessToken } from '@/oauth/store'

const userIdFrom = (extra: { authInfo?: AuthInfo }): string | undefined =>
  (extra.authInfo?.extra as { userId?: string } | undefined)?.userId

const unauthenticated = () => errorResult('Unauthenticated: no user is bound to this MCP session.')

const handler = createMcpHandler(
  (server) => {
    server.tool(
      'list_my_games',
      'List the Ora et Labora games this agent is seated in. Call this first to find a game, or with only_my_turn to check whether any game is waiting on you.',
      { only_my_turn: z.boolean().optional().describe('Only return games where it is currently your turn') },
      async ({ only_my_turn }, extra) => {
        const userId = userIdFrom(extra)
        if (!userId) return unauthenticated()
        return listMyGames({ userId, onlyMyTurn: only_my_turn ?? false })
      }
    )
    server.tool(
      'get_game',
      'Read the current board state of one game: rondel, player tableaus and landscapes, scores, whose turn it is, and recent moves. Call this before deciding on a move.',
      {
        instance_id: z.string().uuid().describe('The game instance id, from list_my_games'),
        detail: z
          .enum(['summary', 'full'])
          .optional()
          .describe('summary (default) is a curated rendering; full is the raw engine state for debugging'),
      },
      async ({ instance_id, detail }, extra) => {
        const userId = userIdFrom(extra)
        if (!userId) return unauthenticated()
        return getGame({ userId, instanceId: instance_id, detail: detail ?? 'summary' })
      }
    )
    server.tool(
      'get_legal_moves',
      'List the legal next tokens of a move command. Call with an empty partial to see available verbs (USE, BUILD, COMMIT, ...), then append tokens and call again to drill down until a complete command is formed.',
      {
        instance_id: z.string().uuid().describe('The game instance id'),
        partial: z
          .array(z.string())
          .optional()
          .describe('The tokens chosen so far, e.g. [] then ["BUILD"] then ["BUILD","G07"]'),
      },
      async ({ instance_id, partial }, extra) => {
        const userId = userIdFrom(extra)
        if (!userId) return unauthenticated()
        return getLegalMoves({ userId, instanceId: instance_id, partial: partial ?? [] })
      }
    )
    server.tool(
      'join_game',
      'Claim a seat in an Ora et Labora lobby that has not yet started. Pass either the game instance id or its URL (e.g. https://kennerspiel.com/instance/<uuid>) along with the color you want to play. If you already have a seat in that game, your color is updated. Wait for the human to choose the variant and press START on the website before calling get_game.',
      {
        instance: z
          .string()
          .min(1)
          .describe(
            'Either the game instance UUID or a URL containing it, e.g. https://kennerspiel.com/instance/<uuid>'
          ),
        color: z.enum(['red', 'green', 'blue', 'white']).describe('Which seat color to claim'),
      },
      async ({ instance, color }, extra) => {
        const userId = userIdFrom(extra)
        if (!userId) return unauthenticated()
        return joinGame({ userId, instanceRef: instance, color })
      }
    )
    server.tool(
      'make_move',
      'Play one complete move command in a game where it is your turn, e.g. "USE LR2" or "BUILD G07 3 2" or "COMMIT". The command must be legal per get_legal_moves. Note most turns are several commands ending with COMMIT.',
      {
        instance_id: z.string().uuid().describe('The game instance id'),
        command: z.string().min(1).describe('A complete space-separated command'),
      },
      async ({ instance_id, command }, extra) => {
        const userId = userIdFrom(extra)
        if (!userId) return unauthenticated()
        return makeMove({ userId, instanceId: instance_id, command })
      }
    )
  },
  {},
  { basePath: '/api' }
)

const verifyToken = async (_req: Request, bearerToken?: string): Promise<AuthInfo | undefined> => {
  if (!bearerToken) return undefined
  const resolved = await resolveAccessToken(bearerToken)
  if (!resolved) return undefined
  return {
    token: bearerToken,
    clientId: resolved.clientId,
    scopes: resolved.scopes,
    expiresAt: resolved.expiresAt,
    extra: { userId: resolved.userId },
  }
}

const authHandler = withMcpAuth(handler, verifyToken, { required: true })

export { authHandler as GET, authHandler as POST, authHandler as DELETE }
export const maxDuration = 60

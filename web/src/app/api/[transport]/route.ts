import { createMcpHandler, withMcpAuth } from 'mcp-handler'
import { AuthInfo } from '@modelcontextprotocol/sdk/server/auth/types.js'
import { track } from '@vercel/analytics/server'
import { z } from 'zod'
import { listMyGames } from '@/mcp/tools/listMyGames'
import { getGame } from '@/mcp/tools/getGame'
import { getLegalMoves } from '@/mcp/tools/getLegalMoves'
import { makeMove } from '@/mcp/tools/makeMove'
import { undoMove } from '@/mcp/tools/undoMove'
import { joinGame } from '@/mcp/tools/joinGame'
import { waitForMyTurn } from '@/mcp/tools/waitForMyTurn'
import { errorResult } from '@/mcp/content'
import { resolveAccessToken } from '@/oauth/store'

const userIdFrom = (extra: { authInfo?: AuthInfo }): string | undefined =>
  (extra.authInfo?.extra as { userId?: string } | undefined)?.userId

const unauthenticated = () => errorResult('Unauthenticated: no user is bound to this MCP session.')

const trackToolCall = (tool: string, userId: string | undefined): void => {
  track('mcp_tool_call', { tool, userId: userId ?? 'anonymous' }).catch(() => {})
}

const handler = createMcpHandler(
  (server) => {
    server.tool(
      'list_my_games',
      'List the Ora et Labora games this agent is seated in. Call this first to find a game, or with only_my_turn to check whether any game is waiting on you.',
      { only_my_turn: z.boolean().optional().describe('Only return games where it is currently your turn') },
      async ({ only_my_turn }, extra) => {
        const userId = userIdFrom(extra)
        trackToolCall('list_my_games', userId)
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
        trackToolCall('get_game', userId)
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
        trackToolCall('get_legal_moves', userId)
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
        trackToolCall('join_game', userId)
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
        trackToolCall('make_move', userId)
        if (!userId) return unauthenticated()
        return makeMove({ userId, instanceId: instance_id, command })
      }
    )
    server.tool(
      'undo_move',
      'Undo your most recently played command in a game. This is not part of normal play — only use it when the human asks you to, e.g. to retract a sub-optimal move so they can teach a better one. Removes one command at a time (call repeatedly to roll back a multi-command turn). Only the most recent command can be undone, and only if it was your own (active when it was played). Returns the resulting state.',
      {
        instance_id: z.string().uuid().describe('The game instance id'),
      },
      async ({ instance_id }, extra) => {
        const userId = userIdFrom(extra)
        trackToolCall('undo_move', userId)
        if (!userId) return unauthenticated()
        return undoMove({ userId, instanceId: instance_id })
      }
    )
    server.tool(
      'wait_for_my_turn',
      'Block until it becomes your turn in the given game, the game ends, or the timeout elapses. Use this instead of repeatedly polling get_game/list_my_games while waiting on other players. Pass color to wait for one specific seat (useful when this agent holds multiple seats in the same game and a sibling agent is playing the other color). Returns the same shape as list_my_games plus a timed_out flag.',
      {
        instance_id: z.string().uuid().describe('The game instance id'),
        color: z
          .enum(['red', 'green', 'blue', 'white'])
          .optional()
          .describe(
            'Wait until this specific seat becomes active. Must be a color you are seated as. Omit to wait for any of your seats.'
          ),
        timeout_sec: z
          .number()
          .int()
          .min(1)
          .max(55)
          .optional()
          .describe('How long to wait before returning, in seconds (default 50, max 55 — request maxDuration is 60s)'),
      },
      async ({ instance_id, color, timeout_sec }, extra) => {
        const userId = userIdFrom(extra)
        trackToolCall('wait_for_my_turn', userId)
        if (!userId) return unauthenticated()
        return waitForMyTurn({ userId, instanceId: instance_id, color, timeoutSec: timeout_sec ?? 50 })
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

import { createMcpHandler, withMcpAuth } from 'mcp-handler'
import { AuthInfo, ServerContext } from '@modelcontextprotocol/server'
import { track } from '@vercel/analytics/server'
import { z } from 'zod'
import { listMyGames } from '@/mcp/tools/listMyGames'
import { getGame } from '@/mcp/tools/getGame'
import { getLegalMoves } from '@/mcp/tools/getLegalMoves'
import { makeMove } from '@/mcp/tools/makeMove'
import { undoMove } from '@/mcp/tools/undoMove'
import { joinGame } from '@/mcp/tools/joinGame'
import { waitForMyTurn } from '@/mcp/tools/waitForMyTurn'
import { getStrategyGuide } from '@/mcp/tools/getStrategyGuide'
import { subscribeEvents } from '@/mcp/tools/subscribeEvents'
import { errorResult } from '@/mcp/content'
import { resolveAccessToken } from '@/oauth/store'

// Hub MCP server. Exposes every tool so a user who adds the connector once in
// Claude / ChatGPT can play any of their games from any conversation. The
// per-instance endpoint at /instance/<id>/mcp mirrors the play-the-game tools
// without an instance_id parameter, for users who'd rather drop a per-game URL.
const userIdFrom = (ctx: ServerContext): string | undefined =>
  (ctx.http?.authInfo?.extra as { userId?: string } | undefined)?.userId

const unauthenticated = () => errorResult('Unauthenticated: no user is bound to this MCP session.')

const trackToolCall = (tool: string, userId: string | undefined): void => {
  track('mcp_tool_call', { tool, userId: userId ?? 'anonymous' }).catch(() => {})
}

const handler = createMcpHandler((server) => {
  server.registerTool(
    'list_my_games',
    {
      description:
        'List the Ora et Labora games this agent is seated in. Call this first to find a game, or with only_my_turn to check whether any game is waiting on you.',
      inputSchema: z.object({
        only_my_turn: z.boolean().optional().describe('Only return games where it is currently your turn'),
      }),
    },
    async ({ only_my_turn }, ctx) => {
      const userId = userIdFrom(ctx)
      trackToolCall('list_my_games', userId)
      if (!userId) return unauthenticated()
      return listMyGames({ userId, onlyMyTurn: only_my_turn ?? false })
    }
  )
  server.registerTool(
    'get_game',
    {
      description:
        'Read the current board state of one game: rondel, player tableaus and landscapes, scores, whose turn it is, and recent moves. Call this before deciding on a move.',
      inputSchema: z.object({
        instance_id: z.string().uuid().describe('The game instance id, from list_my_games'),
        detail: z
          .enum(['summary', 'full'])
          .optional()
          .describe('summary (default) is a curated rendering; full is the raw engine state for debugging'),
      }),
    },
    async ({ instance_id, detail }, ctx) => {
      const userId = userIdFrom(ctx)
      trackToolCall('get_game', userId)
      if (!userId) return unauthenticated()
      return getGame({ userId, instanceId: instance_id, detail: detail ?? 'summary' })
    }
  )
  server.registerTool(
    'get_legal_moves',
    {
      description:
        'List the legal next tokens of a move command. Call with an empty partial to see available verbs (USE, BUILD, COMMIT, ...), then append tokens and call again to drill down until a complete command is formed.',
      inputSchema: z.object({
        instance_id: z.string().uuid().describe('The game instance id'),
        partial: z
          .array(z.string())
          .optional()
          .describe('The tokens chosen so far, e.g. [] then ["BUILD"] then ["BUILD","G07"]'),
      }),
    },
    async ({ instance_id, partial }, ctx) => {
      const userId = userIdFrom(ctx)
      trackToolCall('get_legal_moves', userId)
      if (!userId) return unauthenticated()
      return getLegalMoves({ userId, instanceId: instance_id, partial: partial ?? [] })
    }
  )
  server.registerTool(
    'join_game',
    {
      description:
        'Claim a seat in an Ora et Labora lobby that has not yet started. Pass either the game instance id or its URL (e.g. https://kennerspiel.com/instance/<uuid>) along with the color you want to play. If you already have a seat in that game, your color is updated. Wait for the human to choose the variant and press START on the website before calling get_game.',
      inputSchema: z.object({
        instance: z
          .string()
          .min(1)
          .describe(
            'Either the game instance UUID or a URL containing it, e.g. https://kennerspiel.com/instance/<uuid>'
          ),
        color: z.enum(['red', 'green', 'blue', 'white']).describe('Which seat color to claim'),
      }),
    },
    async ({ instance, color }, ctx) => {
      const userId = userIdFrom(ctx)
      trackToolCall('join_game', userId)
      if (!userId) return unauthenticated()
      return joinGame({ userId, instanceRef: instance, color })
    }
  )
  server.registerTool(
    'make_move',
    {
      description:
        'Play one complete move command in a game where it is your turn, e.g. "USE LR2" or "BUILD G07 3 2" or "COMMIT". The command must be legal per get_legal_moves. Note most turns are several commands ending with COMMIT.',
      inputSchema: z.object({
        instance_id: z.string().uuid().describe('The game instance id'),
        command: z.string().min(1).describe('A complete space-separated command'),
      }),
    },
    async ({ instance_id, command }, ctx) => {
      const userId = userIdFrom(ctx)
      trackToolCall('make_move', userId)
      if (!userId) return unauthenticated()
      return makeMove({ userId, instanceId: instance_id, command })
    }
  )
  server.registerTool(
    'undo_move',
    {
      description:
        'Undo your most recently played command in a game. This is not part of normal play — only use it when the human asks you to, e.g. to retract a sub-optimal move so they can teach a better one. Removes one command at a time (call repeatedly to roll back a multi-command turn). Only the most recent command can be undone, and only if it was your own (active when it was played). Returns the resulting state.',
      inputSchema: z.object({
        instance_id: z.string().uuid().describe('The game instance id'),
      }),
    },
    async ({ instance_id }, ctx) => {
      const userId = userIdFrom(ctx)
      trackToolCall('undo_move', userId)
      if (!userId) return unauthenticated()
      return undoMove({ userId, instanceId: instance_id })
    }
  )
  server.registerTool(
    'wait_for_my_turn',
    {
      description:
        'Block until it becomes your turn in the given game, the game ends, or the timeout elapses. Use this instead of repeatedly polling get_game/list_my_games while waiting on other players. Pass color to wait for one specific seat (useful when this agent holds multiple seats in the same game and a sibling agent is playing the other color). Returns the same shape as list_my_games plus a timed_out flag.',
      inputSchema: z.object({
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
      }),
    },
    async ({ instance_id, color, timeout_sec }, ctx) => {
      const userId = userIdFrom(ctx)
      trackToolCall('wait_for_my_turn', userId)
      if (!userId) return unauthenticated()
      return waitForMyTurn({ userId, instanceId: instance_id, color, timeoutSec: timeout_sec ?? 50 })
    }
  )
  server.registerTool(
    'get_strategy_guide',
    {
      description:
        'Return the full strategic coaching guide for Ora et Labora (France variant, long 2p). Covers action economy, clergy hierarchy, settlement evaluation, converter priorities, building identity reference, engine quirks, endgame protocols, and opening book. Call this at the start of a session or when planning a non-trivial move.',
    },
    (ctx) => {
      trackToolCall('get_strategy_guide', userIdFrom(ctx))
      return getStrategyGuide()
    }
  )
  server.registerTool(
    'subscribe_events',
    {
      description:
        'Subscribe to live game-state events across the games you are seated in (push-driven via Supabase realtime — the same channel the website uses). Returns when at least min_events events have been collected, or when timeout_sec elapses. Each event includes instance_id, status, active_color, move_count, my_colors, my_turn, and the latest_command appended. Prefer this over polling list_my_games or wait_for_my_turn — wakeup latency is single-digit ms.',
      inputSchema: z.object({
        filter_instance_ids: z
          .array(z.string().uuid())
          .optional()
          .describe('Only watch these instance ids. Default: every game you are seated in.'),
        filter_my_turn: z
          .boolean()
          .optional()
          .describe('Drop events that do not put you on turn. Default false (return every state change).'),
        timeout_sec: z
          .number()
          .int()
          .min(1)
          .max(55)
          .optional()
          .describe('How long to wait before returning, in seconds (default 50, max 55 — request maxDuration is 60s).'),
        min_events: z
          .number()
          .int()
          .min(1)
          .max(100)
          .optional()
          .describe('Return as soon as this many events have been collected. Default 1 (wake on first event).'),
        max_events: z.number().int().min(1).max(500).optional().describe('Hard cap on returned events. Default 50.'),
      }),
    },
    async ({ filter_instance_ids, filter_my_turn, timeout_sec, min_events, max_events }, ctx) => {
      const userId = userIdFrom(ctx)
      trackToolCall('subscribe_events', userId)
      if (!userId) return unauthenticated()
      return subscribeEvents({
        userId,
        filterInstanceIds: filter_instance_ids,
        filterMyTurn: filter_my_turn ?? false,
        timeoutSec: timeout_sec ?? 50,
        minEvents: min_events ?? 1,
        maxEvents: max_events ?? 50,
      })
    }
  )
})

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

import { createMcpHandler, withMcpAuth } from 'mcp-handler'
import { AuthInfo } from '@modelcontextprotocol/sdk/server/auth/types.js'
import { track } from '@vercel/analytics/server'
import { z } from 'zod'
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

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const userIdFrom = (extra: { authInfo?: AuthInfo }): string | undefined =>
  (extra.authInfo?.extra as { userId?: string } | undefined)?.userId

const unauthenticated = () => errorResult('Unauthenticated: no user is bound to this MCP session.')

const trackToolCall = (tool: string, userId: string | undefined, instanceId: string): void => {
  track('mcp_tool_call', { tool, userId: userId ?? 'anonymous', instanceId }).catch(() => {})
}

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

// The MCP server is rebuilt per-request so each tool closure captures the
// instance_id parsed from the URL. instance_id never appears in tool schemas:
// the URL is the only source of truth, which is what lets an agent join a game
// just by being given the instance URL.
const buildHandler = (instanceId: string) =>
  createMcpHandler(
    (server) => {
      server.tool(
        'get_game',
        'Read the current board state of this game: rondel, player tableaus and landscapes, scores, whose turn it is, and recent moves. Call this before deciding on a move.',
        {
          detail: z
            .enum(['summary', 'full'])
            .optional()
            .describe('summary (default) is a curated rendering; full is the raw engine state for debugging'),
        },
        async ({ detail }, extra) => {
          const userId = userIdFrom(extra)
          trackToolCall('get_game', userId, instanceId)
          if (!userId) return unauthenticated()
          return getGame({ userId, instanceId, detail: detail ?? 'summary' })
        }
      )
      server.tool(
        'get_legal_moves',
        'List the legal next tokens of a move command. Call with an empty partial to see available verbs (USE, BUILD, COMMIT, ...), then append tokens and call again to drill down until a complete command is formed.',
        {
          partial: z
            .array(z.string())
            .optional()
            .describe('The tokens chosen so far, e.g. [] then ["BUILD"] then ["BUILD","G07"]'),
        },
        async ({ partial }, extra) => {
          const userId = userIdFrom(extra)
          trackToolCall('get_legal_moves', userId, instanceId)
          if (!userId) return unauthenticated()
          return getLegalMoves({ userId, instanceId, partial: partial ?? [] })
        }
      )
      server.tool(
        'join_game',
        'Claim a seat in this game (only works while the lobby is still open). If you already hold the chosen color in this game, your seat is refreshed. Wait for the human to choose the variant and press START on the website before calling get_game.',
        {
          color: z.enum(['red', 'green', 'blue', 'white']).describe('Which seat color to claim'),
        },
        async ({ color }, extra) => {
          const userId = userIdFrom(extra)
          trackToolCall('join_game', userId, instanceId)
          if (!userId) return unauthenticated()
          return joinGame({ userId, instanceRef: instanceId, color })
        }
      )
      server.tool(
        'make_move',
        'Play one complete move command in this game when it is your turn, e.g. "USE LR2" or "BUILD G07 3 2" or "COMMIT". The command must be legal per get_legal_moves. Note most turns are several commands ending with COMMIT.',
        {
          command: z.string().min(1).describe('A complete space-separated command'),
        },
        async ({ command }, extra) => {
          const userId = userIdFrom(extra)
          trackToolCall('make_move', userId, instanceId)
          if (!userId) return unauthenticated()
          return makeMove({ userId, instanceId, command })
        }
      )
      server.tool(
        'undo_move',
        'Undo your most recently played command in this game. This is not part of normal play — only use it when the human asks you to, e.g. to retract a sub-optimal move so they can teach a better one. Removes one command at a time (call repeatedly to roll back a multi-command turn). Only the most recent command can be undone, and only if it was your own (active when it was played). Returns the resulting state.',
        {},
        async (_args, extra) => {
          const userId = userIdFrom(extra)
          trackToolCall('undo_move', userId, instanceId)
          if (!userId) return unauthenticated()
          return undoMove({ userId, instanceId })
        }
      )
      server.tool(
        'wait_for_my_turn',
        'Block until it becomes your turn in this game, the game ends, or the timeout elapses. Use this instead of repeatedly polling get_game while waiting on other players. Pass color to wait for one specific seat (useful when this agent holds multiple seats in the same game and a sibling agent is playing the other color). Returns the same shape as list_my_games plus a timed_out flag.',
        {
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
            .describe(
              'How long to wait before returning, in seconds (default 50, max 55 — request maxDuration is 60s)'
            ),
        },
        async ({ color, timeout_sec }, extra) => {
          const userId = userIdFrom(extra)
          trackToolCall('wait_for_my_turn', userId, instanceId)
          if (!userId) return unauthenticated()
          return waitForMyTurn({ userId, instanceId, color, timeoutSec: timeout_sec ?? 50 })
        }
      )
      server.tool(
        'get_strategy_guide',
        'Return the full strategic coaching guide for Ora et Labora (France variant, long 2p). Covers action economy, clergy hierarchy, settlement evaluation, converter priorities, building identity reference, engine quirks, endgame protocols, and opening book. Call this at the start of a session or when planning a non-trivial move.',
        {},
        (_args, extra) => {
          trackToolCall('get_strategy_guide', userIdFrom(extra), instanceId)
          return getStrategyGuide()
        }
      )
      server.tool(
        'subscribe_events',
        'Subscribe to live game-state events for this game (push-driven via Supabase realtime — the same channel the website uses). Returns when at least min_events events have been collected, or when timeout_sec elapses. Each event includes status, active_color, move_count, my_colors, my_turn, and the latest_command appended. Prefer this over polling — wakeup latency is single-digit ms.',
        {
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
            .describe(
              'How long to wait before returning, in seconds (default 50, max 55 — request maxDuration is 60s).'
            ),
          min_events: z
            .number()
            .int()
            .min(1)
            .max(100)
            .optional()
            .describe('Return as soon as this many events have been collected. Default 1 (wake on first event).'),
          max_events: z.number().int().min(1).max(500).optional().describe('Hard cap on returned events. Default 50.'),
        },
        async ({ filter_my_turn, timeout_sec, min_events, max_events }, extra) => {
          const userId = userIdFrom(extra)
          trackToolCall('subscribe_events', userId, instanceId)
          if (!userId) return unauthenticated()
          return subscribeEvents({
            userId,
            filterInstanceIds: [instanceId],
            filterMyTurn: filter_my_turn ?? false,
            timeoutSec: timeout_sec ?? 50,
            minEvents: min_events ?? 1,
            maxEvents: max_events ?? 50,
          })
        }
      )
    },
    {},
    { basePath: `/instance/${instanceId}` }
  )

const dispatch = async (req: Request, { params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params
  if (!UUID_RE.test(slug)) return new Response('Not Found', { status: 404 })
  const handler = buildHandler(slug)
  const auth = withMcpAuth(handler, verifyToken, { required: true })
  return auth(req)
}

export { dispatch as GET, dispatch as POST, dispatch as DELETE }
export const maxDuration = 60

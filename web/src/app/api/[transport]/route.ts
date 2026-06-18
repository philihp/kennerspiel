import { createMcpHandler, withMcpAuth } from 'mcp-handler'
import { AuthInfo } from '@modelcontextprotocol/sdk/server/auth/types.js'
import { track } from '@vercel/analytics/server'
import { z } from 'zod'
import { listMyGames } from '@/mcp/tools/listMyGames'
import { errorResult } from '@/mcp/content'
import { resolveAccessToken } from '@/oauth/store'

// Cross-instance hub. Per-game tools (get_game, join_game, get_legal_moves,
// make_move, undo_move, wait_for_my_turn, get_strategy_guide) live on the
// per-instance endpoint at /instance/<id>/mcp — one token from the OAuth flow
// covers both endpoints, so users only authorize the connector once.
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
      'List the Ora et Labora games this agent is seated in. Each returned game has an instance_id; the per-game MCP endpoint lives at https://kennerspiel.com/instance/<instance_id>/mcp (or just https://kennerspiel.com/instance/<instance_id>) and exposes get_game, join_game, get_legal_moves, make_move, undo_move, wait_for_my_turn, and get_strategy_guide.',
      { only_my_turn: z.boolean().optional().describe('Only return games where it is currently your turn') },
      async ({ only_my_turn }, extra) => {
        const userId = userIdFrom(extra)
        trackToolCall('list_my_games', userId)
        if (!userId) return unauthenticated()
        return listMyGames({ userId, onlyMyTurn: only_my_turn ?? false })
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

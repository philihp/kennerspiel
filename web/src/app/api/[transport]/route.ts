import { createHash, timingSafeEqual } from 'node:crypto'
import { createMcpHandler, withMcpAuth } from 'mcp-handler'
import { AuthInfo } from '@modelcontextprotocol/sdk/server/auth/types.js'
import { z } from 'zod'
import { listMyGames } from '@/mcp/tools/listMyGames'
import { getGame } from '@/mcp/tools/getGame'
import { getLegalMoves } from '@/mcp/tools/getLegalMoves'
import { makeMove } from '@/mcp/tools/makeMove'

const handler = createMcpHandler(
  (server) => {
    server.tool(
      'list_my_games',
      'List the Ora et Labora games this agent is seated in. Call this first to find a game, or with only_my_turn to check whether any game is waiting on you.',
      { only_my_turn: z.boolean().optional().describe('Only return games where it is currently your turn') },
      async ({ only_my_turn }) => listMyGames({ onlyMyTurn: only_my_turn ?? false })
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
      async ({ instance_id, detail }) => getGame({ instanceId: instance_id, detail: detail ?? 'summary' })
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
      async ({ instance_id, partial }) => getLegalMoves({ instanceId: instance_id, partial: partial ?? [] })
    )
    server.tool(
      'make_move',
      'Play one complete move command in a game where it is your turn, e.g. "USE LR2" or "BUILD G07 3 2" or "COMMIT". The command must be legal per get_legal_moves. Note most turns are several commands ending with COMMIT.',
      {
        instance_id: z.string().uuid().describe('The game instance id'),
        command: z.string().min(1).describe('A complete space-separated command'),
      },
      async ({ instance_id, command }) => makeMove({ instanceId: instance_id, command })
    )
  },
  {},
  { basePath: '/api' }
)

const sha256 = (value: string): Buffer => createHash('sha256').update(value).digest()

const verifyToken = async (_req: Request, bearerToken?: string): Promise<AuthInfo | undefined> => {
  const expected = process.env.MCP_AUTH_TOKEN
  if (!expected || !bearerToken) return undefined
  if (!timingSafeEqual(sha256(bearerToken), sha256(expected))) return undefined
  return { token: bearerToken, scopes: ['play'], clientId: 'kennerspiel-agent' }
}

const authHandler = withMcpAuth(handler, verifyToken, { required: true })

export { authHandler as GET, authHandler as POST, authHandler as DELETE }
export const maxDuration = 60

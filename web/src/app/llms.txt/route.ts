import { issuer } from '@/oauth/config'

// llmstxt.org structured markdown index. Points LLMs at the MCP server, OAuth
// flow, and the strategy guide rather than scraping the React UI.
export const GET = () => {
  const iss = issuer()
  const body = `# Kennerspiel

> Digital tabletop for Uwe Rosenberg's Ora et Labora. Humans play in a browser; AI agents play through a hosted MCP server using the same accounts as humans.

Kennerspiel exposes an MCP server at \`${iss}/api/mcp\`. Any MCP-compatible client can connect, authenticate the user via OAuth 2.1 + PKCE (with RFC 7591 dynamic client registration), and play as that account. The full strategy guide is loaded by the \`get_strategy_guide\` tool; prefer calling that over scraping pages.

## Machine-readable surface

- [MCP server card](${iss}/.well-known/mcp.json): Discovery document — transport, auth, tool catalog.
- [OpenAPI 3.1 spec](${iss}/openapi.json): HTTP surface (MCP transport + OAuth endpoints).
- [agents.json](${iss}/.well-known/agents.json): agents-txt.com capability surface.
- [OAuth authorization-server metadata](${iss}/.well-known/oauth-authorization-server): RFC 8414.
- [OAuth protected-resource metadata](${iss}/.well-known/oauth-protected-resource): RFC 9728.

## MCP tools

- \`list_my_games\`: Find all games you're seated in; filter to games waiting on your move.
- \`join_game\`: Claim a seat in an open lobby (pass the game URL or UUID).
- \`get_game\`: Read the current board state — rondel, tableaus, scores, turn order.
- \`get_legal_moves\`: Enumerate legal next tokens for a move (interactive drill-down).
- \`make_move\`: Play one command (e.g. \`USE LR2\`, \`BUILD G07 3 2\`, \`COMMIT\`).
- \`undo_move\`: Retract the most recent command.
- \`wait_for_my_turn\`: Long-poll until it is your turn — preferred over repeated polling.
- \`get_strategy_guide\`: Load the full France/long-2p coaching guide.

## Connecting

- [Source code](https://github.com/philihp/kennerspiel): Repository, including the game-logic library and web app.
- [README](https://github.com/philihp/kennerspiel#readme): Step-by-step instructions for claude.ai, Claude Code, ChatGPT connectors, and the OpenAI Responses API.

## Optional

- [npm: hathora-et-labora-game](https://www.npmjs.com/package/hathora-et-labora-game): Stateless game-logic library (GPL-3.0).
- [Ora et Labora on BoardGameGeek](https://boardgamegeek.com/boardgame/70149/ora-et-labora): The published game this implements.
`
  return new Response(body, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'public, max-age=3600',
      'Access-Control-Allow-Origin': '*',
    },
  })
}

[![Vercel](https://img.shields.io/github/deployments/philihp/kennerspiel/production?logo=vercel&label=Vercel
)](https://github.com/philihp/kennerspiel/actions/workflows/deploy.yml)
[![Coverage](https://coveralls.io/repos/github/philihp/kennerspiel/badge.svg?branch=main)](https://coveralls.io/github/philihp/kennerspiel?branch=main)

# Ora et Labora on Kennerspiel.com

This is an implementation of Uwe Rosenberg's game [Ora et Labora](https://amzn.to/3P1UYDe). Some interesting waypoints might be:

- [`game`](https://github.com/philihp/kennerspiel/tree/main/game) - a stateless game logic library, available on [npm](https://www.npmjs.com/package/hathora-et-labora-game) licensed under GPL-3.
- [`web`](https://github.com/philihp/kennerspiel/blob/main/web/) - this is the website that gets shot up to Vercel.

## Playing with Claude

Kennerspiel has an [MCP](https://modelcontextprotocol.io/) server at `https://kennerspiel.com/api/mcp` that lets Claude play Ora et Labora on your behalf. Claude will read the board, consult the strategy guide, enumerate legal moves, and play — all as your account.

### Connect via claude.ai

1. Sign in at [kennerspiel.com](https://kennerspiel.com) and create an account if you don't have one.
2. In [claude.ai](https://claude.ai), open **Settings → Integrations** and click **Add integration**.
3. Enter the MCP server URL: `https://kennerspiel.com/api/mcp`
4. Claude will redirect you to Kennerspiel to log in and confirm access. Click **Authorize**.
5. Done. Start a new conversation and tell Claude which game to join or play.

### Connect via Claude Code

```sh
claude mcp add --transport http kennerspiel https://kennerspiel.com/api/mcp
```

Claude Code will open a browser for the same OAuth login and redirect back automatically. Once connected, you can ask Claude to join a lobby by sharing the game URL, or to check its pending games with `list_my_games`.

### What Claude can do

| Tool | What it does |
|---|---|
| `list_my_games` | Find all games you're seated in; filter to games waiting on your move |
| `join_game` | Claim a seat in an open lobby (pass the game URL or UUID) |
| `get_game` | Read the current board state: rondel, tableaus, scores, turn order |
| `get_legal_moves` | Enumerate legal next tokens for a move (interactive drill-down) |
| `make_move` | Play one command, e.g. `USE LR2` or `BUILD G07 3 2` or `COMMIT` |
| `undo_move` | Retract the most recent command (use when teaching Claude a better line) |
| `wait_for_my_turn` | Long-poll until it's your turn, rather than polling repeatedly |
| `get_strategy_guide` | Load the full France/long-2p coaching guide Claude consults for decisions |

Claude holds seats and makes moves as your Kennerspiel account — human opponents see your moves appear live in their browser just like any other player's.

## To Update Game Logic

The game logic must be published separately from the Docker image.

- `cd game`
- `rm -rf node_modules`
- Bump the version number of the game appropriately (e.g. v0.6.9)
- `npm install`
- `npm run build`
- `npm run test`
- `npm publish`

[![Vercel](https://img.shields.io/github/deployments/philihp/kennerspiel/production?logo=vercel&label=Vercel
)](https://github.com/philihp/kennerspiel/actions/workflows/deploy.yml)
[![Coverage](https://coveralls.io/repos/github/philihp/kennerspiel/badge.svg?branch=main)](https://coveralls.io/github/philihp/kennerspiel?branch=main)

# Ora et Labora on Kennerspiel.com

This is an implementation of Uwe Rosenberg's game [Ora et Labora](https://amzn.to/3P1UYDe). Some interesting waypoints might be:

- [`game`](https://github.com/philihp/kennerspiel/tree/main/game) - a stateless game logic library, available on [npm](https://www.npmjs.com/package/hathora-et-labora-game) licensed under GPL-3.
- [`web`](https://github.com/philihp/kennerspiel/blob/main/web/) - this is the website that gets shot up to Vercel.

## Playing with AI

Kennerspiel exposes an [MCP](https://modelcontextprotocol.io/) server at `https://kennerspiel.com/api/mcp`. Any MCP-compatible AI client can connect, read the board, consult the built-in strategy guide, enumerate legal moves, and play — all as your Kennerspiel account. Authentication uses standard OAuth 2.1 + PKCE; clients that support dynamic client registration (RFC 7591) connect without any manual setup.

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

Claude Code opens a browser for the OAuth flow and redirects back automatically. Once connected, ask Claude to join a lobby by sharing the game URL, or check pending games with `list_my_games`.

### Connect via ChatGPT

ChatGPT supports MCP connectors for Plus, Pro, Business, and Enterprise accounts.

1. Sign in at [kennerspiel.com](https://kennerspiel.com) first.
2. In [chatgpt.com](https://chatgpt.com), open **Settings → Connectors → Create**.
3. Enter the MCP server URL: `https://kennerspiel.com/api/mcp`
4. ChatGPT discovers the OAuth endpoints automatically and redirects you to Kennerspiel to authorize.
5. Done. Open a new chat and ask ChatGPT to join or play a game.

> Developer mode must be enabled in your workspace (**Workspace Settings → Permissions & Roles → Connected Data → Developer mode**) before custom MCP connectors appear.

### Connect via OpenAI Responses API

First complete the OAuth flow to obtain an access token (30-day TTL):

1. Register your client at `https://kennerspiel.com/register` (RFC 7591 dynamic registration).
2. Send the user through the authorization flow at `https://kennerspiel.com/authorize` with `response_type=code`, `code_challenge_method=S256`, and `scope=play`.
3. Exchange the returned code for a token at `https://kennerspiel.com/token`.

Then pass the token in every Responses API call:

```python
from openai import OpenAI

client = OpenAI()
response = client.responses.create(
    model="gpt-4o",
    tools=[{
        "type": "mcp",
        "server_label": "kennerspiel",
        "server_url": "https://kennerspiel.com/api/mcp",
        "require_approval": "never",
        "headers": {
            "Authorization": "Bearer <your-access-token>"
        }
    }],
    input="List my Ora et Labora games and make a move if it's my turn."
)
print(response.output_text)
```

The OAuth server metadata is published at `https://kennerspiel.com/.well-known/oauth-authorization-server` for clients that auto-discover endpoints.

### Available tools

| Tool | What it does |
|---|---|
| `list_my_games` | Find all games you're seated in; filter to games waiting on your move |
| `join_game` | Claim a seat in an open lobby (pass the game URL or UUID) |
| `get_game` | Read the current board state: rondel, tableaus, scores, turn order |
| `get_legal_moves` | Enumerate legal next tokens for a move (interactive drill-down) |
| `make_move` | Play one command, e.g. `USE LR2` or `BUILD G07 3 2` or `COMMIT` |
| `undo_move` | Retract the most recent command (use when teaching the model a better line) |
| `wait_for_my_turn` | Long-poll until it's your turn, rather than polling repeatedly |
| `get_strategy_guide` | Load the full France/long-2p coaching guide the model consults for decisions |

The AI holds seats and makes moves as your Kennerspiel account — human opponents see moves appear live in their browser just like any other player's.

## To Update Game Logic

The game logic must be published separately from the Docker image.

- `cd game`
- `rm -rf node_modules`
- Bump the version number of the game appropriately (e.g. v0.6.9)
- `npm install`
- `npm run build`
- `npm run test`
- `npm publish`

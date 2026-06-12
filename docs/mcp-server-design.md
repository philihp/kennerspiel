# Kennerspiel MCP Server — Design

An MCP (Model Context Protocol) server that lets an AI agent (e.g. Claude via
claude.ai connectors or Claude Code) play Ora et Labora against humans by
reading game instances from Postgres and appending its own moves. It lives as
an API route inside the existing `web/` Next.js app — same Vercel project, same
deploy — but talks to the database directly rather than going through the
website's UI or server actions.

## 1. What already exists (and what we reuse)

The whole design falls out of three facts about the current system:

1. **Games are just command lists.** An `instance` row holds the entire game as
   an ordered `commands text[]` column (e.g. `CONFIG 3 long france`,
   `START 38271 R G B`, `USE LR2`, `COMMIT`). State is never stored — it is
   derived by replaying commands through the engine
   (`web/src/context/InstanceContext.ts:106-112`).

2. **The engine is a pure package the web app already depends on.**
   [`hathora-et-labora-game`](https://www.npmjs.com/package/hathora-et-labora-game)
   (lives in `game/`, already in `web/package.json`) exports everything the MCP
   server needs:
   - `initialState` + `reducer(state, [command, ...params])` — replay & validate
     (returns `undefined` for an illegal move, `game/src/reducer.ts`)
   - `control(state, partial)` — legal-move completions for a partial command,
     plus live scores and turn flow (`game/src/control.ts:66`)
   - `START` takes an explicit seed, so replay is deterministic everywhere.

3. **Seat ownership is relational.** `entrant(instance_id, profile_id, color)`
   maps a Supabase auth user to a seat color. "Whose turn is it" =
   `state.players[state.frame.activePlayerIndex].color`, matched to an entrant
   color (exactly what the web does in `web/src/context/InstanceContext.ts:148-150`).

So the MCP server is thin: **Postgres + engine + a handful of tools**. No game
logic is reimplemented, and because the tools import the exact same
`hathora-et-labora-game` dependency the UI renders with, the agent and the
website can never disagree about a replay.

Note: Ora et Labora is a perfect-information game, so reading full state with a
privileged DB key gives the agent no unfair knowledge.

## 2. Architecture

```
Claude (claude.ai connector / Claude Code)
        │  Streamable HTTP  (Authorization: Bearer <token>)
        ▼  https://ora.kennerspiel.com/api/mcp
┌──────────────────────────────────────────────────┐
│  web/  — existing Next.js app (Vercel project    │
│         "kennerspiel", root directory web/)      │
│                                                  │
│  src/app/api/[transport]/route.ts                │
│    createMcpHandler + withMcpAuth (mcp-handler)  │
│                                                  │
│  tools: list_my_games · get_game                 │
│         get_legal_moves · make_move              │
│         (phase 2: create/join/start lobby)       │
│                                                  │
│  hathora-et-labora-game  (already a dependency)  │
│  @supabase/supabase-js   (service-role client)   │
└──────────────────┬───────────────────────────────┘
                   │ PostgREST (HTTPS)
                   ▼
        Supabase Postgres
        instance · entrant · profile
        + new RPC: append_command (atomic CAS append)
```

### Where it lives

An **API route inside `web/`** — `web/src/app/api/[transport]/route.ts` — in
the existing `kennerspiel` Vercel project. The app currently has no `api/`
directory, so nothing collides.

- One deploy, one set of env vars, one domain: the MCP endpoint is
  `https://ora.kennerspiel.com/api/mcp`.
- The engine version-skew problem disappears structurally: the MCP tools and
  the UI resolve the *same* `hathora-et-labora-game` entry in
  `web/package.json`, so they can't drift apart.
- Tradeoffs accepted: the website project now holds the service-role key (it's
  a server-only env var, never bundled client-side, and only the MCP modules
  import it), and agent availability is coupled to website deploys (fine — a
  broken deploy breaks the game UI anyway).
- The handler code is framework-portable: if isolation ever becomes desirable
  (separate secrets, separate scaling), the route and `src/mcp/` modules can be
  lifted into their own Vercel project without rewriting anything.

### Transport & framework

[`mcp-handler`](https://www.npmjs.com/package/mcp-handler) (Vercel's MCP
adapter) in a Next.js App Router catch-all route:

```ts
// web/src/app/api/[transport]/route.ts
import { createMcpHandler, withMcpAuth } from 'mcp-handler'

const handler = createMcpHandler(
  (server) => {
    server.tool('list_my_games', ...)
    server.tool('get_game', ...)
    server.tool('get_legal_moves', ...)
    server.tool('make_move', ...)
  },
  {},
  { basePath: '/api' }
)

const authHandler = withMcpAuth(handler, verifyToken, { required: true })

export { authHandler as GET, authHandler as POST, authHandler as DELETE }
export const maxDuration = 60
```

- **Streamable HTTP, stateless mode** at `/api/mcp`. Every tool call is a
  single request/response — no session affinity, no Redis (Redis is only
  needed for the legacy SSE transport's resumability, which we skip).
- Tool calls are fast (a full game is a few hundred commands; replay is
  milliseconds), so default function limits are fine; `maxDuration: 60` is
  headroom.
- **Middleware**: `web/src/middleware.ts` currently matches every path and runs
  the Supabase session refresh. `updateSession` never redirects — it only
  refreshes cookies — so the MCP route works under it, but each MCP request
  would pay a pointless Supabase `getSession` round trip (MCP clients carry no
  auth cookies). Add `api/mcp` to the matcher's exclusion list.

### Database access

`@supabase/supabase-js` with the **service-role key**, added as a server-only
env var on the existing Vercel project:

```ts
// web/src/utils/supabase/service.ts — sibling of client.ts / server.ts
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/supabase.types'

export const createServiceClient = () =>
  createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
```

- A separate factory is required: the existing `utils/supabase/server.ts`
  client is cookie/SSR-based and authenticates as the browsing user; MCP
  requests have no Supabase session.
- PostgREST-over-HTTPS means no connection pooling concerns in serverless —
  the usual reason raw `pg` on Vercel gets painful.
- Reuses the generated `supabase.types.ts` row types.
- Service role bypasses RLS, so the server **self-enforces** authorization in
  tool code (§5). If we later want defense in depth, the agent can become a
  real authed Supabase user and the server can use anon-key + signed-in
  session instead; the tool logic doesn't change.

A direct pooled connection (Supavisor, port 6543, `postgres` npm package)
remains an option if we ever need `LISTEN/NOTIFY`, but nothing in v1 does.

### Agent identity

The agent is a first-class player, not a special case:

1. Create one dedicated Supabase auth user for the agent (one-time, via
   dashboard or admin API) → its `profile` row is the agent's identity.
2. Configure the server with `AGENT_PROFILE_ID=<that uuid>`.
3. The agent occupies seats the same way humans do: an `entrant` row with a
   color. Humans can invite it from the website lobby today (no MCP lobby
   tools required for v1), or phase-2 tools let the agent join itself.

This means the website renders the agent like any other opponent, the unique
`(instance_id, profile_id)` constraint applies, and nothing about the schema
changes.

## 3. Tool surface (v1)

Four tools, mirroring how the web client plays. All inputs validated with zod
(a new dependency alongside `mcp-handler`).

### `list_my_games`

*"Which games am I in, and where is it my move?"* — also the agent's polling
primitive (MCP is pull-based; the human says "your move" or the agent checks).

- Input: `{ only_my_turn?: boolean }`
- Query: instances joined through `entrant` where `profile_id = AGENT_PROFILE_ID`,
  newest `updated_at` first.
- For each instance, replay commands once to derive: status
  (`SETUP`/`PLAYING`/`FINISHED`), active color, and `my_turn` (active color ===
  my entrant color).
- Output per game: `instance_id`, `my_color`, `status`, `active_color`,
  `my_turn`, `move_count`, `updated_at`.

### `get_game`

*"Show me the board."*

- Input: `{ instance_id: string, detail?: 'summary' | 'full' }`
- Replays commands → `GameStatePlaying`, calls `control(state, [])` for scores
  and turn flow.
- `summary` (default) returns a **curated rendering** designed for token
  economy and model readability rather than raw engine JSON: round/frame info,
  rondel arm + token positions, per-player tableau (color, clergy at home/out,
  resources, landscape grid with buildings rendered as their IDs, settlements),
  current scores, upcoming turn order (`flow`), the last ~10 commands, and
  whose turn it is. The raw `GameStatePlaying` includes large landscape
  matrices and internal frame bookkeeping that bloat context; `full` exposes it
  anyway for debugging.

### `get_legal_moves`

*"What can I do?"* — a direct pass-through to the engine's completion system.

- Input: `{ instance_id: string, partial?: string[] }`
- Returns `control(state, partial).completion` — the legal next tokens for the
  partial command — plus whether the current partial already forms a complete,
  reducer-accepted command.
- The completion tree is interactive by design (same as the web UI's
  `addPartial` flow): the agent calls with `[]` to see verbs
  (`USE`, `BUILD`, `COMMIT`, …), then `['BUILD']` to see buildings, then
  `['BUILD','LR1']` for coordinates, etc. This keeps each response small
  instead of enumerating the full cross-product of legal moves, and gives the
  model the same guided experience a human gets from the UI.

### `make_move`

*"Play this."* The only writing tool, with a strict pipeline:

1. **Seat check** — agent has an `entrant` row for this instance.
2. **Status check** — replayed state is `PLAYING` (reject during `SETUP`; the
   first two commands, `CONFIG` and `START`, are lobby-managed).
3. **Turn check** — active player color === agent's entrant color. (The web's
   `serverMove` has a `TODO` here, `web/src/context/actions.ts:27`; the MCP
   server enforces it from day one.)
4. **Legality check** — `reducer(state, command.split(' '))` must not be
   `undefined`.
5. **Atomic append** — via a new Postgres function (next section), *not* a
   whole-array overwrite.
6. Return the post-move `summary` state and whose turn is next, so the agent
   can narrate its move without a follow-up call.

- Input: `{ instance_id: string, command: string }` (a complete command string,
  e.g. `"BUILD G07 3 2"` or `"COMMIT"`).

### Phase 2 (optional lobby tools)

`create_game`, `join_game(instance_id, color)`, `start_game(instance_id)` —
straightforward ports of `web/src/app/instance/[slug]/actions.ts` (`join`
rewrites `CONFIG` with the new player count; `start` writes
`START <seed> <colors>`). Deferred because the human can do all of this from
the website and just invite the agent's account. Living in the same codebase
as those server actions makes eventual consolidation easy.

## 4. Concurrency: atomic append RPC

Today's `serverMove` overwrites the entire `commands` array with whatever the
client last saw — two concurrent movers can silently clobber each other. The
MCP server must not add a second writer with the same bug, so we add one
migration:

```sql
-- supabase/migrations/<ts>_append_command_rpc.sql
create or replace function append_command(
  p_instance_id uuid,
  p_expected_count int,
  p_command text
) returns setof instance
language sql
as $$
  update instance
  set commands = commands || p_command,
      updated_at = now()
  where id = p_instance_id
    and cardinality(commands) = p_expected_count
  returning *;
$$;
```

Compare-and-swap on the command count: the server validates against N commands
and appends "only if still N". Zero rows back ⇒ someone moved first ⇒ re-read,
re-validate, surface to the agent. This also makes retries idempotent (a
duplicate `make_move` after a network blip fails the CAS instead of
double-appending). `serverMove` can adopt the same RPC later and close its
race too — it's now one file away — but nothing in v1 requires touching it.

The existing realtime broadcast trigger fires on `UPDATE instance`
(`supabase/migrations/20250222000341_realtime_instance_broadcasts.sql`), so
**human players see the agent's moves live in the browser with no extra work**.

## 5. Security

| Layer | Mechanism |
|---|---|
| Transport auth | `withMcpAuth(handler, verifyToken, { required: true })` checking a static bearer token (`MCP_AUTH_TOKEN`) on every request. Sufficient for personal use; the same wrapper accepts a real OAuth verifier later. |
| DB credentials | `SUPABASE_SERVICE_ROLE_KEY` as a server-only env var on the `kennerspiel` Vercel project. No `NEXT_PUBLIC_` prefix ⇒ never bundled client-side; only `utils/supabase/service.ts` reads it, and only MCP tool modules import that. |
| Authorization | Self-enforced in `make_move` (seat + turn + legality checks above). The agent can only ever append one validated command to games it is seated in — even a confused model can't corrupt state, skip turns, or touch other games. |
| Blast radius | The only write path is `append_command`; no tool deletes or rewrites history. |

## 6. Code layout & config

Everything lands in the existing web app; one new migration beside the others.

```
web/src/app/api/[transport]/route.ts   # createMcpHandler + withMcpAuth + tool registration
web/src/mcp/engine.ts                  # replay(commands) → state; activeColor(state); etc.
web/src/mcp/render.ts                  # GameStatePlaying → token-frugal summary
web/src/mcp/tools/                     # one file per tool
web/src/utils/supabase/service.ts      # service-role client (sibling of client.ts/server.ts)
web/src/middleware.ts                  # matcher gains an api/mcp exclusion
supabase/migrations/<ts>_append_command_rpc.sql
```

New dependencies in `web/package.json`: `mcp-handler`, `zod`.
Already present: `@supabase/supabase-js`, `hathora-et-labora-game`.

New env vars on the existing `kennerspiel` Vercel project:

| Var | Purpose |
|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | DB access for the MCP tools |
| `AGENT_PROFILE_ID` | The agent's `profile.id` |
| `MCP_AUTH_TOKEN` | Bearer token for inbound MCP requests |

(`NEXT_PUBLIC_SUPABASE_URL` is already configured and is reused.)

Client setup, e.g. Claude Code:

```sh
claude mcp add --transport http kennerspiel https://ora.kennerspiel.com/api/mcp \
  --header "Authorization: Bearer $MCP_AUTH_TOKEN"
```

or claude.ai → Settings → Connectors → custom connector with the same URL.
Preview deployments get the route too, so the agent can be pointed at a branch
deployment URL for testing before anything merges.

## 7. A turn, end to end

1. Human moves on the website; says "your move" to Claude (or Claude polls
   `list_my_games {only_my_turn: true}`).
2. Claude: `get_game` → reads the board summary.
3. Claude: `get_legal_moves []` → sees it can `USE`, `BUILD`, `COMMIT`…;
   drills into `['USE']` → placements; picks one.
4. Claude: `make_move "USE LR2"` → server validates seat/turn/legality, CAS
   append → returns new state.
5. The realtime trigger pushes the update; the human's browser re-renders
   immediately. Claude narrates its move in chat.
6. Repeat — note many Ora et Labora turns are multi-command (actions then
   `COMMIT` ends the turn); the turn check naturally allows consecutive agent
   commands until `COMMIT` advances `activePlayerIndex`.

## 8. Risks & open questions

- **Summary rendering quality** is the main play-strength lever — if the
  rendering omits something (e.g. which buildings are occupied), the agent
  plays blind to it. Start with everything the web UI displays; iterate.
- **Completion-tree depth**: a few commands (e.g. `CONVERT`) have wide
  completion sets. If responses get bulky, cap list lengths with a count +
  "refine with a longer partial" hint.
- **Service-role key in the website project**: acceptable for a personal
  project (it's server-only and narrowly imported), but it does widen what a
  hypothetical server-side bug in the web app could reach. If that ever feels
  uncomfortable, the route lifts cleanly into its own Vercel project with its
  own secrets (§2).
- **Push vs pull**: v1 is pull-only. If "agent moves promptly without being
  prompted" matters later, a small cron (Vercel cron → check
  `list_my_games` → ping a session) can be layered on without changing tools.
- **Hidden `instance.hidden` flag**: tools operate only on games the agent is
  seated in, so the privacy flag is irrelevant to v1 reads; revisit if a
  `browse_open_games` tool is ever added.

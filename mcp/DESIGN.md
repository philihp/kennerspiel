# Kennerspiel MCP Server — Design

An MCP (Model Context Protocol) server that lets an AI agent (e.g. Claude via
claude.ai connectors or Claude Code) play Ora et Labora against humans by
reading game instances from Postgres and appending its own moves — with its own
database access, deployable on Vercel, independent of the website.

## 1. What already exists (and what we reuse)

The whole design falls out of three facts about the current system:

1. **Games are just command lists.** An `instance` row holds the entire game as
   an ordered `commands text[]` column (e.g. `CONFIG 3 long france`,
   `START 38271 R G B`, `USE LR2`, `COMMIT`). State is never stored — it is
   derived by replaying commands through the engine
   (`web/src/context/InstanceContext.ts:106-112`).

2. **The engine is a published, pure package.**
   [`hathora-et-labora-game`](https://www.npmjs.com/package/hathora-et-labora-game)
   (lives in `game/`, pinned at the same version the web app uses) exports
   everything the MCP server needs:
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
logic is reimplemented and no website API is called.

Note: Ora et Labora is a perfect-information game, so reading full state with a
privileged DB key gives the agent no unfair knowledge.

## 2. Architecture

```
Claude (claude.ai connector / Claude Code)
        │  Streamable HTTP  (Authorization: Bearer <token>)
        ▼
┌──────────────────────────────────────────────┐
│  mcp/  — Next.js app, its own Vercel project │
│  app/[transport]/route.ts (mcp-handler)      │
│                                              │
│  tools: list_my_games · get_game             │
│         get_legal_moves · make_move          │
│         (phase 2: create/join/start lobby)   │
│                                              │
│  hathora-et-labora-game  (replay/validate)   │
│  @supabase/supabase-js   (service-role key)  │
└──────────────────┬───────────────────────────┘
                   │ PostgREST (HTTPS)
                   ▼
        Supabase Postgres
        instance · entrant · profile
        + new RPC: append_command (atomic CAS append)
```

### Where it lives

A new **`mcp/` workspace** in the monorepo (alongside `game/`, `web/`,
`server/`), deployed as its **own Vercel project** with root directory `mcp/`.

- Keeps the website untouched and independently deployable.
- Shares the repo so it can pin the same `hathora-et-labora-game` version the
  web uses (a version skew between site and agent would make replays disagree —
  see §8).
- Alternative considered: a route inside `web/` (`app/api/[transport]/route.ts`).
  Less infra, but couples agent uptime/secrets to website deploys. Easy to
  switch to later since the handler code is identical.

### Transport & framework

[`mcp-handler`](https://www.npmjs.com/package/mcp-handler) (Vercel's MCP
adapter) in a Next.js App Router catch-all route:

```ts
// mcp/app/[transport]/route.ts
const handler = createMcpHandler((server) => {
  server.tool('list_my_games', ...)
  server.tool('get_game', ...)
  server.tool('get_legal_moves', ...)
  server.tool('make_move', ...)
})
export { handler as GET, handler as POST }
```

- **Streamable HTTP, stateless mode** at `/mcp`. Every tool call is a single
  request/response — no session affinity, no Redis (Redis is only needed for
  the legacy SSE transport's resumability, which we skip).
- Tool calls are fast (a full game is a few hundred commands; replay is
  milliseconds), so default function limits are fine; set `maxDuration: 60` as
  headroom.

### Database access

`@supabase/supabase-js` with the **service-role key** (server-side env var,
never shipped to a client):

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

Four tools, mirroring how the web client plays. All inputs validated with zod.

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
the website and just invite the agent's account.

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
double-appending). The website can adopt the same RPC later and close its race
too, but nothing here requires changing `web/`.

The existing realtime broadcast trigger fires on `UPDATE instance`
(`supabase/migrations/20250222000341_realtime_instance_broadcasts.sql`), so
**human players see the agent's moves live in the browser with no extra work**.

## 5. Security

| Layer | Mechanism |
|---|---|
| Transport auth | Static bearer token checked on every request (`MCP_AUTH_TOKEN`), via `mcp-handler`'s auth wrapper or a header check in the route. Sufficient for personal use; the handler structure leaves room for real OAuth later. |
| DB credentials | `SUPABASE_SERVICE_ROLE_KEY` as a Vercel env var on the `mcp` project only. |
| Authorization | Self-enforced in `make_move` (seat + turn + legality checks above). The agent can only ever append one validated command to games it is seated in — even a confused model can't corrupt state, skip turns, or touch other games. |
| Blast radius | The only write path is `append_command`; no tool deletes or rewrites history. |

## 6. Repo layout & config

```
mcp/
  package.json          # next, mcp-handler, zod, @supabase/supabase-js,
                        # hathora-et-labora-game (pinned to web/'s version)
  next.config.ts
  app/[transport]/route.ts   # createMcpHandler + tool registration
  src/db.ts             # service-role supabase client
  src/engine.ts         # replay(commands) → state; activeColor(state); etc.
  src/render.ts         # GameStatePlaying → token-frugal summary
  src/tools/            # one file per tool
supabase/migrations/<ts>_append_command_rpc.sql
```

Env vars (Vercel project `kennerspiel-mcp`):

| Var | Purpose |
|---|---|
| `SUPABASE_URL` | Same project the website uses |
| `SUPABASE_SERVICE_ROLE_KEY` | DB access |
| `AGENT_PROFILE_ID` | The agent's `profile.id` |
| `MCP_AUTH_TOKEN` | Bearer token for inbound MCP requests |

Client setup, e.g. Claude Code:

```sh
claude mcp add --transport http kennerspiel https://<mcp-deployment>/mcp \
  --header "Authorization: Bearer $MCP_AUTH_TOKEN"
```

or claude.ai → Settings → Connectors → custom connector with the same URL.

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

- **Engine version skew.** If `web/` and `mcp/` pin different
  `hathora-et-labora-game` versions and the reducer changes, replays could
  diverge. Mitigation: pin identical versions; a renovate/dependabot rule or a
  CI check comparing the two `package.json`s would lock this in.
- **Summary rendering quality** is the main play-strength lever — if the
  rendering omits something (e.g. which buildings are occupied), the agent
  plays blind to it. Start with everything the web UI displays; iterate.
- **Completion-tree depth**: a few commands (e.g. `CONVERT`) have wide
  completion sets. If responses get bulky, cap list lengths with a count +
  "refine with a longer partial" hint.
- **Push vs pull**: v1 is pull-only. If "agent moves promptly without being
  prompted" matters later, a small cron (Vercel cron → check
  `list_my_games` → ping a session) can be layered on without changing tools.
- **Hidden `instance.hidden` flag**: tools operate only on games the agent is
  seated in, so the privacy flag is irrelevant to v1 reads; revisit if a
  `browse_open_games` tool is ever added.

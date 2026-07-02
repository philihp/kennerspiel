# 27 — Real-time deployment (bot daemon)

| | |
| --- | --- |
| Status | planned |
| Package | `bot/` (new top-level workspace package) |
| Depends on | [21](21-onnx-evaluator.md), [22](22-arena-gating.md), web/MCP server ([design](../mcp-server-design.md), shipped) |
| Milestone | M8 |

## Goal

The end goal of the whole trainer: humans on kennerspiel.com play against the
promoted net in real time. A small always-on daemon holds seats like any other
player, notices when it is its turn, runs a **wall-clock-budgeted** PUCT search
with the current champion, and appends its move through the same CAS write
path the web and MCP server use.

## Design

### Where inference runs: a daemon, not serverless

A new top-level `bot/` package — not `agent/`, not `web/`. `agent/` stays
deployment-blind (no Supabase dependency, no daemon loop); `web/` stays
inference-free (`onnxruntime-node` must never enter the Vercel bundle, per
[21](21-onnx-evaluator.md)'s "`game/` and `web/` never see it"). `bot/`
bridges both: it imports the OeL adapter ([09](09-game-adapter.md)), `puct`
([13](13-puct-search.md)) and `createOnnxEvaluator`
([21](21-onnx-evaluator.md)) from `agent/`, plus `@supabase/supabase-js`.

It runs as one long-lived Node process on an always-on box (the Linux
training machine or the trashcan Mac Pro — both have `onnxruntime-node`
prebuilds). Alternatives rejected:

- **Inference in the Next.js API on Vercel** — `onnxruntime-node` is a large
  native addon squeezed against serverless bundle limits; cold starts re-create
  the `InferenceSession` per invocation; execution caps (the MCP route already
  runs `maxDuration = 60`; cheaper tiers cap far lower) sit uncomfortably close
  to multi-second searches; no persistent process for hot-reload, per-game
  queues, or a warm session.
- **Supabase edge function** — Deno runtime: no `onnxruntime-node` at all,
  only WASM ORT at a large slowdown, plus tight CPU-time limits that a
  3–5 s search blows through. Fine for webhooks, wrong for search.

### Game I/O: direct Postgres, same CAS append

The bot is a first-class player exactly as the MCP design specifies: its own
Supabase auth user (`BOT_PROFILE_ID`), seated via ordinary `entrant` rows —
humans invite it from the web lobby. I/O per turn:

- **Read**: `select commands from instance` for seated games (join through
  `entrant`), then adapter replay — the bot must replay locally to search
  anyway, so the raw command list is the natural wire format (the MCP
  `get_game` summary is prose-shaped for LLMs, useless to PUCT).
- **Write**: the existing `append_command(p_instance_id, p_expected_count,
  p_command)` CAS RPC
  (`supabase/migrations/20260612070000_create_append_command_function.sql`).
  CAS on command count makes retries idempotent: a duplicate attempt after a
  crash or blip returns zero rows instead of double-appending; the bot
  re-reads, re-replays, re-decides. Before writing, the bot re-runs the same
  seat/turn/legality pipeline `make_move` enforces
  (`web/src/mcp/tools/makeMove.ts`) — cheap, the replayed state is in hand.
- v1 uses the service-role key on the box, the same trust level the Vercel
  project already holds; the MCP-HTTP alternative is weighed in tradeoffs.

Multi-command turns (actions then `COMMIT`) fall out naturally: after each
successful append, replay again; if the bot's seat is still active, search
again. The existing broadcast trigger fires on every `instance` UPDATE, so
humans watch each command land live.

### Turn detection

Two layers, because realtime alone is not reliable enough to stake a human's
game on:

1. **Supabase Realtime subscription** per seated game on broadcast topic
   `instance:<id>` (the trigger in
   `supabase/migrations/20250222000341_realtime_instance_broadcasts.sql`
   already publishes every update). A broadcast is a *wake-up*, never trusted
   as state: on wake, fetch + replay + check the active color against the
   bot's entrant colors.
2. **Slow poll** (default 30 s) over the same seated-games query — catches
   dropped websockets, and discovers *new* games the bot was just invited to
   (there is no broadcast for `entrant` inserts).

A single scheduler serializes work per game (one in-flight decision per
`instance_id`) and caps global search concurrency at 1 in v1 — concurrent
games simply queue, keeping CPU and latency predictable. One seat per game;
a wake when it is not the bot's turn is a no-op.

### Time-bounded search

`puct()` gains a `budgetMs` option beside `sims` (small additive change in
`agent/src/mcts/puct.ts`): the sim loop stops when **either** `sims` is
reached **or** `elapsed ≥ budgetMs`, subject to a `minSims` floor so a GC
pause cannot reduce a move to noise. Arena/self-play pass no budget and are
bit-identical to before. Play settings mirror the gate ([22](22-arena-gating.md)):
**no Dirichlet noise, τ→0 argmax** — deployment strength, not exploration.
The single-candidate short-circuit from [13](13-puct-search.md) already makes
forced moves instant.

Degradation ladder — the bot must never stall a human's game:

1. `OnnxEvaluator` with the current champion (normal case).
2. Net missing or `spec.json` mismatch at load ([21](21-onnx-evaluator.md)'s
   assertion): log loudly, play **greedy 1-ply** over `adapter.heuristic`.
3. Evaluator failure mid-search: retry the move once, then fall back to the
   rollout policy (`mcts:` at low sims), then greedy.

Every fallback is tagged in the move log; a healthy deploy shows zero.

### Model management

`BOT_MODEL=best@runs/<id>` reuses [22](22-arena-gating.md)'s `best@`
resolution: read `best.json`, resolve `onnx` run-relative (an rsync'd copy of
the run dir works — paths are run-relative by design). The daemon polls
`best.json`'s mtime (~60 s); on change it constructs a fresh evaluator (spec
assertion included), swaps it **between** moves only, and keeps the old one
if the new load fails. `spec.netId` (e.g. `gen-007`) is logged with every
move — "which net played this" stays auditable, matching JSONL provenance in
[14](14-selfplay-v2.md).

### Human-experience knobs

Per-config difficulty levels map to search effort:

```
casual: { budgetMs: 1000, minSims:  50 }    tournament: { budgetMs: 5000, minSims: 400 }
plus optional openingTemperature (τ > 0 for the first N plies) for variety
```

`minDelayMs` (default ~1500) pads instant replies (forced moves, cache hits)
so the bot doesn't feel like a vending machine. Resign/mercy rules are out of
scope for v1 — Ora et Labora ends by structure, not by resignation.

### Ops

- **Supervision**: a systemd unit (`bot/deploy/kennerspiel-bot.service`,
  `Restart=always`); pm2 works identically if preferred.
- **Stateless by construction**: all game state is the Postgres command list;
  a crash-restart re-derives everything, and CAS means a move half-attempted
  before the crash either landed or didn't — no repair step.
- **Structured log**, one JSON line per move: `{ ts, instanceId, step,
  moveKey, netId, value, sims, elapsedMs, budgetMs, forced, fallback }`.
- **Health endpoint** on localhost (`/healthz`): last poll time, realtime
  connection state, seated-game count, current `netId`, queue depth.

## Implementation plan

1. `bot/package.json` + workspace entry in `pnpm-workspace.yaml` (deps:
   workspace `agent`, `@supabase/supabase-js`); `bot/src/config.ts`.
2. `agent/src/mcts/puct.ts`: add `budgetMs`/`minSims` options (tested: budget
   respected, floor holds, bit-identical when unset).
3. `bot/src/db.ts` — service client, `listSeatedGames()`, `fetchCommands()`,
   `appendCommand()` (CAS + zero-rows handling).
4. `bot/src/turns.ts` — realtime subscriptions + slow poll, per-game queue.
5. `bot/src/model.ts` — `best.json` watcher, evaluator swap, netId.
6. `bot/src/play.ts` — replay → seat/turn checks → budgeted `puct` → ladder →
   pacing → append; the move-log line lives here.
7. `bot/src/main.ts` (daemon wiring) + `bot/src/health.ts`.
8. `bot/src/__tests__/` — CAS-conflict retry, ladder selection, budget/pacing
   math, hot-reload swap (stub client + fixture games).
9. `bot/deploy/kennerspiel-bot.service`.

## Inputs

- `runs/<id>/best.json` + champion `model.onnx`/`spec.json` ([22](22-arena-gating.md)).
- Supabase: `instance`/`entrant` tables, `append_command` RPC, realtime
  broadcasts; env: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`,
  `BOT_PROFILE_ID`, `BOT_MODEL`.

## Outputs

- Moves appended to live games (rendered by the existing web UI in realtime);
  per-move JSONL log with netId provenance; `/healthz`.

## How it runs / verification

```sh
pnpm --dir bot start                                   # daemon (env-configured)
pnpm --dir bot start --dry-run --fixture game.jsonl    # decide, print, never write
pnpm --dir bot test
```

- **Dry-run** replays a fixture command list and prints the chosen move +
  stats — no network, safe anywhere.
- **Staging**: seat two bot profiles in one real game; the daemon plays
  itself to completion through the production write path.
- **Latency assertion**: over a staged game, p95 `elapsedMs ≤ budgetMs + 500`
  and every move ≥ `minDelayMs`, checked from the move log by a script.
- **Acceptance**: one full game vs a human via the web UI, with the move log
  showing budgeted searches, zero fallbacks, and the expected `netId`.

## Design notes & tradeoffs

- **Daemon vs Vercel vs edge function.** Chosen: daemon. Serverless buys
  autoscaling the bot doesn't need and charges for it in cold-started
  sessions, execution caps, and native-addon friction; the edge function
  can't run ORT natively at all. The daemon's one real cost — a box to keep
  alive — is already paid by the trainer ([25](25-rocm-runbook.md)).
- **Direct DB vs the MCP HTTP tools.** The MCP path would reuse `make_move`'s
  validation and need only the narrow bearer token instead of the service-role
  key — genuinely better auth hygiene. But its read surface is LLM-prose
  (summaries, completion trees), not the command lists the adapter needs, and
  `wait_for_my_turn` is itself a ≤55 s serverless poll — a daemon on Realtime
  is strictly better placed. Chosen: direct DB for v1, duplicating ~30 lines
  of seat/turn checks; improve auth later by making the bot a real authed
  user under RLS (the MCP design's own noted upgrade), not by routing search
  through HTTP.
- **Polling vs Realtime.** Either alone is wrong: pure polling at human-game
  cadence means dead air after every human move; pure Realtime silently
  wedges on dropped websockets. Broadcast-as-wake-up + slow-poll-as-truth
  costs ~20 lines and removes both failure modes.
- **Time budget vs fixed sims.** Fixed sims made arena results reproducible;
  a human opponent cares about wall clock. Budget + `minSims` floor bounds
  the worst case in both directions; logging sims-reached preserves the
  strength signal fixed-sims used to give.
- **Hot-reload vs restart-to-upgrade.** Restart is simpler and systemd makes
  it cheap — but it drops in-flight queue state and turns every promotion
  into an ops action. The watcher is ~30 lines, swaps only between moves,
  fails closed to the old net; kept. Restart stays the manual escape hatch.

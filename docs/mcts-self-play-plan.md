# MCTS Self-Play & Position-Evaluation Plan

> **Superseded** by [`docs/trainer/README.md`](trainer/README.md) — the
> full-AlphaZero (policy + value) trainer plan. Phases 1–3 below shipped and
> correspond to projects 01–06 there; this document is kept for its
> measurements and historical record.

Plan for building a Monte Carlo Tree Search (MCTS) agent that plays Ora et
Labora against itself, learns a position evaluator (value network) from that
self-play, and is ultimately served for real-time human-vs-computer play.

> Status: planning. No agent code has been written yet. This document is the
> agreed design; the file-by-file breakdown for Phases 1–3 is ready to build.

## Goal

1. A search agent (MCTS) that can play the game well by itself.
2. A learned **position evaluator** (value network) trained from MCTS
   self-play games.
3. Serve net + (shallow) search for **real-time human-vs-computer** play via
   the existing web/MCP seat-and-`make_move` path.

## Locked decisions

| Decision | Choice | Rationale |
|---|---|---|
| Training/inference stack | **Hybrid**: Node self-play + PyTorch training + ONNX inference | Reuse the TS engine + `encode` directly for self-play; PyTorch for training/GPU; ONNX for in-app inference. |
| Build order | **Pure MCTS + arena first**, then the value net | De-risks search, gives a strength measuring-stick, and produces the first self-play data before any ML. |
| First configuration | **2-player, long, France** | Matches the existing strategy guide and the human-vs-computer target. |
| Action-space blowup | **Curate** `SETTLE`/`USE`/`CONVERT` resource params | Median branching is 18; the fat tail (≤1,662) is all resource-combination explosion (see benchmarks). |
| State encoder perspective | **Keep egocentric** (`encode(state, perspective?)`, mover → slot 0) | Bakes player symmetry into the input → big sample-efficiency win. See below. |

## Existing assets we reuse (`game/`, npm `hathora-et-labora-game`)

- **Pure transition function** — `reducer(state, command[]) → state`
  (`game/src/reducer.ts`). A game is just an ordered list of command strings
  replayed from `initialState` (`web/src/mcp/engine.ts: replay`). Ideal compact,
  reproducible self-play storage.
- **Legal-move oracle** — `control(state, partial)` returns `completion`
  (legal *next tokens*), a live per-player `score` breakdown
  (`goods`/`economic`/`settlements`/`total`), and `flow` (turn order)
  (`game/src/control.ts`). Moves are built token-by-token; a `''` completion
  marks a complete command. So legal *full moves* = a DFS over the completion
  tree.
- **An AlphaZero-style state encoder, already built and tested** —
  `encode(state, perspective?) → Float32Array` of `FEATURE_LEN`
  (`game/src/encode.ts`). Perspective-rotated (your player → slot 0), lays each
  player's board as a `38×9×channels` spatial grid plus frame and shared
  scalars. The code already warns about keeping feature slots stable so saved
  weights stay aligned.
- **Deployment seam** — the web app + MCP server (`web/src/mcp/`) already let an
  agent hold a seat and `make_move`. Today's "AI" is an LLM reading
  `docs/ora-et-labora-strategy-SKILL.md`; a trained bot drops into the same seat.

### What does NOT exist yet

- Any MCTS / self-play / training code.
- A **full-move enumerator** (the MCP `getLegalMoves` only does one token at a
  time, capped at 200 completions).
- An **action encoding** (the encoder is state→tensor only; no policy-head
  action space).

## Key engine facts

- **Deterministic, perfect-information during play.** The only randomness is at
  `START` (seed → player-order shuffle + solo neutral color, see
  `game/src/commands/start.ts`). ⇒ **No chance nodes** in the search tree.
- **Players are mechanically identical.** In `start.ts` every player starts with
  all resources `0`, the same `makeLandscape(color)`, and the same
  `clergyForColor`. The only seat difference is turn order (color is cosmetic).
- **Turns are multi-command.** A player's turn is a sequence of commands ending
  in `COMMIT`; `WORK_CONTRACT` can hand input to another player who responds
  with `COMMIT`/`WITH_PRIOR`. The "player to move" at any state is
  `frame.activePlayerIndex` — use that, not a naive alternation.
- **Reward** is available any time via `control().score`; terminal is
  `GameStatusEnum.FINISHED`.

## Sanity-check benchmarks (measured)

Run against real replayed states from `game21872` (4p France long, through
round 9) plus a 2p France long mid-game state.

| Operation | Cost | Throughput | Verdict |
|---|---|---|---|
| `reducer` transition (COMMIT) | 0.011 ms | ~88,000/s | ✅ cheap — not a bottleneck |
| Full-game replay (mixed cmds) | — | ~28,000 cmds/s | ✅ ~100–170 games/s single-thread |
| `control(state, partial)` (legal-move oracle) | 0.33 ms/call | ~3,000/s | ⚠️ enumeration cost = branching × this |
| **`encode(state)` → tensor** | **13.3 ms** | **~75/s** | 🔴 **bottleneck for any NN-guided search** |

**Feature tensor:** `FEATURE_LEN = 167,457` floats = **654 KB/position**, shaped
as 4 players × **(38 × 9 × 122 channels)** grids + ~325 scalars.

**Branching factor** (legal complete commands per state):
**median 18, p90 126, p99 1,114, max 1,675.**

**Fat-tail sources** (max at any single state):
`SETTLE` → **1,662** · `USE` → **1,007** (both resource-combination explosions)
· `BUILD` → 90 · `WORK_CONTRACT` → 38 · `CONVERT` → 23 · everything else ≤ 20.

### Implications baked into the plan

1. **Transitions are ~0.01 ms ⇒ pure MCTS is cheap _if rollouts don't
   enumerate_.** Playouts sample a single move by walking the completion tree
   randomly (token by token), sidestepping the SETTLE/USE blowup entirely.
   Full enumeration is only needed at tree nodes we actually expand.
2. **`encode` at 13 ms is the #1 thing to fix before any NN work.** It is
   correctness-first (Ramda `flatMap` chains allocating ~167k-element arrays). A
   rewrite to a preallocated, imperative `Float32Array` should be **50–100×
   faster (<0.2 ms)**, gated by a bit-identical parity test against the current
   `encode`. Without it, an 800-sim move spends ~10 s just encoding.
3. **Curate the resource-combination tail** (`SETTLE`/`USE`/`CONVERT`). Median
   18 is fine; the ≤1,662 tail is not — and it also rules out a flat fixed
   policy head over 1,600+ actions, reinforcing the value-network-first path.
4. **Do not store dense tensors for self-play data** (654 KB × millions of
   positions, ~99% sparse). Store **command-lists + per-decision MCTS stats**
   (tiny, replayable) and regenerate tensors in the training data loader — which
   makes the fast encoder doubly important (hit during self-play *and* training).

## State-encoder perspective: keep it egocentric

**Decision: keep `encode` perspective-dependent (mover → slot 0). Do not make it
perspective-independent.**

- The seats are mechanically identical (verified in `start.ts`), and
  `rotateOrder` preserves *relative* turn order. Rotating to "my point of view"
  discards **zero** information — it is a reference-frame change, not a
  projection (the game is perfect-information, so opponents' boards are still
  fully encoded, just in rotated slots with a self/opponent flag).
- Egocentric framing bakes player symmetry into the input, so the net never
  spends capacity rediscovering that seats are interchangeable. Benefits:
  - **~N× sample efficiency** (N = player count): one absolute state yields N
    training samples by re-encoding from each perspective with the rotated
    target — free, exact augmentation.
  - A **single, simple value/policy head** that is always "about me," giving
    clean MCTS selection/backup.
  - A naturally **mover-relative action space** for a future policy head.
- **Cost worry is unfounded:** you only need the to-move player's value at each
  leaf ⇒ **one encode per leaf**, not per player. Perspective-dependence does
  **not** multiply encode cost. (Transposition-table hashing is over the
  *absolute* state — keep that concern separate.)

### Value-head shape (the real design choice)

- **2p (first config):** win-probability is zero-sum ⇒ a **single scalar**
  "P(mover wins)". Backup negates based on each node's `activePlayerIndex`
  vs. the leaf's — **not** a flip every level (multi-command turns + interrupts).
- **3–4p (later):** value head outputs a **vector over rotated slots** (slot 0 =
  mover, …). Still one encode per leaf, but yields all seats' values in one
  forward pass ⇒ clean multiplayer vector-backup, symmetry preserved.

## Phased plan

1. **Search harness** — engine adapter, full-move enumerator (with curation),
   rollout move sampler, fast encoder (parity-tested), benchmarks.
2. **Baselines + arena** — random / greedy-1-ply / heuristic policies; a
   round-robin arena with Elo. The measuring stick.
3. **Pure MCTS (UCT) self-play bot, no NN** — rollouts to terminal with
   score-cutoff; must beat the baselines; emits the first self-play data.
4. **Value network** — train (PyTorch) on `(encodeFast(state), outcome)` from
   Phase-3 self-play; small CNN over the `38×9×122` grids + MLP over scalars;
   egocentric value head; export ONNX. Tie weights to a `featureSpec` version.
5. **Value-guided MCTS ("AlphaZero-lite")** — replace rollouts with the NN value
   at leaves; PUCT priors from curated actions / 1-ply child-value softmax;
   iterate self-play → retrain → **gate** (new net must beat old in the arena).
6. **(Optional) Policy head** — a fixed, masked, mover-relative action encoding
   trained from MCTS visit counts; full AlphaZero loop. Only if Phase 5
   plateaus.
7. **Real-time deployment** — bundle ONNX inference into a bot-seat mover;
   time-bounded search for human play; greedy-value (1-ply) as the low-latency
   fallback; plug into the existing `make_move` path.

**Cross-cutting:** worker-pool parallel self-play (Node is single-threaded);
seed + command-list logging for reproducibility; feature-spec versioning;
strength tracking across generations.

## Phase 1–3 file-by-file breakdown

New `agent/` package (sibling to `game/` and `web/`), depending on
`hathora-et-labora-game`. Phases 1–3 are stack-agnostic (no PyTorch/ONNX yet).

### Phase 1 — Search harness

- **`agent/src/engine.ts`** — thin adapter: `applyCommand(state, move)`,
  `replay(cmds)`, `isTerminal(state)` (status `FINISHED`),
  `playerToMove(state)` (= `frame.activePlayerIndex`), `scores(state)`
  (= `control().score`), `reward(state)` (terminal → per-player outcome vector;
  win-prob for 2p).
- **`agent/src/moves.ts`** — two generators:
  - `enumerateMoves(state, {curate})` — DFS over `control().completion` to full
    commands, **with curation** of `SETTLE`/`USE`/`CONVERT` resource params
    (cheapest valid payment / small heuristic set) so branching stays near the
    median and never hits the ≤1,662 tail.
  - `sampleMove(state, rng)` — **random walk down the completion tree** to
    produce one legal move *without enumerating* — used by rollouts.
- **`agent/src/encodeFast.ts`** — imperative, preallocated-`Float32Array`
  rewrite of `encode` (no Ramda).
- **`agent/src/__tests__/encodeFast.parity.test.ts`** — asserts bit-identical to
  the lib's `encode` over many states. Gate before it's trusted.
- **`agent/src/__tests__/bench.test.ts`** — pins throughput to catch
  regressions (transition, control, enumerate, encodeFast).

### Phase 2 — Baselines + arena

- **`agent/src/policies/{random,greedy,heuristic}.ts`** — `random` (uniform over
  curated moves); `greedy` (1-ply, maximize my `control().score.total`);
  `heuristic` (seeded from `docs/ora-et-labora-strategy-SKILL.md`).
- **`agent/src/arena.ts`** — round-robin match runner → results + **Elo**;
  deterministic via seeds; logs each game as a command-list.
- **`agent/src/cli/play.ts`** — run `policyA vs policyB`, N games, report
  win-rate/Elo.

### Phase 3 — Pure MCTS (UCT) self-play bot

- **`agent/src/mcts/{node,search}.ts`** — UCT tree; nodes keyed by
  `playerToMove`; **per-player value-vector backup** crediting each node's mover
  (sets up the egocentric value head); leaf eval by `sampleMove` rollout to
  terminal with a **score-based early cutoff**.
- **`agent/src/policies/mcts.ts`** — wraps the search as an arena policy.
- **`agent/src/selfplay.ts`** — runs self-play games, writing **command-list +
  per-decision MCTS visit stats** to disk (tiny, replayable — *not* dense
  tensors). Becomes Phase 4 training data.
- **`agent/src/__tests__/mcts.test.ts`** — asserts MCTS beats `random` and
  `greedy` over a seeded match set. Green-light for the whole approach.

## Risks

- **Encoder speed** (13 ms) — contained, well-defined fix (fast encoder, parity
  test). Highest-leverage early task.
- **Action-space tail** (`SETTLE`/`USE` resource combos) — mitigated by
  curation; revisit if curation hurts play quality.
- **Multiplayer, not strictly zero-sum** — handled via per-player value vector
  (scalar + negation for 2p); pick reward shaping (win-prob vs score-margin)
  deliberately in Phase 4.
- **Latency at serve time** — time-bounded search + greedy-value fallback;
  long MCTS does not belong in a request handler.

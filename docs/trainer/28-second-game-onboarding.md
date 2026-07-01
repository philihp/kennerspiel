# 28 — Second-game onboarding

| | |
| --- | --- |
| Status | planned |
| Package | `agent/` + the new game's engine package |
| Depends on | [09](09-game-adapter.md)–[22](22-arena-gating.md) |
| Milestone | M9 (new) |

## Goal

Plug a second heavy-euro game (another Uwe-style engine — think Agricola,
Caverna, Glass Road) into the trainer by implementing exactly one adapter and
two encoders, reusing search/self-play/export/training/gating byte-for-byte.
This doc is the concrete checklist: what the new engine must provide, what
the adapter must satisfy, and the acceptance gates that prove it — with the
gotchas OeL already taught us attached to each step.

## Design

### Engine prerequisites (hard requirements, engine-side)

The new game's engine package must provide, before any adapter work starts:

- **A pure reducer over serializable state** — `(state, command) → state`,
  no hidden mutability, state round-trips through JSON. JSONL replay, the
  exporter's incremental cursor ([16](16-shard-exporter.md)), and golden
  tests all assume replayability.
- **A legal-move oracle** — either token-completion style like OeL's
  `control()`/`completions()` (partial command → next-token candidates) or a
  direct full-move enumerator. The adapter absorbs either shape;
  completion-style is nicer for human UIs but is *not* required for training.
- **Determinism after a seeded start** — given the opening commands (OeL's
  `CONFIG`/`START` analog, seed included), the game is a pure function of its
  seed: card draws and tile flips derive from seeded state, never from
  `Math.random` inside the reducer.
- **Per-player scoring, callable mid-game and terminal** — the rollout
  cutoff and gen-0 self-play evaluate *non-terminal* states
  ([09](09-game-adapter.md)'s `outcome` contract, [12](12-evaluator-interface.md)'s
  `RolloutEvaluator`).
- **A terminal predicate** and correct **player-to-move at every state** —
  including any interrupt/response sub-turns. OeL's `WORK_CONTRACT`
  interrupts were the bug magnet here; per-node `playerToMove` is what makes
  PUCT's per-player backup correct ([13](13-puct-search.md)).

Not required (OeL luxuries the core never sees): interrupt semantics, a
neutral player, a rondel, a landscape grid, or a completion-token grammar.
Required contracts regardless of genre: `outcome()` returns per-player values
in `[0,1]` **with a defined mid-game meaning** (score rank for comparative
games); non-comparative/solo modes need an explicit squash — follow the solo
σ-mapping precedent from [09](09-game-adapter.md) (`σ((score − target)/scale)`,
thresholds in adapter config, the binary rate stays the reported metric).

### The adapter checklist (`GameAdapter<TState, TMove, TCfg>` from [09](09-game-adapter.md))

Implement `agent/src/game/<game>.ts` item by item, each with its OeL lesson:

- `name`, `initial(cfg, seed)` — replay the opening; a bad opening throws.
- `apply` — reducer + throw→`undefined`; never partially mutates.
- `isTerminal` / `playerToMove` / `numPlayers` — trivial delegations, but
  `playerToMove` must be right during sub-turns (see above).
- `outcome` — per-player `[0,1]`, defined mid-game; map solo/co-op modes
  through a σ-squash as in [09](09-game-adapter.md).
- `legalMoves(state, caps)` — **canonical + deduped, no exceptions.** Before
  writing any code, audit the new engine's move emission for OeL's k²
  joined-token equivalent ([10](10-move-canonicalization.md)): anywhere
  enumeration emits multiple encodings of one reducer-identical move splits
  policy mass and wastes curation budget. Write the game's `canonicalize` +
  in-DFS seen-set first; prove it with the never-merge-distinct-states
  property over a state corpus.
- `moveKey(move)` — canonical serialization that **round-trips**
  (`parseMoveKey(moveKey(m))` reapplies identically) and contains **no
  whitespace inside a token**, so join-with-space/`split(' ')` is unambiguous.
  This key is the JSONL v2 and shard identity
  ([14](14-selfplay-v2.md)/[16](16-shard-exporter.md)).
- `sampleMove(state, rng)` — **cheap**: a random completion walk or
  equivalent, never full enumeration. Rollouts call it in the inner loop;
  enumerate-then-pick silently multiplies gen-0 cost by the branching factor.
- `heuristic?` — optional; only needed for a greedy baseline.
- `featureSpec` + `encodeState`, `actionSpec` + `encodeMove` — below.

### State encoder guidelines (the new game's `encode.ts`)

Follow [01](01-state-encoder.md)'s shape, not its contents:

- **Egocentric rotation**: mover → slot 0, relative turn order preserved;
  frame player one-hots emitted in rotated slot space.
- **Fixed-capacity categorical vocabs, append-only ordering** — 01's
  stability rule. Trained weights are keyed by id position; reordering is
  silent corruption. Pin specific ids in tests.
- **Anchored spatial grids** if the game has player boards (Agricola/Caverna
  farms): fix logical origin to a constant output row/col so bookkeeping
  offsets don't shift learned spatial features.
- **Reserve capacity on day one** for every expansion axis the game is known
  to have (decks, expansion buildings, player counts) — OeL's
  country-capacity lesson from [07](07-engine-fast-paths.md): reserving slots
  while no trained weights exist is free; growing a vocab later invalidates
  every checkpoint.
- **Emit `featureSpec`** with `featureLen`, `version`, block offsets, grid
  geometry, `categorical` entries, and every vocab list. The Python side is
  data-driven ([18](18-model.md)): the **same OelNet architecture family**
  applies by changing `spec.json` only — grid dims, channel counts, scalar
  widths, and vocab capacities are all spec-driven. The one case needing
  actual `model.py` code: a game with **no spatial board** makes the conv
  tower optional (spec declares zero grids; the trunk consumes scalars
  only) — a small, guarded change, not a fork.

### ActionSpec / move encoder guidelines ([11](11-action-encoder.md) generalized)

Decompose each canonical move into fixed-length blocks:

- command **one-hot** (append-only command vocab);
- categorical ids (cards, buildings, animals) **sharing the state-side
  embedding vocabs** — same id space as the corresponding state channel so
  one `nn.Embedding` serves both towers;
- placement **one-hots** aligned to the state grid's anchored coordinates;
- combinatorial payments/conversions as **summed resource-count vectors** —
  this is what made OeL's 1,600+ payment variants learnable;
- a few scalars (`numParams`, flags for tokens the count-sum erases — OeL's
  `usesJoker` precedent).

Acceptance rule for feature collisions: two distinct canonical moves may
share an encoding **only if they are state-equivalent** (applying both yields
deep-equal states) — the pilgrimageSite precedent from
[11](11-action-encoder.md). Audit every multi-param command for ordering
information the summed bag would lose; add a discriminating scalar wherever
the audit finds real loss. Encoders never throw on unknown tokens.

### Reused with zero changes — the payoff

Explicitly: `puct.ts` ([13](13-puct-search.md)), `Evaluator`/`RolloutEvaluator`
([12](12-evaluator-interface.md)), self-play v2 + the worker pool
([14](14-selfplay-v2.md)/[15](15-selfplay-workers.md)), the npy exporter
(parameterized by the specs, [16](16-shard-exporter.md)), the trainer's
data/model/train/export-onnx stack (spec-driven,
[17](17-trainer-scaffold.md)–[20](20-onnx-export.md)), `OnnxEvaluator`
([21](21-onnx-evaluator.md)), arena + gating ([22](22-arena-gating.md)), the
orchestrator ([23](23-orchestrator.md)), and the smoke harness
([24](24-smoke-e2e.md)). If any of these needs a game-conditional branch,
that is an adapter-contract bug, not an onboarding task.

### Run-directory / config implications

- `config.json` gains a `gameId` (adapter selector); CLIs and orchestrator
  resolve the adapter from it, defaulting to `"oel"` so existing runs parse
  unchanged.
- **Runs never mix games** (unlike game *configs*, which one run mixes
  freely per [15](15-selfplay-workers.md)) — feature/action specs differ, so
  shards and checkpoints are incompatible across games by construction; the
  exporter and trainer assert `gameId` + spec versions in `meta.json`.
- **Model checkpoints are per-game.** No transfer learning in v1;
  warm-starting one game's net from another's trunk is a future experiment,
  noted and deliberately unbudgeted.

## Implementation plan

1. Engine prerequisites audit (checklist above) — file engine issues first.
2. `canonicalize`/`moveKey` for the new game, with the duplicate-emission
   audit and property tests ([10](10-move-canonicalization.md)'s method).
3. The adapter, delegating to the engine's own internal modules
   ([09](09-game-adapter.md)'s delegation pattern).
4. `encode.ts` + `featureSpec` in the game package; `encodeMove` +
   `actionSpec` in the adapter package.
5. `gameId` plumbing in config/CLIs/orchestrator.
6. The acceptance ladder below, in order.

## Inputs

- The new game's engine package (reducer, oracle, scoring, terminal).
- The frozen contracts: `GameAdapter`, `ActionSpec`, `FeatureSpec`,
  JSONL v2, shard layout, `spec.json`.

## Outputs

- `agent/src/game/<game>.ts` (+ its `<game>Moves.ts`/`<game>Action.ts`),
  the game package's `encode.ts`/`featureSpec`, `gameId` in config, and a
  checked-in `runs/smoke-<game>/config.json`.

## How it runs / verification (each gate blocks the next)

1. **Adapter unit suite** — every enumerated move applies; canonical-dedupe
   property (never merges distinct applied states) over a state corpus;
   `moveKey` round-trip; seeded determinism (same seed ⇒ same game).
2. **Golden-game regression** — full command lists for random-vs-random and
   tiny-sims self-play pinned per seed.
3. **Benchmark run** — [08](08-benchmarks.md)'s harness pointed at the new
   adapter; publish branching distribution (raw vs deduped) and per-op costs
   like OeL's, since throughput assumptions do not transfer between games.
4. **Tiny smoke loop** — [24](24-smoke-e2e.md)'s config with the new
   `gameId`, `--gens 2`, closing selfplay→export→train→gate end-to-end in
   minutes.
5. **Real run** — [26](26-first-run.md)'s playbook: one bring-up config
   first, promoted net beats pure UCT at equal sims.

## Design notes & tradeoffs

- **One adapter package per game vs a `games/` dir in `agent/`.** A separate
  package per game keeps engine deps isolated but adds workspace ceremony per
  game; a `games/<id>/` directory inside `agent/` matches how `game/oel.ts`
  already lives and keeps the adapter registry a static map. Chosen: `games/`
  dir in `agent/`, one engine dependency per subdir; revisit if adapters grow
  their own release cadence.
- **Sharing the erection-embedding trick across games.** The *pattern* (state
  and action towers share one categorical vocab) transfers; the *vocabs* do
  not — ids are game-local, and pretending an Agricola card id and an OeL
  building id share a space would poison both. Each game ships its own
  vocab + capacity in its own spec.
- **Demand token-completion oracles vs accept direct enumerators.** The
  adapter absorbs either: completion-style gives cheap `sampleMove` walks and
  a two-click human UI for free, but forcing it onto an engine that naturally
  enumerates whole moves buys nothing for training. Require only the oracle's
  *output* contract; recommend completion-style when the game will also be
  played by humans through the web/MCP seam.
- **Per-game model vs multi-game model.** v1 is strictly per-game: the net
  conditions on *config within a game* (the config one-hots in the shared
  block), not across games — a shared multi-game trunk is a research project
  with different specs, vocabs, and value semantics per game, and nothing in
  the current loop needs it. Per-game checkpoints keep gating and promotion
  exactly as [22](22-arena-gating.md)/[23](23-orchestrator.md) define them.

# 22 — Arena gating & promotion

| | |
| --- | --- |
| Status | planned |
| Package | `agent/` |
| Depends on | [04](04-baselines-arena.md), [21](21-onnx-evaluator.md) |
| Milestone | M6 |

## Goal

Only nets that demonstrably beat the current champion get to generate the
next generation's data — the flywheel's ratchet.

## Design

### parsePolicy grammar extension

Today `agent/src/cli/arena.ts` has a synchronous
`parsePolicy(spec: string): Policy` handling `random | greedy | mcts[:sims]`,
consumed positionally (`pnpm arena [games] [short|long] [policyA] [policyB]`).
The extended grammar:

```
policy := "random" | "greedy" | "mcts"[":"sims] | "nn:" source [":"sims]
source := <path to model.onnx> | "best@" <run dir>      e.g. best@runs/r1
sims   := integer                                        (nn default: 200)
```

Parsing rules: strip the `nn:` prefix; if the final `:`-separated segment is
all digits, it is `sims` and is split off (paths on this project never end in
an all-digit segment, and we are on posix so no drive-letter colons); if the
remainder starts with `best@`, read `<run>/best.json` and resolve its `onnx`
field relative to the run dir — a missing `best.json` is an error at parse
time, not a silent fallback.

Two mechanical changes ripple from this:

- `parsePolicy` becomes `async (spec) => Promise<Policy>` because
  `createOnnxEvaluator` awaits `InferenceSession.create`; the CLI top-level
  `await`s both policies before starting.
- `Policy.pick` (`agent/src/policy.ts`) widens to
  `(state, rng) => Move | undefined | Promise<Move | undefined>`, and
  `playGame` / `runMatch` in `agent/src/arena.ts` become async and `await`
  each pick. Existing sync policies are untouched (`await` on a non-promise
  is a no-op); the arena CLI and self-play call sites gain an `await`.

The `nn:` policy itself is [13](13-puct-search.md)'s `puctPolicy` with an
`OnnxEvaluator`, **no Dirichlet noise**, argmax move selection (τ→0) —
evaluation, not exploration. Its `name` is `nn(<gen-or-basename>,<sims>)` so
match logs identify exactly what played.

### Gate procedure

Invoked by the orchestrator ([23](23-orchestrator.md)) as
`gate(runDir, gen)`; also runnable by hand as a CLI:

```
candidate = <runDir>/gen-NNN/model.onnx           (must exist, spec-checked)
champion  = best.json exists
              ? nn:<best.json .onnx>:<gate.sims>
              : mcts:<gate.sims>                   // gen-1 special case: pure UCT
                                                   // is champion until first promotion
result = runMatch(candidatePolicy, championPolicy, {
  games: gate.games,                               // ≥ 100, must be even (assert)
  cfg,                                             // from config.json
  baseSeed: gate.baseSeed + gen * gate.games,      // fresh openings per gate,
})                                                 // reproducible from config
yardstick = runMatch(candidatePolicy, mcts400Policy, { games: gate.yardstick.games, … })
write gen-NNN/arena.json  { candidate, champion, params, result, yardstick }
if result.aWinRate >= gate.threshold (0.55): promote()
advance STATE → gated either way
```

**Seat/seed schedule.** `runMatch` already alternates which policy takes
seat 0 (`swap = g % 2 === 1`) and derives per-game determinism from
`seed = baseSeed + g` with `pcg32(seed * 7919 + 1)` — the gate reuses
this unchanged. The per-generation `baseSeed` offset means no two gates
replay the identical opening set (which would correlate outcomes across
generations), while any gate is exactly reproducible from `config.json`.
Even game counts are asserted so seats balance.

**Parallelism.** 100 games at 200 sims is hours of single-threaded search
(comparable to a self-play tranche), so gate games are distributed across
the [15](15-selfplay-workers.md) worker pool by game index. The seed
schedule is a pure function of `g`, so the result is identical at any worker
count.

The candidate-vs-`mcts:400` yardstick is always played and logged, never
gated on: it is the fixed-strength ruler showing absolute progress across
the whole run, whereas promoted-vs-promoted only shows relative progress.

### Config panel and the solo bucket

One net serves all configs (1–4 players × short/long × both countries), so
the gate evaluates a **panel of config buckets** from `config.json`
(`gate.panel`), not one config. Gating on all 16 buckets at ≥100 games each
is a day of compute, so the panel is a representative subset (e.g.
`2p-long-france`, `4p-short-ireland`, `1p-long-france`) with per-bucket game
counts; ungated buckets are covered statistically by self-play sampling the
full mix and by rotating one "guest" bucket through the panel across
generations.

- **2–4 player buckets**: head-to-head `runMatch` vs the champion exactly as
  above (seat-alternated; for 3–4p the remaining seats are filled with
  champion copies, and the candidate's mean rank-outcome is the score).
- **Solo bucket**: there is no opponent — candidate and champion each play
  the *same fixed seed set* and the comparison is **paired**: per seed,
  candidate wins the pair if its final score is higher (success counting per
  [09](09-game-adapter.md): the reported metric is the score>500 rate, also
  logged per side). Pairing on identical seeds cancels board-setup variance,
  which for N=50-ish solo games is the difference between signal and noise.
- **Promotion rule**: weighted mean of per-bucket win rates ≥ `threshold`
  (0.55) **and** no panel bucket below 0.45 — a net that trades 4p collapse
  for 2p gains must not ratchet in. Per-bucket results all land in
  `arena.json`.

### best.json atomic update

On promotion, write `runs/<id>/best.json`:

```json
{
  "gen": 7,
  "onnx": "gen-007/model.onnx",
  "ckpt": "gen-007/ckpt/model.pt",
  "arena": { "games": 100, "winRate": 0.58, "eloDiff": 56, "vsYardstick": 0.61 },
  "promotedAt": "2026-07-01T04:12:33Z"
}
```

Paths are run-relative so the run dir survives `rsync` to another machine
([25](25-rocm-runbook.md)). The write is temp-file-then-`rename` on the same
filesystem — atomic, so a crash mid-gate can never leave a torn champion.

### Statistical notes — what 55% over 100 games means

- The 95% binomial CI half-width at p̂ = 0.55 over 100 games is
  1.96·√(0.55·0.45/100) ≈ **±9.8 percentage points** — the gate resolves
  roughly "clearly better vs clearly not", nothing finer.
- Under the null of an equal-strength candidate (p = 0.5), the chance of
  scoring ≥ 55/100 is ~18% — a meaningful false-promotion rate per gate.
- This is accepted deliberately: falsely promoting an *equal* net costs
  almost nothing (its self-play data is as good as the old champion's), and
  the ratchet is applied repeatedly, so drift toward weaker nets requires
  repeatedly beating the gate from below — increasingly unlikely. Falsely
  rejecting a slightly better net merely delays it one generation. The
  `mcts:400` yardstick is the independent instrument that would expose
  sustained regression.
- SPRT (as chess-engine testing uses) reaches decisions on clearly
  better/worse candidates in far fewer games, but adds sequential-stopping
  machinery and interacts awkwardly with the fixed seed schedule and the
  worker-pool dispatch. It stays a later nicety; the fixed-N gate is trivial
  to audit.

## Inputs

- Candidate `model.onnx`, `best.json` (or its absence), gate params from
  `config.json` (`games`, `sims`, `threshold`, `baseSeed`, yardstick spec).

## Outputs

- `gen-NNN/arena.json` (full match record, both matches); updated
  `best.json` on promotion; `STATE` → `gated`.

## How it runs / verification

```sh
pnpm --dir agent arena 100 long nn:runs/r1/gen-003/model.onnx:200 nn:best@runs/r1:200
pnpm --dir agent arena 50  long nn:best@runs/r1:400 mcts:400     # the yardstick
```

- `pnpm --dir agent test` — spec parsing (`nn:` path vs `best@` vs sims
  suffix, error on missing best.json); promotion threshold logic including
  draws-as-half; best.json update atomicity (write-temp-rename); async
  `runMatch` still deterministic for sync policies.
- Determinism: same config ⇒ same seeds ⇒ same match outcome, so every gate
  in a run's history is auditable after the fact.

## Design notes & tradeoffs

- **Fixed-N 55% gate vs SPRT vs Elo threshold.** An Elo threshold is just a
  win-rate threshold in different units (55% ≈ +35 Elo), so it adds nothing
  at N=100. SPRT's real advantage — early stopping — matters when gates are
  frequent and compute-precious; here one gate per 1–2 days of self-play is
  a rounding error, and fixed-N keeps results reproducible and the code a
  loop. Revisit if generation time drops 10×.
- **Gating vs AlphaZero-style always-accept.** AlphaGo Zero gated at 55%
  over 400 games; the final AlphaZero paper dropped gating and always used
  the latest net, and KataGo largely follows suit — at their scale, data
  volume and shuffling buffers smooth over a bad net. At *our* scale (500
  games/gen, window 5), one collapsed value head generating a whole
  generation of poisoned data is a real setback measured in days. Gating is
  cheap insurance in the small-data regime; Leela Chess Zero's early history
  (test runs derailed by regressions that gating would have caught) is the
  cautionary tale.
- **Evaluating with noise off and argmax.** The gate measures deployment
  strength: no Dirichlet noise, τ→0. The known hazard is that two
  deterministic players on a fixed opening replay the same game; here the
  `START <seed>` opening randomization plus per-game seeds vary the games,
  and seat alternation cancels first-mover bias. If arena games ever look
  duplicated (identical command lists), the fix is a small τ for the first
  few moves of arena games only — noted now so it is a knob, not a surprise.

# 24 — Smoke end-to-end run

| | |
| --- | --- |
| Status | planned |
| Package | repo (config + CI wiring) |
| Depends on | [23](23-orchestrator.md) |
| Milestone | M6 |

## Goal

Prove the whole loop closes — gen-0 self-play through training through a
gated gen-1 — in minutes on any machine (laptop, CI, the trashcan), so
pipeline regressions are caught before burning a GPU-day.

## Design

### The checked-in config

`runs/smoke/config.json`, in full (same schema the real run uses,
[26](26-first-run.md)):

```json
{
  "run": "smoke",
  "game": { "players": 2, "country": "france", "length": "short" },
  "selfplay": {
    "gamesPerGen": 8,
    "workers": 2,
    "sims": 16,
    "cPuct": 1.5,
    "dirichlet": { "epsilon": 0.25, "alphaScale": 10 },
    "temperature": { "tau": 1.0, "moves": 8 },
    "curation": { "maxPerLevel": 8, "maxMoves": 32 },
    "gen0": { "evaluator": "rollout", "sims": 16, "rolloutDepth": 30 },
    "baseSeed": 1000
  },
  "train": {
    "device": "cpu",
    "window": 1,
    "epochs": 2,
    "batchSize": 64,
    "lr": 0.001,
    "weightDecay": 0.0001,
    "valueLossWeight": 1.0,
    "seed": 7
  },
  "gate": {
    "games": 6,
    "sims": 16,
    "threshold": 0.55,
    "enforce": false,
    "baseSeed": 9000,
    "yardstick": null
  }
}
```

`"enforce": false` means the gate plays and logs but promotion happens
regardless — 6 games of 16-sim search say nothing about strength, and the
smoke run must exercise the promotion + `best.json` path deterministically.
`"yardstick": null` skips the `mcts:400` match (pure runtime with no
assertion value here). `train.seed` pins torch's RNG so the loss-decrease
assertion below is reproducible.

### Command and assertions

```sh
pnpm --dir agent loop --config runs/smoke/config.json --gens 2
pnpm --dir agent smoke        # runs agent/src/cli/smoke.ts against runs/smoke/
```

The assertion script checks, in order (each failure names the file it
inspected):

1. `gen-000/STATE` and `gen-001/STATE` both read `gated`.
2. Every gen-000 JSONL line has `netId: "rollout"`; every gen-001 line has
   `netId: "gen-000"` — proving gen-1 actually played with gen-0's ONNX.
3. JSONL line counts equal `gamesPerGen`; every game replays
   (`v: 2`, decisions non-empty, visits sum to sims at each decision —
   sampling a few games is enough).
4. Shard `meta.json` decision totals equal the JSONL decision totals for
   the same generation.
5. `best.json` exists and points at `gen-001` artifacts that exist.
6. Sanity, not strength: gen-000's `train-log.jsonl` final total loss <
   first total loss (2 epochs on ~8 games with a fixed seed makes this
   near-deterministic; see tradeoffs).
7. The Node ONNX parity fixture test passed (already enforced by
   `pnpm --dir agent test`, re-run here so the smoke job is self-contained).

### CI wiring

There is **no agent or trainer CI today** — `.github/workflows/` contains
only `game.yml` (game tests on PRs touching `game/**`), `hourly.yml` (web
cron), and `publish.yml` (npm release). This project adds the first
workflow that installs the pnpm *workspace* (agent depends on
`hathora-et-labora-game` via `workspace:`) and the first that installs
Python. Sketch, following `game.yml`'s existing conventions
(checkout@v7, pnpm/action-setup@v6, setup-node@v6, explicit pnpm-store
cache):

```yaml
name: smoke
on:
  workflow_dispatch:
  pull_request:
    paths: [agent/**, trainer/**, game/src/**, runs/smoke/**, .github/workflows/smoke.yml]
jobs:
  smoke:
    runs-on: ubuntu-latest
    timeout-minutes: 30
    steps:
      - uses: actions/checkout@v7
      - uses: pnpm/action-setup@v6
        with: { package_json_file: agent/package.json }
      - uses: actions/setup-node@v6
        with: { node-version: 24.x }          # pinned, NOT `latest` like game.yml:
                                              # onnxruntime-node prebuilds lag new majors
      # pnpm store cache: same 4 steps as game.yml, keyed on agent+game package.json
      - run: pnpm install --no-frozen-lockfile          # repo root — workspace install
      - uses: astral-sh/setup-uv@v7
        with: { enable-cache: true, cache-dependency-glob: trainer/uv.lock }
      - run: uv sync                                    # working-directory: trainer
      - run: pnpm --dir agent loop --config runs/smoke/config.json --gens 2
      - run: pnpm --dir agent smoke
```

Details that will bite if skipped:

- **Torch CPU wheel caching**: `uv sync` with the default (CPU) extra pulls
  a ~190 MB torch wheel; `setup-uv`'s cache keyed on `trainer/uv.lock` makes
  that a one-time cost (~2–4 min cold, <30 s warm).
- **onnxruntime-node postinstall** must be allowlisted in
  `pnpm-workspace.yaml` (`onlyBuiltDependencies`) — see
  [21](21-onnx-evaluator.md). The smoke job is the regression net for this.
- Expected wall clock: setup ~2 min, `uv sync` warm <1 min, loop < 10 min,
  assertions <1 min ⇒ **~12 min warm, ~16 cold**; `timeout-minutes: 30`
  leaves headroom without letting a hang eat a runner for hours.

### Deliberately NOT asserted

- **Strength** of anything: gate win-rates, yardstick results, which side
  won. 6 games at 16 sims are noise; asserting on them creates flaky CI.
- Absolute loss values or loss *thresholds* — only first-vs-final ordering
  under a fixed seed.
- Timing (beyond the job timeout) — CI runners vary too much.

## Inputs

- The checked-in smoke config; no GPU, no network beyond package installs.

## Outputs

- A disposable `runs/smoke/` tree (git-ignored except `config.json`);
  pass/fail for CI.

## How it runs / verification

```sh
pnpm --dir agent loop --config runs/smoke/config.json --gens 2 && pnpm --dir agent smoke
```

Target wall-clock: < 10 minutes on a laptop CPU. Also run manually after
any change to the shard format, spec versions, or the ONNX graph contract —
it is the only test that crosses all three language boundaries
(TS engine → npy → torch → ONNX → onnxruntime-node) in one shot.

## Design notes & tradeoffs

- **Every PR vs nightly.** The paths filter already scopes the job to PRs
  that touch the pipeline (`agent/`, `trainer/`, `game/src/`), so the
  ~12-minute cost lands only where it can pay off; a repo where most PRs
  touch `web/` never pays it. Nightly-only would be cheaper still, but this
  pipeline's failure mode is "three-language integration rot discovered the
  night you start a GPU run" — exactly the failure a per-PR gate exists to
  prevent. If the job creeps past ~20 minutes, demote the loop to nightly
  and keep unit + parity tests on PRs.
- **Asserting loss decrease vs pipeline completion only.** Completion-only
  is robust but would happily pass a trainer that reads shuffled targets and
  learns nothing — the historical worst-case bug class here (silent
  offset/perspective mixups). Loss decrease over 2 epochs on a tiny fixed
  dataset with pinned seeds is the cheapest signal that gradients connect
  data to loss, and it is near-deterministic in that regime. It can still
  flake on a torch version bump changing kernel determinism; the agreed
  response is to re-pin the seed/expectations in the same PR, never to
  delete the assertion. Real learning verification lives in
  [19](19-training-loop.md)'s overfit test and [26](26-first-run.md)'s
  gates, not here.
- **Why `gate.enforce: false` instead of a tiny real gate.** A real 55%
  gate over 6 games is a coin flip that would randomly leave gen-1 either
  promoted or not, making assertions 2 and 5 nondeterministic. Forcing
  promotion keeps the smoke run a *pipeline* test with one deterministic
  path through every branch that matters (including best.json writing);
  gate *logic* correctness is unit-tested in [22](22-arena-gating.md).

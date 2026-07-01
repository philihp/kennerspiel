# 14 — Self-play v2 (JSONL v2)

| | |
| --- | --- |
| Status | planned |
| Package | `agent/` |
| Depends on | [10](10-move-canonicalization.md), [13](13-puct-search.md) |
| Milestone | M4 |

## Goal

Self-play games recorded in a format the training pipeline can actually
consume: complete policy-target support, O(steps) size, full provenance.

## Design

`agent/src/selfplay.ts` rewritten around PUCT + evaluator:

- **Temperature schedule**: sample the move ∝ `visits^(1/τ)` with τ = 1 for
  the first ~30 decisions, then argmax. Root Dirichlet noise on
  ([13](13-puct-search.md)).
- **JSONL v2**, one game per line:

```jsonc
{
  "v": 2,
  "gameId": "…", "cfg": {…}, "seed": 123,
  "netId": "rollout | gen-007",
  "search": { "sims": 200, "cPuct": 1.5, "dirichlet": {…}, "tempMoves": 30 },
  "commands": [["CONFIG",…], …],          // the whole game, replayable
  "decisions": [{
    "step": 12,                            // index into commands — no prefix copies
    "perspective": 1,
    "candidates": ["USE LR2 Jo", …],       // FULL canonical list (moveKey strings)
    "visits": [120, 40, 0, …],             // aligned, zeros included
    "chosen": 0
  }],
  "outcome": [1, 0], "finished": true, "steps": 214
}
```

Fixes v1's two data bugs: per-decision command-prefix copies (O(steps²)) and
missing unexpanded candidates.

## Inputs

- Adapter, evaluator, run config (game cfg, sims, temperature, noise), seeds.

## Outputs

- `selfPlayGame(adapter, evaluator, cfg, seed, rng, opts): SelfPlayGameV2`
- JSONL v2 lines (written by the worker CLI, [15](15-selfplay-workers.md)).

## How it runs / verification

- `pnpm --dir agent test` —
  - round-trip: replaying `commands` reproduces `outcome`; replaying
    `commands[0..step)` yields a state whose `legalMoves` equals
    `candidates` under the same caps and seed;
  - visits sum to sims at every decision;
  - file size scales linearly with steps (regression guard vs v1).

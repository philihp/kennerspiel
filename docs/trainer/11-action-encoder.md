# 11 — ActionSpec & move feature encoder

| | |
| --- | --- |
| Status | planned |
| Package | `agent/` |
| Depends on | [07](07-engine-fast-paths.md), [10](10-move-canonicalization.md) |
| Milestone | M3 |

## Goal

A fixed-length feature vector per *move*, so the policy head can score any
enumerated candidate. This is the design decision that makes full AlphaZero
tractable here.

## Why move-scoring (and not the alternatives)

- **Flat indexed action space**: a full move is (command, erection, col, row,
  payment…). Payments are multisets over 22 goods, context-dependent, with
  observed tails of 1,662 legal variants — a flat head needs tens of
  thousands of mostly-dead outputs plus masking computed by enumerating
  anyway. Infeasible and game-specific.
- **Token-factorized policy / token-level tree**: principled, but the payment
  *level* is a single fat token (`'ShShWo'` is one completion string), partial
  commands aren't states the reducer can apply, and tree depth ×3–5 means
  *more* oracle calls per simulation, not fewer.
- **Move-scoring**: median branching is 18 and curation caps candidates at
  ~64–128; scoring each candidate with a small net conditioned on the state
  embedding handles variable action sets natively, keeps priors and visit
  targets on the same list, and is trivially game-agnostic.

## Design

`agent/src/game/oelAction.ts`, egocentric, ~90 floats per move:

| Block | Size | Encoding |
| --- | --- | --- |
| Command | 14 | one-hot in `featureSpec.vocab.commands` order (append-only stable) |
| Primary erection param | 1 | categorical id, same vocab as the grid's erection channel (shared embedding table in the net) |
| Placement col | 9 | one-hot |
| Placement row | 38 | one-hot, anchored via the mover's `landscapeOffset` so policy rows align with state-grid rows |
| Resource params | 22 | all remaining params through `parseResourceParam`, summed into per-good counts — this is what makes 1,600 payment variants learnable |
| Scalars | ~6 | param count, isCommit, isConvert, … |

`ActionSpec` (in `adapter.ts`): `{ moveFeatureLen, version, categorical:
[{name, offset, capacity, vocab}] }` — emitted as JSON next to shards so the
PyTorch model builds itself data-driven ([18](18-model.md)) and the trainer
can assert version compatibility.

## Inputs

- Canonical moves ([10](10-move-canonicalization.md)); the mover's state (for
  `landscapeOffset` anchoring); helpers exported in
  [07](07-engine-fast-paths.md).

## Outputs

- `encodeMove(state, perspective, move, out: Float32Array): void` wired into
  the OeL adapter; `actionSpec` constant; `spec.json` emit helper.

## How it runs / verification

- `pnpm --dir agent test` — property tests over fixture-game states: every
  enumerated move encodes NaN-free and in-bounds; distinct canonical moves
  encode to distinct vectors on a large sample; coordinate anchoring matches
  the state grid for known positions.

# 01 — State encoder (egocentric tensor)

| | |
| --- | --- |
| Status | ✅ done (`game/src/encode.ts`) |
| Package | `game/` |
| Depends on | — |

## Goal

Encode a `GameState` as a fixed-length `Float32Array` suitable as neural-net
input, so any position can be turned into training/inference features without
bespoke feature engineering per consumer.

## Design

- **Egocentric perspective**: the encoding rotates seats so the requested
  perspective is always slot 0. The net never spends capacity learning that
  seats are interchangeable, and every absolute position yields N training
  samples.
- **Layout**: `MAX_PLAYERS(4) × PLAYER_BLOCK + FRAME + SHARED`, where a player
  block is a 38×9 landscape grid × 10 channels (6 land one-hots, 1 categorical
  erection-id channel, 3 clergy flags) plus per-player scalars (22 resources,
  wonders, clergy buckets, settlement hand). `FEATURE_LEN ≈ 14.7k` floats
  (~57 KB dense f32, ~29 KB f16).
- **Categorical erection channel**: buildings/settlements are a single id
  (embedding-friendly) rather than one-hots; vocab capacity is reserved at 256
  so adding buildings never changes `FEATURE_LEN`. Enum orderings are
  **append-only** — trained weights are keyed by id.
- **`featureSpec` export**: machine-readable offsets, grid geometry, vocab
  lists, and versions, so downstream code (exporter, PyTorch model) is built
  data-driven rather than hard-coding shapes.
- Implementation is an imperative preallocated `Writer` (no per-call
  allocation churn beyond the output buffer).

## Inputs

- A `GameState` (any status) and a perspective index.

## Outputs

- `encode(state, perspective?) → Float32Array(FEATURE_LEN)`
- `featureSpec`, `FEATURE_LEN` exported from `hathora-et-labora-game`.

## How it runs / verification

- Library code — consumed by the exporter (16) and evaluators (12, 21).
- `pnpm --dir game test` — encoder unit tests pin offsets, vocab stability,
  and perspective rotation.

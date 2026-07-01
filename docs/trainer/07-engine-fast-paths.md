# 07 — Engine fast paths

| | |
| --- | --- |
| Status | planned |
| Package | `game/` |
| Depends on | [01](01-state-encoder.md) |
| Milestone | M1 |

## Goal

Remove the two known per-simulation hot-path costs in the engine's public
API, and export the helpers the action encoder needs. This is the single
highest-leverage search speedup available.

## Design

1. **`completions(state, partial): string[]`** in `game/src/control.ts`.
   Every `control()` call currently also runs `computeFlow` (a bounded
   200-iteration frame-walk allocating `Flower[]`) and per-player scoring —
   neither of which move enumeration reads. `completions()` is the same
   `ts-pattern` dispatch over `complete*` functions with flow/score skipped;
   `control()` is reimplemented on top of it.
2. **`encodeInto(state, perspective, out: Float32Array, offset?)`** in
   `game/src/encode.ts`. The `Writer` already targets a buffer; `encode()`
   becomes a two-line wrapper. Lets the exporter and evaluators reuse one
   scratch buffer instead of allocating ~57 KB per call.
3. **Erection-id lookup Map** — `erectionId` currently does `indexOf` over the
   vocab per tile; precompute a `Map<ErectionEnum, number>` at module load
   (same pattern as the existing building-mask index).
4. **Export helpers**: `parseResourceParam` (from `game/src/board/resource.ts`)
   and the erection-id/vocab helpers from `encode.ts`, via `game/src/index.ts`.
   Additive, non-breaking; needed by [11](11-action-encoder.md).

## Inputs

- Existing `control.ts` / `encode.ts` internals; fixture games under
  `game/src/__tests__/` for parity states.

## Outputs

- New exports from `hathora-et-labora-game`: `completions`, `encodeInto`,
  `parseResourceParam`, erection-id helpers.
- A minor version bump of the package.

## How it runs / verification

- `pnpm --dir game test` — new parity suite: for every state and partial
  reached while replaying fixture games, `completions(state, partial)` deep-
  equals `control(state, partial).completion`; `encodeInto` output equals
  `encode` output.
- Benchmark ([08](08-benchmarks.md)) shows `completions()` ≫ `control()`
  (expect ~5–10× on enumeration-heavy states) and `encode` ≤ 0.5 ms.

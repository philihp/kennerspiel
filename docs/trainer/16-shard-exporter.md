# 16 — Tensor shard exporter

| | |
| --- | --- |
| Status | planned |
| Package | `agent/` |
| Depends on | [07](07-engine-fast-paths.md), [11](11-action-encoder.md), [14](14-selfplay-v2.md) |
| Milestone | M5 |

## Goal

Bridge Node → Python: turn JSONL games into numpy-readable tensor shards.
Python cannot run the TS engine, so all replay + encoding happens here.

## Design

**JSONL is the durable archive; shards are disposable.** Regenerated per
training run, pruned after gating — an encoder/actionSpec version bump never
strands data (re-export is a replay away).

### Dimensions (recomputed from `game/src/encode.ts`)

`FEATURE_LEN = 14,670` today: 4 player blocks of 3,455 (35 scalars — 22
resources + 1 wonders + 4 clergy buckets + 8 settlement types — plus a
38×9×10 grid = 3,420) + frame 549 + shared 301. Block offsets: players at
`[0, 3455, 6910, 10365]`, frame at 13,820, shared at 14,369. Once
[07](07-engine-fast-paths.md) reserves `COUNTRY_CAPACITY = 8`, shared grows
to 307 and `featureLen` to 14,676 — the exporter always writes whatever
`featureSpec.featureLen` says, never a literal. One f16 state row is
~28.7 KiB. `moveFeatureLen = 91` per [11](11-action-encoder.md) (14 command +
1 erection id + 9 col + 38 row + 4 buy-side + 22 resources + 3 scalars).

### Shard directory layout

Shards of 4,096 decisions, zero-padded sequence names:

```
gen-NNN/shards/shard-00042/
  states.npy        [N, featureLen]      <f2   (~28.7 KiB/row)
  values.npy        [N, maxPlayers=4]    <f4   (outcome rotated: slot0 = perspective)
  value_mask.npy    [N, 4]               |u1   (live seats)
  cand_feats.npy    [M, moveFeatureLen]  <f2   (ragged concat)
  cand_offsets.npy  [N+1]                <i8   (prefix sums into M; offsets[0]=0)
  policy.npy        [M]                  <f4   (visit fractions, sum to 1 per slice)
  chosen.npy        [N]                  <i4   (index into the decision's slice)
  meta.json         { featureSpecVersion, actionSpecVersion, featureLen,
                      moveFeatureLen: 91, rows, cands, games, netId, exporterGitSha }
```

Sizing at first-config scale: ~250–350 decisions/game × 500–2,000 games/gen →
125k–700k rows → ~4–21 GB of f16 states per generation (states dominate;
candidates add ~10–15%). Fine to hold transiently, wasteful to keep.

### `agent/src/npy.ts` — minimal .npy writer

The v1.0 format is: magic `\x93NUMPY` (6 bytes) · version `\x01\x00` ·
`HEADER_LEN` as uint16 LE · an ASCII Python-dict literal, space-padded so
`10 + HEADER_LEN` is a multiple of 64, with a final `\n`. Example header dict:

```
{'descr': '<f2', 'fortran_order': False, 'shape': (4096, 14670), }
```

Data follows as raw little-endian bytes, C-order. numpy mmaps it with zero
extra deps. API:

```ts
export type NpyDtype = '<f2' | '<f4' | '<i4' | '<i8' | '|u1'
export const npyHeader = (dtype: NpyDtype, shape: number[]): Buffer
export const writeNpySync = (path: string, dtype: NpyDtype, shape: number[], data: NodeJS.ArrayBufferView): void
```

### f32 → f16 conversion

JS has no native f16 array (until `Float16Array` is everywhere); convert
explicitly, `Float32Array` → `Uint16Array`, round-to-nearest-even:

```ts
const f32 = new Float32Array(1)
const u32 = new Uint32Array(f32.buffer)
export const f16bits = (v: number): number => {
  f32[0] = v
  const x = u32[0]
  const sign = (x >>> 16) & 0x8000
  const exp = (x >>> 23) & 0xff
  let mant = x & 0x7fffff
  if (exp === 0xff) return sign | 0x7c00 | (mant ? 0x200 : 0) // Inf / NaN
  const e = exp - 127 + 15 // rebias
  if (e >= 0x1f) return sign | 0x7c00 // overflow → Inf
  if (e <= 0) {
    if (e < -10) return sign // underflow → signed zero
    mant |= 0x800000 // make the implicit 1 explicit; shift into subnormal
    const shift = 14 - e
    const h = mant >>> shift
    const rem = mant & ((1 << shift) - 1)
    const half = 1 << (shift - 1)
    return sign | (rem > half || (rem === half && h & 1) ? h + 1 : h)
  }
  const h = sign | (e << 10) | (mant >>> 13)
  const rem = mant & 0x1fff
  return rem > 0x1000 || (rem === 0x1000 && h & 1) ? h + 1 : h // RNE; carry into exponent is still correct
}
```

Golden vectors for the unit test: `1.0 → 0x3C00`, `-2.0 → 0xC000`,
`65504 → 0x7BFF`, `65520 → 0x7C00` (Inf), `2049 → 0x6800` (ties-to-even →
2048), `1/13 → 0x2CEC`, `NaN → 0x7E00`, `-0 → 0x8000`.

### Replay & encode loop — `agent/src/cli/export.ts`

```ts
type ExportOpts = { run: string; gen: number; shardRows?: number /* 4096 */ }
export const exportGen = (opts: ExportOpts): Promise<{ rows: number; shards: number }>
```

Per JSONL v2 game ([14](14-selfplay-v2.md)): decisions carry `step` (index
into `commands`) and the **full** canonical candidate list, so no search or
`legalMoves` rerun is needed — just one incremental replay cursor:

```ts
for (const game of jsonlLines(file)) {
  let state = initialState; let step = 0
  for (const dec of game.decisions) {
    while (step < dec.step) state = apply(state, game.commands[step++])!
    adapter.encodeInto(state, dec.perspective, stateScratch)      // Float32 scratch
    f16Into(stateScratch, shard.stateRow())                       // → Uint16 shard buf
    for (const key of dec.candidates)
      adapter.encodeMove(state, dec.perspective, parseMoveKey(key), shard.candRow())
    shard.pushTargets(rotateOutcome(game.outcome, dec.perspective), normalize(dec.visits), dec.chosen)
    if (shard.rows === opts.shardRows) shard.flush()
  }
}
```

Buffers are preallocated per shard (`Uint16Array(4096 × 14670)` ≈ 115 MiB
etc.); the last partial shard flushes at end. `parseMoveKey` is the canonical
moveKey → `Move` parser from [10](10-move-canonicalization.md).

**Value-target rotation** — the JSONL `outcome` is seat-indexed; states are
egocentric (encoder slot 0 = perspective), so values must rotate identically
to `encode.ts`'s `rotateOrder`:

```
values[slot]     = slot < P ? outcome[(perspective + slot) % P] : 0   // P = numPlayers
value_mask[slot] = slot < P ? 1 : 0                                   // slot in 0..3
```

**Policy** — `policy[i] = visits[i] / Σ visits` over the decision's slice
(sims > 0 guarantees the sum is positive); `chosen` is copied through as the
slice-local index.

### Atomic write & idempotency

Each shard is assembled in `shards/.tmp-shard-00042-<pid>/`, files fsynced,
`meta.json` written last, then the directory `fs.rename`d to
`shard-00042/` — a rename on the same filesystem is atomic, so a crash never
leaves a half-shard with a valid name. On start the exporter deletes any
`.tmp-*` leftovers and any existing `shard-*` for the gen (export is
regenerate-from-scratch, so rerun-after-crash is safe). `STATE` →
`exported` only after the final rename.

### Throughput estimate

Per decision: one `apply` (~0.1–0.5 ms with the [07](07-engine-fast-paths.md)
fast paths — the dominant cost), one `encodeInto` (~20 µs), 14,670 f16
conversions (~15 µs), ~18 (median) candidate encodes (~10 µs). Call it
0.2–0.7 ms/decision single-threaded → 600k decisions ≈ 2–7 minutes plus
~20 GB of sequential writes (NVMe-trivial). Single process first; fan out
over JSONL files with workers only if [08](08-benchmarks.md) shows it matters.

Optional later: 2× value-only augmentation by re-encoding each state from the
non-mover's perspective (policy loss masked for those rows).

## Design notes & tradeoffs

- **.npy vs safetensors vs parquet vs raw+index.** `.npy` wins on both ends:
  ~60 lines of Node to write, `np.load(mmap_mode='r')` to read, no schema
  library on either side. safetensors would need a JS writer dep and buys
  features (single file, named tensors) we don't need across seven small
  arrays. Parquet is row-group/columnar machinery for tabular data — wrong
  shape for dense tensors and heavy on the Node side. Raw bytes + a JSON index
  is basically .npy minus the self-describing header, i.e. strictly worse.
- **f16 states vs f32.** Audit of what the encoder actually writes: one-hots
  and masks (exact in f16); normalized rondel deltas/yields in [0,1] (f16 has
  ~10 bits of mantissa → error ≤ 5e-4, irrelevant to a net); raw integer
  counts — resources, wonders, clergy buckets, prices, round number, erection
  ids ≤ 80. f16 represents integers exactly up to 2,048; no OeL quantity
  plausibly approaches that (a hoarding player might reach a few hundred
  coins). So f16 halves 20 GB of states at zero effective loss. Targets
  (`values`, `policy`) stay f32: they're tiny and it keeps loss math exact.
- **Regenerated per run vs archived.** Regenerate. Shards are a pure function
  of (JSONL, featureSpec, actionSpec); archiving them means versioning them,
  and 20 GB/gen × dozens of gens is real disk for zero information. The
  orchestrator ([23](23-orchestrator.md)) prunes them after gating.
- **4,096-row shards vs bigger.** 4,096 rows ≈ 115 MiB of states — big enough
  that header/inode overhead vanishes and sequential read is long, small
  enough that (a) the writer's preallocated buffer stays modest, (b) an
  atomic-rename unit is quick, and (c) shard-granularity shuffling
  ([17](17-trainer-scaffold.md)) still mixes ~150 shards per generation.
  1M-row shards would pin GB-scale buffers and reduce shuffle granularity to
  a handful of units.
- **Ragged concat + offsets vs padded `[N, maxCands]`.** Median branching is
  18, curation caps at ~128. Padded at the cap: 4,096 × 128 × 90 × 2 B ≈
  94 MiB/shard, >85% zeros. Ragged at the mean: 4,096 × ~18 × 90 × 2 B ≈
  13 MiB — a ~7× saving, and the offsets array is 32 KiB. The cost is a
  segment-aware model/loss ([18](18-model.md)), which we need anyway for
  variable candidate counts at inference.

## Inputs

- `gen-NNN/selfplay/*.jsonl` (v2); the OeL adapter's `encodeState` /
  `encodeMove` / specs.

## Outputs

- `gen-NNN/shards/shard-*/` as above; `STATE` marker → `exported`.

## How it runs / verification

```sh
pnpm --dir agent export --run runs/r1 --gen 3
```

- `pnpm --dir agent test` — npy writer golden bytes (header for a known
  dtype/shape byte-for-byte); `f16bits` golden vectors above; offsets are
  monotone with `offsets[N] = M`; every policy slice sums to 1 ± 1e-6;
  rotation invariant `values[0] === outcome[perspective]`.
- Cross-language: Python (`trainer/tests/`) mmaps a Node-written shard and
  asserts bit-exact values on a golden decision ([17](17-trainer-scaffold.md)).
- Crash-safety: kill mid-export, rerun, assert no `.tmp-*` residue and shard
  count/contents identical to an uninterrupted run.

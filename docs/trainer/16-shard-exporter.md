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

- **JSONL is the durable archive; shards are disposable.** Regenerated per
  training run, pruned after gating — an encoder/actionSpec version bump never
  strands data (re-export is a replay away).
- `agent/src/npy.ts`: minimal `.npy` writer (the format is a ~128-byte header
  + raw little-endian data; trivially emitted from Node, memory-mappable by
  numpy with zero extra Python deps).
- `agent/src/cli/export.ts`: replay each game once, and at each decision
  `encodeInto` the state and `encodeMove` every candidate into preallocated
  buffers. Shards of 4,096 decisions:

```
gen-NNN/shards/shard-00042/
  states.npy        [N, featureLen]      float16   (~29 KB/row)
  values.npy        [N, maxPlayers]      float32   (outcome rotated: slot0 = perspective)
  value_mask.npy    [N, maxPlayers]      uint8     (live seats)
  cand_feats.npy    [M, moveFeatureLen]  float16   (ragged concat)
  cand_offsets.npy  [N+1]                int64     (prefix sums into M)
  policy.npy        [M]                  float32   (visit fractions, normalized)
  chosen.npy        [N]                  int32
  meta.json         { featureSpecVersion, actionSpecVersion, featureLen,
                      moveFeatureLen, games, decisions, netId }
```

- Sizing at first-config scale: ~250–350 decisions/game × 500–2,000 games/gen
  → ~4–20 GB f16 per generation. Fine to hold transiently, wasteful to keep.
- Optional later: 2× value-only augmentation by re-encoding each state from
  the non-mover's perspective (policy loss masked for those rows).

## Inputs

- `gen-NNN/selfplay/*.jsonl` (v2); the OeL adapter's `encodeState` /
  `encodeMove` / specs.

## Outputs

- `gen-NNN/shards/shard-*/` as above; `STATE` marker → `exported`.

## How it runs / verification

```sh
pnpm --dir agent export --run runs/r1 --gen 3
```

- `pnpm --dir agent test` — npy writer golden bytes; offsets/policy
  normalization invariants.
- Cross-language: Python (`trainer/tests/`) mmaps a Node-written shard and
  asserts bit-exact values on a golden decision ([17](17-trainer-scaffold.md)).

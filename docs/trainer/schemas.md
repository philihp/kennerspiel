# Schemas — canonical cross-project data contracts

Every file format and tensor interface that crosses a project boundary in the
offline-AlphaZero trainer, in one place. **When two project docs disagree
about a shape, this doc wins.** Each contract: who writes / who reads / what
version-bumps it, a typed definition, then validator invariants.

Corrections canonicalized here (see "Change procedure" for how to evolve):
`moveFeatureLen` is **91** (doc 11; doc 16's "≈90" and doc 20's `[131, 90]`
example are stale); the Dirichlet config key is **`alphaScale`** (docs 13/14;
the `"alpha": 0.5` in docs 24/26 example configs should read
`"alphaScale": 10`); `STATE` is written **only by the orchestrator** (doc 23;
stage docs saying "STATE → x" mean "the orchestrator advances STATE after me").

---

## 1. `runs/<id>/config.json` — run configuration

Written once by a human when a run is created; read by the orchestrator
(doc 23) and every stage CLI (defaults for flags; CLI overrides win). It has
no version field — it is per-run, and the trainer records a `config_hash` in
checkpoints so a silent mid-run edit is caught at resume. Changing it
mid-run is allowed only for values not yet consumed (practically: start a new
run dir instead).

```ts
type GameCfg = { players: 1|2|3|4; country: 'france'|'ireland'; length: 'short'|'long' }
// NOTE: no `colors` here — the adapter defaults seat colors. The JSONL `cfg`
// field (§2) records the full GameConfig including colors.

type RunConfig = {
  run: string                                    // run id, must equal the dir name
  game: GameCfg                                  // single-config run …
      | { mix: { cfg: GameCfg; weight: number }[] } // … or weighted mix (doc 26)
  selfplay: {
    gamesPerGen: number                          // JSONL-line target per generation
    workers: number                              // worker_threads pool size
    sims: number                                 // PUCT simulations per decision
    cPuct: number                                // default 1.5
    dirichlet: { epsilon: number; alphaScale: number } // ε=0.25, alphaScale=10; α = alphaScale/rootCandidateCount
    temperature: { tau: number; moves: number }  // τ=1 sampling for first `moves` decisions, then argmax
    curation: { maxPerLevel: number; maxMoves: number } // enumeration caps (distinct canonical moves)
    gen0: { evaluator: 'rollout'; sims: number; rolloutDepth: number } // used until first promotion
    baseSeed: number                             // game seed = baseSeed + gameIndex (default gen * 1_000_000)
  }
  solo: { target: number; scale: number }        // value mapping σ((score − target)/scale); defaults { target: 500, scale: 100 }
  train: {
    device: 'auto'|'cpu'|'cuda'
    window: number                               // K generations of shards (doc 19: 5)
    epochs: number                               // effective epochs → step budget ceil(E·rows/batch)
    batchSize: number                            // decisions per batch (256)
    lr: number
    lrSchedule?: 'cosine'                        // default cosine w/ 200-step linear warmup
    weightDecay: number                          // AdamW decoupled (1e-4)
    valueLossWeight: number                      // λ in L = L_policy + λ·L_value (1.0)
    seed: number                                 // torch/numpy/python RNG
  }
  gate:                                          // scalar shorthand (single-config runs) …
    { games: number; sims: number; threshold: number      // even games ≥ … ; 0.55
      enforce: boolean                                    // false ⇒ play, log, promote regardless (smoke)
      baseSeed: number                                    // gate seeds = baseSeed + gen*games + g
      yardstick: { policy: string; games: number } | null } // e.g. { policy: 'mcts:400', games: 100 }
  | // … or the panel form (config-mix runs, doc 26)
    { panel: { bucket: string; games: number }[]          // bucket = '<P>p-<length>-<country>'
      threshold: number; bucketFloor: number              // 0.55 weighted mean AND every bucket ≥ 0.45
      sims: number; enforce: boolean; baseSeed: number
      yardstick?: { policy: string; games: number } | null }
}
```

Invariants:
- `run` equals the run directory basename.
- mix weights are positive; cfg→game assignment is deterministic weighted
  round-robin over `gameIndex` (doc 15) — the (seed, cfg) corpus is a pure
  function of this file plus the target count.
- `gate.games` (and each panel bucket's games for 2–4p) is even (seat balance).
- `dirichlet.epsilon ∈ [0,1]`; `temperature.tau > 0`; `threshold ∈ (0.5, 1]`;
  `bucketFloor < threshold`.
- `solo.scale > 0`; the 1p bucket's gate is paired-by-seed score comparison,
  reported metric = score>500 rate (docs 09/22).

## 2. JSONL v2 — self-play game line

One JSON object per line, one line per completed game. Written by self-play
workers (`gen-NNN/selfplay/worker-K.jsonl`, one `appendFileSync` per game);
read by the shard exporter (doc 16), the resume scanner (doc 15), and the
smoke assertions (doc 24). **This is the durable archive** — everything else
regenerates from it. Schema changes bump the `v` field (currently `2`).

```ts
type SelfPlayGameV2 = {
  v: 2                          // first field — cheap to sniff
  gameId: string                // "g" + seed; stable across resumes
  cfg: GameConfig               // { players, country, length, colors } — full, incl. colors
  seed: number                  // opening seed AND rng derivation: mulberry32(seed*7919+3)
  netId: string                 // evaluator.id: "rollout" | "gen-NNN"
  search: { sims: number; cPuct: number
            dirichlet: { epsilon: number; alphaScale: number } | null
            tempMoves: number
            curation: { maxPerLevel: number; maxMoves: number } }
  commands: string[][]          // whole game incl. CONFIG/START opening — replayable
  decisions: Decision[]
  outcome: number[]             // per-player [0,1], seat-indexed; solo: σ((score−target)/scale)
  finished: boolean             // reached GameStatusEnum.FINISHED
  steps: number                 // decisions taken
}

type Decision = {
  step: number                  // index into commands; replay commands[0..step) ⇒ the state
  perspective: number           // playerToMove at the decision (encoder slot 0)
  candidates: string[]          // FULL canonical moveKey list, order = adapter.legalMoves
  visits: number[]              // aligned; zeros included; sums to search.sims
  q: number[]                   // aligned mover-Q from PUCT, rounded to 4 dp
  chosen: number                // index into candidates; commands[step] ≡ candidates[chosen].split(' ')
  forced?: true                 // present-and-true only for single-candidate short-circuits (visits = [sims])
}
```

**moveKey grammar** (doc 10): canonical move tokens joined by a single
space. Tokens contain no whitespace; coordinate tokens are single integers
(possibly negative) — joined `"col row"` engine tokens are truncated to their
leading integer during canonicalization. Round-trip is exact:
`moveKey(m).split(' ')` ≡ the canonical token array.

Invariants:
- Line parses as JSON with `v === 2` (truncated last line ⇒ crash artifact:
  truncate and regenerate that seed).
- Replaying `commands` reproduces `outcome`, `finished`, `steps`.
- Per decision: `visits.length === q.length === candidates.length`;
  `Σ visits === search.sims`; `0 ≤ chosen < candidates.length`;
  replaying `commands[0..step)` yields a state whose `legalMoves` (same caps)
  equals `candidates`.
- Seeds are unique across all `worker-*.jsonl` of a generation.

## 3. Shard directory — `gen-NNN/shards/shard-XXXXX/`

Written by the Node exporter (doc 16), read by the Python `ShardDataset`
(doc 17). **Disposable**: a pure function of (JSONL, featureSpec, actionSpec);
regenerated per training run, pruned once outside the training window. An
encoder change bumps `featureSpecVersion` (move encoder: `actionSpecVersion`)
and simply requires re-export. Shards hold 4,096 decisions (last shard
partial); dirs are built in `.tmp-*` and atomically renamed, `meta.json`
written last.

Dimensions: `moveFeatureLen = 91` (doc 11). `featureLen = featureSpec.featureLen`
from `game/src/encode.ts` — **14,676** as of project 07's `COUNTRY_CAPACITY = 8`
(`featureSpec.version = 2`; the pre-07 layout was **14,670** / v1, +6 in the
shared block on the bump). Never hardcode it downstream; assert it.

| File | Shape | dtype | Contents |
| --- | --- | --- | --- |
| `states.npy` | `[N, featureLen]` | `<f2` | egocentric encoding, slot 0 = perspective |
| `values.npy` | `[N, 4]` | `<f4` | outcome rotated: `values[s] = s < P ? outcome[(perspective+s) % P] : 0` |
| `value_mask.npy` | `[N, 4]` | `\|u1` | `1` for slots `< numPlayers`, else `0` |
| `cand_feats.npy` | `[M, 91]` | `<f2` | ragged concat of per-decision candidate encodings, JSONL order |
| `cand_offsets.npy` | `[N+1]` | `<i8` | prefix sums into M; `offsets[0] = 0`, `offsets[N] = M` |
| `policy.npy` | `[M]` | `<f4` | `visits[i] / Σ visits` per decision slice |
| `chosen.npy` | `[N]` | `<i4` | slice-local index of the played move |

`meta.json`:

```jsonc
{ "featureSpecVersion": 1, "actionSpecVersion": 1,
  "featureLen": 14670, "moveFeatureLen": 91,
  "rows": 4096, "cands": 73912, "games": 17,
  "netId": "gen-003", "exporterGitSha": "…" }
```

**.npy v1.0 header rule** (the Node writer, `agent/src/npy.ts`): magic
`\x93NUMPY` (6 B) · version `\x01\x00` · `HEADER_LEN` uint16 LE · ASCII
Python-dict literal `{'descr': '<f2', 'fortran_order': False, 'shape': (4096, 14670), }`
space-padded so `10 + HEADER_LEN` is a multiple of 64, ending in `\n`; then
raw little-endian C-order bytes. Allowed dtypes: `<f2 <f4 <i4 <i8 |u1`.

Invariants:
- All seven `.npy` + `meta.json` present, or the dir name starts `.tmp-` (dead).
- `offsets` strictly increasing (every decision has ≥ 1 candidate);
  `offsets[N] === M === cands`; `rows === N`.
- Every policy slice sums to 1 ± 1e-6; `chosen[i] < offsets[i+1] − offsets[i]`.
- `values[i][0] === outcome[perspective]` (rotation invariant); masked slots are 0.
- No NaN/Inf in `states`/`cand_feats` (f16 payloads bit-exact vs the Node
  golden fixture).
- All shard metas in a training window agree on both spec versions and both
  lengths — with each other, with `spec.json`, and with a resumed ckpt (doc 17).

## 4. `spec.json` — model interface descriptor

Written by `oel-export-onnx` (doc 20) next to `model.onnx`; read by
`OnnxEvaluator` construction (doc 21, asserted against the adapter's specs)
and the trainer's version guard. Regenerated on every export; any field that
changes reflects a version bump upstream (featureSpec / actionSpec / graph
interface), never an in-place edit.

```jsonc
{ "featureSpecVersion": 1,        // adapter.featureSpec.version at export
  "actionSpecVersion": 1,         // adapter.actionSpec.version
  "featureLen": 14670,
  "moveFeatureLen": 91,
  "maxPlayers": 4,
  "graphInterfaceVersion": 1,     // §5 contract version
  "opset": 18,
  "netId": "gen-007",             // lands in JSONL netId via Evaluator.id
  "ckpt": "gen-007/ckpt/model.pt" // source checkpoint, run-relative
}
```

Invariants: every field present; `featureLen`/`moveFeatureLen` match the
adapter constants; consumers abort naming both sides on any mismatch
("model built against featureSpec v3, adapter is v4").

## 5. ONNX graph interface (`model.onnx`)

Produced by the export wrapper (doc 20), consumed by `onnxruntime-node`
inside `OnnxEvaluator` (doc 21) and by the Python parity test. Changing
inputs/outputs/semantics bumps `graphInterfaceVersion` in `spec.json`.

| Tensor | Direction | Shape | dtype | Notes |
| --- | --- | --- | --- | --- |
| `states` | in | `[B, featureLen]` | f32 | dynamic axis 0 = `B` |
| `cand_feats` | in | `[M, moveFeatureLen]` | f32 | ragged concat; dynamic axis 0 = `M` |
| `cand_offsets` | in | `[B+1]` | i64 | prefix sums; `[0] = 0`, `[B] = M` |
| `values` | out | `[B, maxPlayers]` | f32 | **post-sigmoid**, egocentric slot order |
| `logits` | out | `[M]` | f32 | **raw, pre-softmax** |

Invariants:
- Softmax is applied **outside** the graph, per candidate slice, max-subtracted
  (doc 21) — the graph never normalizes over segments.
- Precondition: every decision has ≥ 1 candidate ⇒ offsets strictly
  increasing (asserted at export and by the evaluator, not tolerated).
- Opset 18, f32 weights; graph contains no `Loop`/`If` nodes (structural check).
- torch ↔ onnxruntime max |Δ| ≤ 1e-4 on values and logits across B ∈ {1,7,64},
  including a 1-candidate decision.

## 6. `gen-NNN/parity/golden.json` — parity fixture

Written by `trainer/tests/test_onnx.py` (doc 20) from a real shard, with
**torch** outputs as expected values; replayed by the Node parity test
(doc 21) against the same `model.onnx` — proving Node-packing ≡ torch
transitively. Its own `v` bumps with the fixture format; `specVersions`
mirror `spec.json`. (The committed tiny-model test fixture in `agent/` uses
this same schema.)

```jsonc
{ "v": 1, "specVersions": { "feature": 1, "action": 1 }, "opset": 18,
  "tolerance": 1e-4,
  "cases": [ { "B": 7, "M": 131,
    "inputs":   { "states":       { "shape": [7, 14670], "dtype": "f32", "b64": "…" },
                  "cand_feats":   { "shape": [131, 91],  "dtype": "f32", "b64": "…" },
                  "cand_offsets": { "shape": [8],        "dtype": "i64", "b64": "…" } },
    "expected": { "values": { "shape": [7, 4], "dtype": "f32", "b64": "…" },
                  "logits": { "shape": [131],  "dtype": "f32", "b64": "…" } } } ] }
```

Invariants: `b64` decodes to exactly `∏shape × dtype-size` little-endian
bytes; shapes are mutually consistent (`offsets` length `B+1`, last element
`M`); at least one case with `B = 1` and one with a 1-candidate decision.

## 7. `runs/<id>/best.json` — current champion

Written only by the gate on promotion (doc 22), temp-file-then-`rename`
(atomic — a crash mid-gate never leaves a torn champion). Read by self-play
(`--net` resolution), the gate itself (champion policy, warm-start source),
and `parsePolicy`'s `best@<run>` form. Absent file = no promotion yet
(gen-0/rollout era). No version field; the shape rides on this doc.

```jsonc
{ "gen": 7,
  "onnx": "gen-007/model.onnx",       // run-relative — the run dir must survive rsync
  "ckpt": "gen-007/ckpt/model.pt",    // run-relative
  "arena": { "games": 100, "winRate": 0.58, "eloDiff": 56, "vsYardstick": 0.61 },
  "promotedAt": "2026-07-01T04:12:33Z" }
```

Invariants: both paths run-relative (never absolute) and existing;
`winRate ≥ gate.threshold` unless `enforce: false`; `promotedAt` ISO-8601 UTC.

## 8. `gen-NNN/arena.json` — gate record

Written by `gate.ts` after both matches (doc 22), win or lose; read by the
orchestrator (done-condition, loop-log fields) and humans auditing a run.
One per generation; existence is the `gated` done-condition.

```jsonc
{ "gen": 7,
  "candidate": "gen-007/model.onnx",
  "champion": "gen-006/model.onnx",        // or "mcts:<sims>" before first promotion
  "params": { "sims": 200, "threshold": 0.55, "bucketFloor": 0.45,
              "baseSeed": 900000, "enforce": true },
  "buckets": [                              // one entry per panel bucket (scalar gate ⇒ one bucket)
    { "bucket": "2p-long-france", "games": 100, "winRate": 0.58, "eloDiff": 56 },
    { "bucket": "1p-long-france", "games": 50, "winRate": 0.60,  // paired-by-seed
      "scoreOver500Rate": { "candidate": 0.42, "champion": 0.36 } } ],
  "result": { "winRate": 0.58, "promoted": true },   // weighted mean; promoted = mean ≥ threshold AND every bucket ≥ bucketFloor
  "yardstick": { "policy": "mcts:400", "games": 100, "winRate": 0.44, "eloDiff": -42 } // or null
}
```

Invariants: per-bucket seeds derive from `baseSeed + gen * games + g`
(reproducible from `config.json` alone); 2–4p bucket games even
(seat-alternated); solo buckets paired on identical seed sets; `promoted`
consistent with `threshold`/`bucketFloor` (or `enforce: false` noted);
yardstick always played and logged when configured, never gated on.

## 9. `gen-NNN/STATE` — stage marker

A single token + newline naming the **last completed** stage. Written
**only by the orchestrator** (doc 23) — stage CLIs never touch it — after
verifying the stage's done-condition against real artifacts, via
`STATE.tmp` + `rename`. Absent file = nothing completed for that generation.
Token set (append here if the state machine ever grows):

```
selfplay | exported | trained | gated
```

Invariants: file content ∈ token set; the named stage's artifacts actually
exist (JSONL count ≥ gamesPerGen / complete shards matching JSONL totals /
`ckpt/model.pt` + `model.onnx` + `spec.json` / `arena.json`); `trained`
means ckpt **and** servable ONNX (export is folded into that transition).

## 10. `loop-log.jsonl` and `gen-NNN/train-log.jsonl`

**`runs/<id>/loop-log.jsonl`** — appended by the orchestrator, one line per
generation after gating (doc 23). Read by the halt logic (failed-gate
streak) and humans/journals. Schema rides on this doc.

```jsonc
{ "gen": 3, "startedAt": "…", "finishedAt": "…",
  "durations": { "selfplay": 25100, "export": 310, "train": 940, "onnx": 12, "gate": 5200 }, // seconds
  "games": 500, "decisions": 152340, "netId": "gen-003",
  "loss": { "first": 4.81, "final": 3.12 },
  "gate": { "games": 100, "winRate": 0.57, "eloDiff": 49, "promoted": true },
  "yardstick": { "games": 100, "winRate": 0.44, "eloDiff": -42 },   // or null
  "champion": "gen-003", "failedGateStreak": 0 }
```

**`gen-NNN/train-log.jsonl`** — written by `oel-train` (doc 19): one
`"type": "step"` line every 50 steps plus one `"type": "summary"` at the end.

```jsonc
{ "type": "step", "ts": "2026-07-01T12:00:00Z", "gen": 3, "step": 1250,
  "lr": 4.1e-4, "loss": 2.31, "policy_loss": 1.98, "value_loss": 0.33,
  "top1_agree": 0.44, "policy_entropy": 2.1,
  "value_mae": 0.31, "grad_norm": 0.8, "rows_seen": 320000 }
{ "type": "summary", "gen": 3, "steps": 5860, "wall_s": 1410,
  "final": { "loss": 1.71, "top1_agree": 0.58 },
  "value_calibration": [[0.05, 0.11], [0.15, 0.18]] }   // [pred-bucket, actual mean]
```

Invariants: both append-only JSONL; step lines contiguous in `step` across a
resume; exactly one summary line per completed training invocation;
`loss === policy_loss + valueLossWeight · value_loss` per step line.

## 11. Version-compatibility matrix

Every mismatch **aborts loudly, naming both sides** — never warn-and-continue;
silently crossing an encoder change is the worst bug class in this pipeline.
JSONL survives every bump: **re-export is the escape hatch.**

| Version field | Declared by | Guards the pair(s) | On mismatch |
| --- | --- | --- | --- |
| `featureSpecVersion` | adapter `featureSpec.version` (`game/src/encode.ts` via doc 09) | state encoder ↔ shard `meta.json` ↔ ckpt `spec` ↔ `spec.json` ↔ OnnxEvaluator | abort; re-export shards from JSONL, retrain or warm-start, re-export ONNX |
| `actionSpecVersion` | adapter `actionSpec.version` (doc 11) | move encoder ↔ shard `meta.json` ↔ ckpt `spec` ↔ `spec.json` ↔ OnnxEvaluator | same as above |
| `graphInterfaceVersion` | `spec.json` (doc 20) | exported ONNX graph ↔ OnnxEvaluator packing/unpacking code | abort at evaluator construction; re-export ONNX from the same ckpt after updating the consumer |
| JSONL `v` | each game line (doc 14) | self-play writer ↔ shard exporter (and resume scanner, smoke checks) | abort export naming the file/line; migrate or regenerate self-play |

Aligned non-version constants asserted alongside: `featureLen` and
`moveFeatureLen` (shards ↔ spec.json ↔ ckpt ↔ adapter), `maxPlayers = 4`,
`opset = 18`, golden.json `specVersions` ↔ `spec.json`.

## Change procedure

1. **State encoder change** (e.g. project 07's `COUNTRY_CAPACITY = 8`,
   14,670 → 14,676): bump `featureSpec.version` in the same commit as the
   layout change. Then, in order: re-export shards for the training window
   (JSONL untouched), retrain or warm-start (the version guard rejects old
   ckpts/shards), `oel-export-onnx` (new `spec.json`), re-generate
   `golden.json`, run the smoke loop (doc 24) before any GPU run.
2. **Move encoder / ActionSpec change**: bump `actionSpec.version`; same
   re-export → retrain → re-export-ONNX → parity sequence.
3. **ONNX graph I/O change**: update exporter and OnnxEvaluator together,
   bump `graphInterfaceVersion`, regenerate `golden.json`; no shard or JSONL
   work needed.
4. **JSONL schema change**: bump `v`, teach the exporter (and resume scanner)
   the new version — support reading the old `v` for one transition window or
   accept regenerating self-play. Never mutate existing lines.
5. **This doc**: any contract edit lands here first (or in the same PR),
   with the owning project doc updated to match. Downstream order is always
   the same: JSONL → shards → ckpt → ONNX/spec.json → evaluator — regenerate
   left-to-right from the first invalidated artifact.

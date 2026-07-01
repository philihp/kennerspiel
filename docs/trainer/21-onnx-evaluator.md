# 21 — ONNX evaluator in Node

| | |
| --- | --- |
| Status | planned |
| Package | `agent/` |
| Depends on | [12](12-evaluator-interface.md), [20](20-onnx-export.md) |
| Milestone | M6 |

## Goal

Serve the trained net inside Node self-play and arena workers: an
`Evaluator` implementation backed by `onnxruntime-node` on CPU.

## Design

### Dependency and module shape

- New dependency: `onnxruntime-node` (CPU execution provider), added to
  `agent/package.json` only — `game/` and `web/` never see it.
- `agent/` is ESM (`"type": "module"`, run via `node --import tsx/esm`);
  `onnxruntime-node` is a CJS native addon. Import via default-interop —
  `import ort from 'onnxruntime-node'` — and destructure
  `const { InferenceSession, Tensor } = ort`. Named ESM imports happen to
  work through cjs-module-lexer today, but the default form is the shape
  the package documents and won't break on a packaging change.
- `onnxruntime-node` ships a postinstall script. This workspace blocks
  dependency build scripts by default (`onlyBuiltDependencies` in
  `pnpm-workspace.yaml` currently lists only `esbuild`), so
  `onnxruntime-node` must be added there or the install silently produces a
  non-functional package. The parity test below is what catches this if it
  regresses.

### Construction

`agent/src/evaluators/onnx.ts`:

```ts
export const createOnnxEvaluator = async (
  modelPath: string,              // …/gen-NNN/model.onnx; spec.json read from the sibling path
  adapter: GameAdapter,           // supplies featureSpec/actionSpec for the assertion
  opts?: { threads?: number }     // intra-op threads, default 1
): Promise<Evaluator>
```

An async factory (not a class constructor) because `InferenceSession.create`
is async. Each `worker_thread` calls it once at startup and owns its session
for the worker's lifetime; sessions are never shared or transferred across
threads.

Session options, deliberately minimal:

```ts
const session = await ort.InferenceSession.create(modelPath, {
  executionProviders: ['cpu'],
  intraOpNumThreads: opts?.threads ?? 1,
  interOpNumThreads: 1,
  graphOptimizationLevel: 'all',
})
```

**Why one intra-op thread**: the self-play pool ([15](15-selfplay-workers.md))
already runs ~one worker per core. ORT's default sizes a thread pool per
session from the machine's core count, which with 12 workers means ~144
threads fighting over 12 cores — contention, not speedup. One thread per
worker keeps the parallelism where it already lives.

### spec.json assertion

At construction, read `spec.json` next to the model and fail loudly on any
mismatch — a stale model must never silently emit garbage priors:

```
assert spec.graphInterfaceVersion is one this evaluator implements
assert spec.featureSpecVersion === adapter.featureSpec.version
assert spec.actionSpecVersion  === adapter.actionSpec.version
assert spec.featureLen         === adapter.featureSpec.featureLen
assert spec.moveFeatureLen     === adapter.actionSpec.moveFeatureLen
```

Every failure names both sides ("model built against featureSpec v3,
adapter is v4"). `Evaluator.id` is derived from the model (`spec.netId`,
falling back to the gen directory name, e.g. `gen-007`) — it lands in JSONL
`netId` for provenance ([14](14-selfplay-v2.md)).

### Input packing

The graph contract is fixed by [20](20-onnx-export.md): inputs
`states [B, featureLen] f32`, `cand_feats [M, moveFeatureLen] f32`,
`cand_offsets [B+1] i64`; outputs `values [B, maxPlayers] f32`,
`logits [M] f32`. Packing an `EvalRequest[]`:

```
B = reqs.length
M = Σ reqs[i].numCands
states     : Float32Array(B × featureLen)        — row i ← reqs[i].state
candFeats  : Float32Array(M × moveFeatureLen)    — ragged concat of reqs[i].candFeats
candOffsets: BigInt64Array(B + 1)                — prefix sums: [0, n0, n0+n1, …, M]

feeds = {
  states:       new ort.Tensor('float32', states, [B, featureLen]),
  cand_feats:   new ort.Tensor('float32', candFeats, [M, moveFeatureLen]),
  cand_offsets: new ort.Tensor('int64', candOffsets, [B + 1]),
}
```

The three scratch buffers are owned by the evaluator instance, grown
geometrically (never shrunk), and reused across calls. This is safe because
each worker's PUCT awaits one `evaluate()` at a time; the evaluator asserts
there is no concurrent in-flight call rather than defending against one.
Every request must have `numCands ≥ 1` (decision points always have a legal
move) — asserted, not tolerated.

### Output unpacking and per-slice softmax

`values` is sliced per row into `number[]` (length `maxPlayers`). Priors are
computed per candidate slice — softmax stays outside the graph by design
(ragged-segment softmax exports poorly):

```
for i in 0..B:
  slice  = logits[off[i] .. off[i+1])
  m      = max(slice)
  e      = slice.map(x => exp(x − m))     // max-subtract: numerically stable
  priors = e.map(x => x / Σe)
```

### Golden-batch parity harness

[20](20-onnx-export.md)'s Python test writes a fixture: a tiny committed
model (tens of thousands of params, ~100–200 KB — small enough to check in,
unlike a real 2M-param net) plus `golden-batch.json` with raw inputs and
expected `values`/`logits` at batch sizes {1, 7} with ragged candidate
counts. The Node test
(`agent/src/evaluators/__tests__/onnx.parity.test.ts`):

1. builds `EvalRequest[]` from the fixture inputs,
2. runs `createOnnxEvaluator` against the fixture model with a stub adapter
   matching the fixture's spec,
3. asserts `values` within 1e-4 of expected, and priors within 1e-4 of
   softmax(expected logits) per slice.

This guards the classic cross-runtime failure — input-packing bugs (row
order, offset off-by-one, i64 vs i32) — not model quality. A second test
spawns two `worker_threads` that each construct a session and run the golden
batch, pinning the addon-under-workers behavior explicitly (see tradeoffs).

## Inputs

- `model.onnx` + `spec.json`; `EvalRequest[]` from PUCT
  ([13](13-puct-search.md)).

## Outputs

- `createOnnxEvaluator` usable anywhere an `Evaluator` is: self-play workers
  ([15](15-selfplay-workers.md)) and the `nn:` arena policy
  ([22](22-arena-gating.md)).

## How it runs / verification

- `pnpm --dir agent test` — golden-batch parity within 1e-4 (values and
  priors); spec.json mismatch throws with both versions named; the
  two-worker-threads smoke test passes.
- Micro-bench in [08](08-benchmarks.md): ms/evaluate at batch 1 and 16, so
  the "engine-bound, not NN-bound" claim is a number, not a hope.

## Design notes & tradeoffs

- **CPU-per-worker vs a GPU inference server.** At ~2M params a forward pass
  is ~4 MFLOPs per position; one CPU core sustaining even a modest 5–20
  GFLOP/s on small GEMMs gives ~0.2–1 ms/eval. PUCT does ≤ `sims` evals per
  move, so NN time is ~40–200 ms of a 1–3 s move — the engine
  (`completions()` + encode) dominates by 5–20×. A GPU server would add IPC
  (each request ships ~60 KB of f32 state alone), cross-worker batching
  queues, and a second process to babysit, all to accelerate the minority
  term. It stays Stage 3 of [12](12-evaluator-interface.md): built only if
  profiling shows NN-bound workers, behind the same interface.
- **Native-dependency risk.** `onnxruntime-node` ships prebuilt binaries per
  platform/arch; building from source is not a realistic fallback. Two
  concrete exposures: (1) brand-new Node majors can lag prebuilt/ABI
  support, so CI pins Node 24.x for anything touching the evaluator rather
  than `node-version: latest` (see [24](24-smoke-e2e.md)); (2) the pnpm
  build-script allowlist noted above. The version is pinned exactly in
  `package.json`, matching the repo's existing convention.
- **worker_threads.** N-API context-aware addons are expected to work in
  workers, and current onnxruntime-node does, but this has broken before in
  its history — hence the explicit two-worker test. If it regresses, the
  fallback is a `child_process`-based pool; [15](15-selfplay-workers.md)'s
  pool abstraction should not leak `worker_threads` specifics so that swap
  stays cheap.
- **Batch=1 now, in-worker batching later.** Stage 1 passes single-request
  arrays (PUCT expands one leaf per simulation). Because the interface is
  already `EvalRequest[] → Promise<EvalResult[]>` and PUCT already carries
  virtual loss ([13](13-puct-search.md)), Stage-2 batching (collect leaves
  from several concurrent simulations, evaluate as one batch) changes no
  interface code — it is purely a scheduling change inside the worker. ORT
  amortizes per-call overhead well under batching, so the win is real but
  only matters once the engine share shrinks
  (post-[07](07-engine-fast-paths.md)).

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

- New dependency: `onnxruntime-node` (CPU execution provider).
- `agent/src/evaluators/onnx.ts`: `OnnxEvaluator(modelPath)` — each
  `worker_thread` owns its own `InferenceSession`; a reused scratch buffer
  packs `EvalRequest[]` into the `states` / `cand_feats` / `cand_offsets`
  graph inputs from [20](20-onnx-export.md); softmax is applied per candidate
  slice on the way out; `id` = the model file's spec version + gen tag (lands
  in JSONL `netId`).
- Asserts `spec.json` versions against the adapter's featureSpec/actionSpec
  at construction — a stale model fails loudly, not silently.
- Why CPU is fine at first: at ~2M params a fused forward is ~0.1–0.5 ms,
  the same order as one `completions()` call — search stays engine-bound.
  If profiling ever shows NN-bound workers, Stage-2 in-worker batching (the
  interface already takes request arrays) comes before any GPU server.

## Inputs

- `model.onnx` + `spec.json`; `EvalRequest[]` from PUCT.

## Outputs

- `OnnxEvaluator` usable anywhere an `Evaluator` is (self-play workers,
  `nn:` arena policy in [22](22-arena-gating.md)).

## How it runs / verification

- `pnpm --dir agent test` — golden-batch parity: outputs match the fixture
  written by [20](20-onnx-export.md)'s Python test within 1e-4 (guards
  against input-packing bugs, the classic cross-runtime failure).
- Micro-bench in [08](08-benchmarks.md): ms/evaluate at batch 1 and 16.

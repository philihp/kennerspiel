# 20 — ONNX export & parity

| | |
| --- | --- |
| Status | planned |
| Package | `trainer/` |
| Depends on | [18](18-model.md) |
| Milestone | M5 |

## Goal

A checkpoint becomes a single `model.onnx` that onnxruntime can serve —
identical outputs to torch, dynamic batch and ragged-candidate friendly.

## Design

- `uv run oel-export-onnx --ckpt gen-NNN/ckpt/model.pt --out gen-NNN/model.onnx`
- Graph interface (fixed contract with [21](21-onnx-evaluator.md)):
  - inputs: `states [B, featureLen] f32`, `cand_feats [M, moveFeatureLen] f32`,
    `cand_offsets [B+1] i64`
  - outputs: `values [B, maxPlayers] f32`, `logits [M] f32`
  - Softmax stays **outside** the graph (Node applies it per candidate slice) —
    keeps the graph free of ragged-segment ops that export poorly.
- Dynamic axes on `B` and `M`; opset pinned; f32 weights (quantization is a
  later experiment).
- `spec.json` (featureSpec + actionSpec versions + graph interface version)
  written next to the model; every consumer asserts it.

## Inputs

- A `.pt` checkpoint from [19](19-training-loop.md).

## Outputs

- `gen-NNN/model.onnx` + `gen-NNN/spec.json`.

## How it runs / verification

- `uv run pytest trainer/tests/test_onnx.py` — torch vs onnxruntime (Python)
  on a golden batch from a real shard: max |Δ| ≤ 1e-4 on values and logits,
  across batch sizes {1, 7, 64} and ragged candidate counts.
- The same golden batch + expected outputs are written to a fixture file for
  the Node-side parity test in [21](21-onnx-evaluator.md).

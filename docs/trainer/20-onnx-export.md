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

### CLI

```sh
uv run oel-export-onnx --ckpt gen-NNN/ckpt/model.pt --out gen-NNN/model.onnx
```

### Graph interface (fixed contract with [21](21-onnx-evaluator.md))

- inputs: `states [B, 14670] f32` · `cand_feats [M, moveFeatureLen] f32` ·
  `cand_offsets [B+1] i64` (prefix sums, `offsets[0] = 0`, `offsets[B] = M`)
- outputs: `values [B, maxPlayers] f32` (post-sigmoid) · `logits [M] f32`
  (raw, pre-softmax)
- Softmax stays **outside** the graph — Node applies it per candidate slice
  on the way out ([21](21-onnx-evaluator.md)).

### Export wrapper — offsets → rows without ragged ops

`OelNet.forward` takes `cand_counts`; the graph contract takes
`cand_offsets`. The exported `OnnxWrapper(nn.Module)` bridges them, and maps
each candidate to its decision's trunk row using only ONNX-clean ops
(ScatterND + CumSum + Gather) — deliberately avoiding
`repeat_interleave` with data-dependent repeats, which lowers to loops or
fails outright:

```python
class OnnxWrapper(nn.Module):
    def forward(self, states, cand_feats, cand_offsets):
        M = cand_feats.shape[0]
        starts = cand_offsets[1:-1]                      # segment boundaries
        ind = torch.zeros(M, dtype=torch.long, device=states.device)
        ind = ind.index_put((starts,), torch.ones_like(starts))
        rows = ind.cumsum(0)                             # [M] candidate -> batch row
        return self.net.heads(self.net.trunk(states), cand_feats, rows)
```

Precondition (asserted at export and by the evaluator): every decision has
≥ 1 candidate, so offsets are strictly increasing and the scatter never
collides. `OelNet` gets a small refactor so trunk/head paths accept
precomputed `rows` — training keeps `counts`, export uses `rows`, weights are
shared.

### Exporter choice: classic `torch.onnx.export` (TorchScript tracer)

Chosen over the `dynamo=True` / `torch.export` path, because:

1. The graph is **trace-safe by construction** — no data-dependent control
   flow anywhere (the cumsum trick above exists precisely to keep it that
   way), so tracing's one weakness doesn't apply.
2. The tracer + onnxruntime pairing is a decade old; the dynamo exporter is
   still churning (op coverage, dynamic-shape corner cases) and
   `onnxruntime-node` lags desktop ORT — conservative is right where a silent
   numeric mismatch costs a full generation.
3. Everything used here (Conv, GroupNormalization, Gemm, Gather, ScatterND,
   CumSum, Sigmoid, embedding-as-Gather) is mature in both exporters — the
   dynamo path buys nothing today. Revisit when torch deprecates the tracer;
   the parity test is the safety net either way.

### Dynamic axes & opset

```python
torch.onnx.export(wrapper, (states, cand_feats, cand_offsets), out,
    input_names=["states", "cand_feats", "cand_offsets"],
    output_names=["values", "logits"],
    dynamic_axes={"states": {0: "B"}, "cand_feats": {0: "M"},
                  "cand_offsets": {0: "B1"}, "values": {0: "B"}, "logits": {0: "M"}},
    opset_version=18)
```

**Opset 18**, pinned: it is the first opset with native `GroupNormalization`
(otherwise GN decomposes into a reshape/InstanceNorm chain — correct but
slower and noisier to diff), and it is comfortably supported by
onnxruntime ≥ 1.16, including `onnxruntime-node`. Weights export as **f32**;
quantization is a later experiment (below).

### Why softmax stays outside the graph

A per-slice softmax over ragged segments inside the graph needs the same
scatter-max/index-add dance as training — exportable, but it triples the
fiddly-op surface for zero benefit: Node already walks each candidate slice
to build PUCT priors, and a slice-local softmax over ≤128 floats is
nanoseconds. Keeping logits raw also lets the consumer apply temperature
without a re-export.

### `spec.json` + golden-batch fixture (shared with [21](21-onnx-evaluator.md))

`spec.json` is written next to the model: featureSpec + actionSpec versions,
`featureLen: 14670`, `moveFeatureLen`, `maxPlayers: 4`, graph interface
version, opset, and source ckpt path — every consumer asserts it before
inference.

`test_onnx.py` additionally writes `gen-NNN/parity/golden.json`, the fixture
the Node parity test in [21](21-onnx-evaluator.md) replays against the same
`model.onnx`:

```jsonc
{ "v": 1, "specVersions": { "feature": …, "action": … }, "opset": 18,
  "tolerance": 1e-4,
  "cases": [ { "B": 7, "M": 131,
    "inputs":   { "states":       { "shape": [7, 14670], "dtype": "f32", "b64": "…" },
                  "cand_feats":   { "shape": [131, 90],  "dtype": "f32", "b64": "…" },
                  "cand_offsets": { "shape": [8],        "dtype": "i64", "b64": "…" } },
    "expected": { "values": { "shape": [7, 4], "dtype": "f32", "b64": "…" },
                  "logits": { "shape": [131],  "dtype": "f32", "b64": "…" } } } ] }
```

Tensors are base64 of little-endian bytes (the exact layout both
`Float32Array` and numpy speak natively); inputs are drawn from a real shard,
expected outputs are **torch** outputs — so 21's test transitively proves
Node-packing ≡ torch, not just Node ≡ Python-ORT.

## Design notes & tradeoffs

- **ONNX vs TorchScript vs a Python inference server.** TorchScript in Node
  means embedding libtorch behind an unmaintained binding — a dead end.
  A Python server keeps torch as the single runtime but adds a process, a
  socket protocol, batching logic, and a failure mode to every self-play
  worker — [12](12-evaluator-interface.md) explicitly defers that to Stage 3
  *if measured necessary*. ONNX + `onnxruntime-node` is one file and one
  battle-tested dependency in-process with the search — the only cost is
  this project's parity discipline, which the golden batch makes mechanical.
- **f32 export vs quantization.** Dynamic int8 quantization would cut model
  size ~4× and speed up the MLP-heavy parts ~2–3×, but conv trunks are the
  hot path ([18](18-model.md)) and int8 conv gains on ORT CPU are workload
  dependent; meanwhile value-head precision drives PUCT directly. Ship f32
  until [21](21-onnx-evaluator.md)'s micro-bench proves NN-bound search,
  then evaluate `quantize_dynamic` behind the same parity test (with a
  loosened, measured tolerance).
- **Graph-internal vs external softmax.** Internal would make the graph
  self-contained ("logits in, probabilities out") and marginally simplify
  consumers — but it hard-codes temperature 1, adds ragged-segment ops to
  the export surface, and duplicates work Node does anyway while walking
  slices. External keeps the graph a pure function of dense tensors; the
  ragged semantics live in exactly two audited places (training loss,
  evaluator).

## Inputs

- A `.pt` checkpoint from [19](19-training-loop.md).

## Outputs

- `gen-NNN/model.onnx` + `gen-NNN/spec.json` (+ `gen-NNN/parity/golden.json`
  from the parity test).

## How it runs / verification

- `uv run pytest trainer/tests/test_onnx.py` — torch vs onnxruntime (Python)
  on golden batches from a real shard: max |Δ| ≤ 1e-4 on values and logits,
  across batch sizes {1, 7, 64} and ragged candidate counts (including a
  decision with exactly 1 candidate, and B = 1).
- The same golden batches + expected outputs land in
  `gen-NNN/parity/golden.json` for the Node-side parity test in
  [21](21-onnx-evaluator.md).
- Structural check: exported graph contains no Loop/If nodes
  (`onnx.helper` walk) — guards against a future torch version silently
  lowering the row-mapping into a loop.

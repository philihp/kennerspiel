# 25 — ROCm hardware bring-up

| | |
| --- | --- |
| Status | planned |
| Package | `trainer/` (scripts + this runbook) |
| Depends on | [17](17-trainer-scaffold.md) |
| Milestone | M7 |

## Goal

The RX 7800 XT (16 GB) box running Linux and training. Documented so it's
reproducible after a reinstall, with the CUDA-rental path as a first-class
alternate.

## Runbook (to be executed and corrected in place)

1. **OS**: Ubuntu 24.04 LTS, fresh install (the machine is being repurposed
   from Windows).
2. **ROCm 6.x** via AMD's apt repo; add user to `render`/`video` groups;
   verify with `rocminfo` (agent should list `gfx1101`).
3. **The unofficial-card override**: the 7800 XT is gfx1101; official ROCm
   support targets gfx1100 (7900 series). Set for every training shell:
   ```sh
   export HSA_OVERRIDE_GFX_VERSION=11.0.0
   ```
   (and `PYTORCH_ROCM_ARCH=gfx1101` only if compiling extensions — we don't.)
4. **uv + torch**: `cd trainer && uv sync --extra rocm` (pulls torch from the
   ROCm wheel index). ROCm torch reports as `cuda` — `--device auto` in the
   trainer resolves it; nothing else changes.
5. **Verify**: `uv run oel-check-gpu` — device name, VRAM, and a matmul
   benchmark; then the overfit test on GPU
   (`uv run pytest -k overfit --device auto`).
6. **Known failure modes**: kernel/driver mismatch after `apt upgrade`
   (pin dkms), GPU hang on first-gen ROCm+RDNA3 with hostile batch sizes
   (drop batch, upgrade ROCm), `HSA_OVERRIDE` forgotten (torch sees no
   device — the check script tests for this and says so).

## Cloud alternate (≤ $50 bring-up budget)

- Any CUDA box (RunPod/Lambda, e.g. a 4090 at ~$0.4–0.7/hr ⇒ ~70–100 hrs of
  budget — far more than needed to prove learning).
- `rsync` the run dir (JSONL + shards or just JSONL + re-export), then:
  `uv sync --extra cu12 && uv run oel-train --run … --gen N`.
- Identical code path; checkpoints/ONNX rsync back.

## Inputs

- The physical machine; `trainer/` from [17](17-trainer-scaffold.md).

## Outputs

- A machine that passes `oel-check-gpu` and the GPU overfit test; this
  document updated with anything that differed in practice.

## How it runs / verification

- `uv run oel-check-gpu` clean; one real training epoch on smoke-run shards
  completes with GPU utilization visible in `rocm-smi`.

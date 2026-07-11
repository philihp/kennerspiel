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

## What is known vs what must be verified on the box

| Claim | Confidence |
| --- | --- |
| RX 7800 XT is Navi 32 = `gfx1101`, 16 GB | known |
| `gfx1101` is **not** on ROCm's official consumer support list (that's the 7900 series, `gfx1100`); the PRO W7700 (`gfx1101`) gained official support in later ROCm 6.x Radeon releases, so gfx1101 kernels exist in recent ROCm libs | known, but which stack versions ship them → **verify on the box** |
| `HSA_OVERRIDE_GFX_VERSION=11.0.0` (run gfx1100 code objects on the gfx1101 card) is the long-standing community workaround and widely reported working for Navi 32 + PyTorch | known as a report; **verify on the box** — it is unsupported by AMD by definition |
| PyTorch ROCm wheels compile for a fixed arch list; whether the current wheel includes native `gfx1101` objects (making the override unnecessary) | **verify on the box** — try without the override first |
| Ubuntu 24.04 (noble) is a supported ROCm 6.x OS (added mid-6.1.x era); exact point-release ↔ kernel pairing | pairing itself known; current matrix → **verify at install time** at rocm.docs.amd.com |
| torch ROCm wheel index URL shape: `https://download.pytorch.org/whl/rocm<X.Y>` | known shape; the exact `<X.Y>` that exists for the pinned torch version → **verify** on pytorch.org's install matrix |
| ROCm torch masquerades as `cuda` (`torch.cuda.is_available()`, `--device auto` in [17](17-trainer-scaffold.md) resolves it) | known |

## Runbook (execute top to bottom; correct this doc in place)

1. **OS.** Ubuntu 24.04 LTS Desktop, fresh install (the machine is being
   repurposed from Windows), stock kernel. Note the kernel version
   (`uname -r`) in this doc once installed — ROCm's dkms module is
   kernel-sensitive.
2. **ROCm 6.x** via the `amdgpu-install` bootstrap (verify the latest
   point release and exact URL against the ROCm install docs first — this
   doc was written against the 6.x era; if a newer major series is current
   at install time the procedure is identical, but re-verify the gfx1101
   and Ubuntu support matrix and the torch wheel index for it):

   ```sh
   wget https://repo.radeon.com/amdgpu-install/<6.x.y>/ubuntu/noble/amdgpu-install_<...>_all.deb
   sudo apt install ./amdgpu-install_*.deb
   sudo amdgpu-install --usecase=rocm
   sudo usermod -aG render,video $USER
   # reboot, then:
   rocminfo | grep -E 'gfx|Marketing'        # expect an agent reporting gfx1101
   rocm-smi                                   # temps/VRAM visible
   ```

   Record the installed version: `apt show rocm-libs | grep Version`.
3. **Torch.** `cd trainer && uv sync --extra rocm`. The `rocm` extra in
   `pyproject.toml` pins torch against the ROCm wheel index:

   ```toml
   [[tool.uv.index]]
   name = "pytorch-rocm"
   url = "https://download.pytorch.org/whl/rocm6.X"   # verify: must match an index
   explicit = true                                     # that exists for the pinned torch
   ```

4. **First contact — without the override**:

   ```sh
   uv run python -c "import torch; print(torch.__version__, torch.cuda.is_available(), torch.cuda.get_device_name(0) if torch.cuda.is_available() else '-')"
   uv run oel-check-gpu     # device name, VRAM, matmul benchmark
   ```

   If the wheel carries native gfx1101 objects, this just works — record
   that here and skip step 5.
5. **The unofficial-card override.** On `torch.cuda.is_available() == False`
   or `HIP error: invalid device function` at the first kernel launch:

   ```sh
   export HSA_OVERRIDE_GFX_VERSION=11.0.0
   ```

   Set it for every training shell (a `trainer/.envrc` or a line in the
   orchestrator's train-stage environment — not a global profile, so its
   presence stays visible). `PYTORCH_ROCM_ARCH=gfx1101` matters only when
   compiling extensions, which we don't.
6. **Prove learning on GPU.** The overfit test from
   [19](19-training-loop.md): `uv run pytest -k overfit` with
   `--device auto` — loss to ~0 on 10 games. This exercises real
   forward/backward kernels, not just a matmul.
7. **Burn-in.** One real training epoch on smoke-run shards
   ([24](24-smoke-e2e.md)) while watching `watch -n1 rocm-smi` — confirm GPU
   utilization, VRAM well under 16 GB, temperatures sane, and no resets in
   `sudo dmesg | grep -i amdgpu` afterwards.
8. **Freeze the good state.** `sudo apt-mark hold` the amdgpu-dkms/rocm
   packages (a routine `apt upgrade` breaking the kernel/driver pairing is
   the top known failure mode), and record versions + any overrides in this
   doc.

### Known failure modes

- **Kernel/driver mismatch after `apt upgrade`** — dkms rebuild fails or the
  GPU vanishes. Prevention: step 8's holds; recovery: reinstall the pinned
  amdgpu-dkms against the running kernel.
- **`HSA_OVERRIDE` forgotten** — torch sees no device or dies at first
  kernel. `oel-check-gpu` explicitly tests for this and prints the fix.
- **GPU hang under hostile batch shapes** (RDNA3 + early ROCm 6.x reports):
  training stalls, `dmesg` shows ring timeouts. Response ladder: reduce
  batch size; update ROCm point release; as a last resort the CPU fallback
  below. Our model (~2M params) is tiny; this is unlikely but documented.

## Fallback ladder (in order, cheapest first)

1. **Override tweaks / ROCm point release change** — most Navi 32 reports
   land here and succeed.
2. **CPU training.** At ~2M params and ~750k-sample windows this is
   genuinely viable: minutes-per-epoch territory, and self-play — not
   training — is the pipeline's bottleneck ([README](README.md)). The first
   generations can run `--device cpu` while the GPU is debugged; nothing
   downstream changes.
3. **Cloud CUDA rental (≤ $50 budget).** Any CUDA box (RunPod/Lambda; a 4090
   at ~$0.4–0.7/hr ⇒ 70–100 hrs of budget — far more than needed to prove
   learning). `rsync` the run dir (JSONL alone suffices; re-export shards
   there), then `uv sync --extra cu12 && uv run oel-train --run … --gen N`.
   Identical code path; checkpoints/ONNX rsync back. This is why
   [17](17-trainer-scaffold.md) keeps plain-PyTorch and per-index extras.

## Inputs

- The physical machine; `trainer/` from [17](17-trainer-scaffold.md);
  smoke-run shards for burn-in.

## Outputs

- A machine that passes `oel-check-gpu` and the GPU overfit test; this
  document updated with the actual versions, whether the override was
  needed, and anything that differed in practice.

## How it runs / verification

- `uv run oel-check-gpu` clean; `uv run pytest -k overfit` on GPU; one real
  training epoch with GPU utilization visible in `rocm-smi` and a clean
  `dmesg`.

## Design notes & tradeoffs

- **Bare-metal Ubuntu vs WSL2 vs dual-boot.** ROCm-on-WSL2 exists but
  supports a narrower GPU list (flagship consumer cards), adds a
  virtualization layer to an already-unofficial card, and Windows would
  keep taxing the machine. Dual-boot preserves Windows at the cost of every
  reboot being a context switch on a box meant to run unattended for weeks.
  The machine is being dedicated to this; bare metal removes the two least
  debuggable layers. The self-play workers are pure Node and portable, so
  nothing else cares about the OS choice.
- **ROCm version pinning vs tracking latest.** Latest point releases carry
  the RDNA3 fixes we may need (arguing for newness at *install* time), but
  a working driver + kernel + wheel triple on an unofficial card is
  precious and easy to silently break (arguing for freezing afterwards).
  Policy: install the newest 6.x at bring-up, then hold everything (step 8)
  and only move all three components together, deliberately, re-running
  steps 4–7 as the acceptance test.
- **The unofficial-card risk and its blast radius.** The worst realistic
  case — gfx1101 never runs reliably — is confined to the *train* stage:
  JSONL, shards, checkpoints, and ONNX are all device-agnostic, and the
  evaluator serves on CPU ([21](21-onnx-evaluator.md)). The fallback ladder
  turns "GPU doesn't work" into "training costs ≤ $50 or some CPU-minutes
  per generation", not a project risk. This containment is a direct payoff
  of the plain-PyTorch, no-custom-kernels decision in the
  [README](README.md)'s locked stack.

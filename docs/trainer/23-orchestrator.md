# 23 — Generation orchestrator

| | |
| --- | --- |
| Status | planned |
| Package | `agent/` |
| Depends on | [15](15-selfplay-workers.md), [16](16-shard-exporter.md), [19](19-training-loop.md), [20](20-onnx-export.md), [22](22-arena-gating.md) |
| Milestone | M6 |

## Goal

One command that runs generations unattended overnight: self-play → export →
train → export-onnx → gate → (promote) → next generation. Dies and resumes
cleanly.

## Design

`agent/src/cli/loop.ts`, wired as a `"loop"` script in `agent/package.json`
(alongside the existing `arena`/`selfplay` scripts, same
`node --import tsx/esm` invocation):

```sh
pnpm --dir agent loop --config runs/r1/config.json [--gens N]
```

Deliberately boring: a sequential driver that shells out (`child_process`)
to the stage commands. Each stage stays independently runnable and
debuggable; the orchestrator adds no logic beyond sequencing, verification,
and bookkeeping. `config.json` is the single source of truth (game cfg,
sims, curation, temperature, games/gen, window K, epochs, gate params,
workers); stage CLIs receive everything via `--run/--gen` plus explicit
flags derived from it.

### Stage state machine

Per generation, `gen-NNN/STATE` holds the *last completed* stage:

| STATE after | Stage command (spawned) | cwd | Done-condition verified before writing STATE |
| --- | --- | --- | --- |
| `selfplay` | `node --import tsx/esm src/cli/selfplay.ts --run <R> --gen N --games G --workers W [--net <best.onnx> --sims S]` | `agent/` | JSONL line count across `selfplay/worker-*.jsonl` ≥ G |
| `exported` | `node --import tsx/esm src/cli/export.ts --run <R> --gen N` | `agent/` | every shard dir has all 7 `.npy` + `meta.json`; decision totals match JSONL |
| `trained` | `uv run oel-train --run <R> --gen N --device auto --epochs E --window K` then `uv run oel-export-onnx --ckpt <R>/gen-NNN/ckpt/model.pt --out <R>/gen-NNN/model.onnx` | `trainer/` | `ckpt/model.pt`, `model.onnx`, `spec.json` all exist |
| `gated` | `node --import tsx/esm src/cli/gate.ts --run <R> --gen N` | `agent/` | `arena.json` exists |

Notes on the table:

- `<R>` is the **absolute** run-dir path — children run with different cwds
  (`agent/` vs `trainer/`), so relative paths are forbidden at this seam.
- `--net` is passed iff `<R>/best.json` exists (gen-0 and pre-first-promotion
  generations run the RolloutEvaluator, per [15](15-selfplay-workers.md)).
- ONNX export is folded into the `trained` transition rather than getting its
  own STATE value: it takes seconds, and "trained" meaning "ckpt **and**
  servable model exist" keeps the 4-state machine of the
  [README](README.md) layout intact.
- The gate is a thin CLI wrapper (`gate.ts`) over [22](22-arena-gating.md)'s
  procedure even though it lives in the same package — uniform
  spawn/kill/resume semantics for all four stages beat saving one process
  fork.

Children are spawned with `stdio: 'inherit'` behind a line-prefixer
(`[selfplay]`, `[train]`, …) so an overnight log reads chronologically, and
awaited to exit; a nonzero exit fails the stage.

### STATE file semantics

- Content: a single token (`selfplay | exported | trained | gated`) plus
  newline. Absent file = nothing completed for that generation.
- Written **only by the orchestrator**, only after the done-condition above
  is verified against real artifacts, via write-`STATE.tmp`-then-`rename`
  (atomic; a crash between stage completion and marker write just means the
  stage reruns, and every stage is idempotent/resumable by construction —
  see [15](15-selfplay-workers.md)/[16](16-shard-exporter.md)/[19](19-training-loop.md)).
  Keeping Python STATE-free means the marker logic exists in exactly one
  place.

### Resume-point selection

```
gen ← highest NNN with a gen-NNN/ dir (else 0)
state ← read gen-NNN/STATE (absent ⇒ "none")
if state == gated: gen ← gen + 1; state ← none
run stages after `state` in order, then loop into gen+1
```

Because "resume = rerun the same stage command" holds for every stage,
killing the loop anywhere — including mid-stage — loses at most partial
work inside one stage.

### Failure, retry, halt

- Stage exits nonzero → retry once after 30 s (clears transient
  OOM/filesystem hiccups); second failure halts the loop with a nonzero
  exit, STATE untouched, so `loop` is safe to rerun after a fix.
- **Halt conditions** (clean stop with a reason on stderr): 3 consecutive
  failed gates (read back from `loop-log.jsonl`) — the net has stalled and a
  human should look; free disk below a configured floor before starting
  self-play; `--gens N` reached; SIGINT/SIGTERM (forwarded to the child,
  then exit — the child's own resume story handles the rest).
- Non-promotion is **not** failure: keep the old champion, advance to the
  next generation (fresh data from the champion's self-play), record the
  streak.

### Bookkeeping

- **Shard pruning**: after gen N is gated, delete `shards/` for generations
  `< N − K + 1` (outside the training window — the window's shards must
  survive for the next `oel-train`). JSONL is never pruned; if a needed
  shard dir is missing at train time (pruned too eagerly, or an
  encoder-version bump invalidated it), the orchestrator re-runs export for
  that generation first — regeneration is the designed-in escape hatch of
  [16](16-shard-exporter.md).
- **`loop-log.jsonl`**: one line per generation, appended after gating:

```jsonc
{ "gen": 3, "startedAt": "…", "finishedAt": "…",
  "durations": { "selfplay": 25100, "export": 310, "train": 940, "onnx": 12, "gate": 5200 },  // seconds
  "games": 500, "decisions": 152340, "netId": "gen-003",
  "loss": { "first": 4.81, "final": 3.12 },
  "gate": { "games": 100, "winRate": 0.57, "eloDiff": 49, "promoted": true },
  "yardstick": { "games": 100, "winRate": 0.44, "eloDiff": -42 },
  "champion": "gen-003", "failedGateStreak": 0 }
```

## Inputs

- `runs/<id>/config.json`; the stage CLIs (`selfplay`, `export`,
  `uv run oel-train`, `uv run oel-export-onnx`, `gate`).

## Outputs

- Fully populated `gen-NNN/` directories, an updated `best.json`, and
  `loop-log.jsonl` — the run's audit trail.

## How it runs / verification

- Unit (`pnpm --dir agent test`): resume-point selection over synthetic run
  dirs (every STATE value × present/absent artifacts); done-condition checks;
  prune-set computation never touches the training window; STATE
  write-temp-rename.
- Integration: the smoke run ([24](24-smoke-e2e.md)) is this command with a
  tiny config.
- Manual: kill it at each stage boundary and mid-stage; rerun; verify no
  duplicated work (JSONL line counts, shard counts) and no corrupted
  markers.

## Design notes & tradeoffs

- **Shelling out vs in-process orchestration.** Three of five stage commands
  are Node and could be imported and called directly, saving process spawns.
  Shelling out wins anyway: crash isolation (a native-addon segfault in a
  worker kills one stage, not the week-long loop), memory isolation (train
  and selfplay never share a heap), identical invocations for "orchestrated"
  and "run by hand while debugging", and the Python stages need
  `child_process` regardless — one mechanism for five stages. The overhead
  (a process spawn per stage per generation, milliseconds against hours) is
  irrelevant.
- **Node orchestrator vs bash vs Make.** Make's DAG model looks tempting
  (STATE files are almost sentinel targets), but "count JSONL lines and
  compare to config" or "read a failed-gate streak from a log" is painful in
  Make, and bash grows unreadable exactly at the retry/verify/halt logic
  that is this project's whole content. TypeScript in `agent/` gets the
  existing test harness, typed config parsing shared with the stage CLIs,
  and one language for all Node-side code. The loop body stays under a few
  hundred lines either way.
- **STATE files vs sqlite/manifest.** A run database would give queryable
  history and transactional stage transitions, but introduces a schema, a
  dependency, and a second source of truth that can disagree with the
  filesystem. The filesystem *is* the state (artifacts + one marker file per
  gen + append-only log), inspectable with `ls` and `cat`, rsync-able to the
  GPU box or a rental with no migration step ([25](25-rocm-runbook.md)).
  `loop-log.jsonl` covers the "queryable history" need well enough for one
  machine and one run at a time.

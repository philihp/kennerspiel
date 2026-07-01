# 15 — Worker-pool self-play CLI

| | |
| --- | --- |
| Status | planned |
| Package | `agent/` |
| Depends on | [14](14-selfplay-v2.md) |
| Milestone | M4 |

## Goal

Saturate all CPU cores generating self-play games into a run directory, with
resume-by-default so an interrupted overnight job loses nothing.

## Design

`agent/src/cli/selfplay.ts` rewritten around run dirs (the v1 positional
form `pnpm --dir agent selfplay [games] [short|long] [sims]` keeps working
during transition):

```sh
pnpm --dir agent selfplay --run runs/r1 --gen 3 --games 500 --workers 12 \
  [--net runs/r1/best.onnx] [--sims 200]
```

Flags default from `runs/<id>/config.json`; CLI overrides win. Output goes
to `runs/<id>/gen-NNN/selfplay/worker-K.jsonl`.

### Worker mechanics

- `worker_threads`: main spawns `--workers` module workers via
  `new Worker(new URL('../selfplayWorker.ts', import.meta.url),
  { workerData: { workerIndex, runCfg }, execArgv: process.execArgv })`.
  The package runs everything through `node --import tsx/esm`
  (`agent/package.json` scripts), and workers inherit `execArgv`, so the
  tsx loader resolves the `.ts` worker file in dev; a compiled-JS deployment
  needs no change because the `URL` resolves relative to the emitted module.
- Each worker owns its own **evaluator instance** — `RolloutEvaluator` when
  `--net` is absent (gen-0 needs no new concepts) or `OnnxEvaluator` with a
  private `InferenceSession` per [21](21-onnx-evaluator.md) — plus its own
  scratch buffers. Nothing search-related is shared across threads.
- Each worker **appends to its own file**: one
  `appendFileSync(path, line + '\n')` per finished game, whole line in a
  single write. Game payloads never cross the thread boundary — only small
  status messages do.

### Seed-dispenser protocol (main ⇄ worker)

| Direction | Message | Meaning |
| --- | --- | --- |
| worker → main | `{ type: 'ready' }` | evaluator constructed, ask for work |
| main → worker | `{ type: 'game', gameIndex, seed }` | play & write one game |
| worker → main | `{ type: 'done', gameIndex, seed, steps, finished, ms }` | line appended; send next |
| worker → main | `{ type: 'error', gameIndex, seed, message }` | game abandoned (e.g. evaluator failure); nothing written; send next |
| main → worker | `{ type: 'stop' }` | drain and exit |

Seeds are `baseSeed + gameIndex` for `gameIndex ∈ [0, games)`, `baseSeed`
from config (default `gen * 1_000_000`). The *set* of games is therefore
fixed by the target count alone; the dispenser hands out the lowest
not-yet-done index on every `ready`/`done`, so assignment is
work-stealing while the corpus stays deterministic
([14](14-selfplay-v2.md) makes each game a pure function of its seed).

### Resume protocol

On start, scan `gen-NNN/selfplay/worker-*.jsonl`: parse each line's `seed`
(and `v`), building the completed-seed set. A truncated final line (crash
mid-append) is detected by JSON parse failure, logged, truncated off the
file, and its seed simply regenerated. The dispenser then skips completed
indices — rerunning the same command *is* the resume story, and finishing
early (count already met) is a no-op that just advances `STATE`.

### Failure & progress

- **Worker crash** (`exit` with nonzero code / `error` event): its in-flight
  `gameIndex` returns to the dispenser and a replacement worker is spawned;
  after 3 crashes total the run aborts nonzero (a systematic bug, not a
  blip). Repeated `{type:'error'}` games (say >1% of target) also abort.
- **Progress**: main aggregates `done` messages and prints one status line
  per N games — done/target, games/hr, avg steps, avg ms/move, ETA.
- When the target count is reached: workers get `stop`, main writes the
  `STATE` marker → `selfplay` (run layout in the [README](README.md)).

## Inputs

- `runs/<id>/config.json` (game cfg + search params), `--gen`, `--games`,
  `--workers`, optional `--net` ONNX path.

## Outputs

- `runs/<id>/gen-NNN/selfplay/worker-*.jsonl` (JSONL v2), and the `STATE`
  marker advanced to `selfplay` when the target count is reached.

## How it runs / verification

- `pnpm --dir agent test` — seed dispenser determinism (same target ⇒ same
  seed set regardless of worker count); resume counting incl. the
  truncated-final-line case; crash-requeue logic (unit-tested around the
  dispenser, no real threads needed).
- Manual: run with `--games 8 --workers 2`, kill mid-way, rerun, verify
  exactly 8 games across the files and no duplicate seeds.

## Design notes & tradeoffs

- **`worker_threads` vs child processes vs single-threaded async**: search
  is CPU-bound synchronous JS (engine `control()` calls dominate,
  [README](README.md) risk section), so single-threaded async parallelizes
  nothing — there is no I/O wait to overlap. Child processes would work
  (each V8 isolate is separate either way, so no JIT/heap sharing is lost),
  but threads spawn cheaper, keep one PID/one Ctrl-C, give typed
  `postMessage` instead of hand-rolled stdio framing, and leave
  `SharedArrayBuffer` open as a zero-copy option if Stage-2 batching ever
  wants to ship tensors to a coordinator. `onnxruntime-node` supports a
  session per thread, so [21](21-onnx-evaluator.md) fits unchanged.
- **Per-worker files vs a single writer**: a single writer means every
  ~100 KB game line is structured-clone-copied over `postMessage` to a
  main-thread bottleneck, and every crash risk concentrates in one file's
  tail. Per-worker append has zero contention, a blast radius of one
  file's final line, and costs only that the exporter globs
  `worker-*.jsonl` (which [16](16-shard-exporter.md) does anyway). Game
  order interleaves across files — irrelevant, training shuffles decisions.
- **Deterministic seed dispenser vs pure work-stealing throughput**: a
  static partition (worker k takes indices ≡ k mod m) is deterministic down
  to file placement but strands cores behind whichever worker draws the
  long games (game length varies ~2×). Pure work-stealing with
  "generate until count" would make the *seed set* depend on timing. The
  hybrid — fixed seed set, dynamic assignment — gets full utilization and a
  reproducible corpus; only which file a game lands in varies, and nothing
  downstream keys on that.
- **Resume by scanning JSONL vs a manifest**: a manifest (count/index file)
  is a second source of truth that can disagree with the data after a
  crash — whichever of (data line, manifest update) wasn't flushed wins,
  and both orders are wrong in one failure mode. The JSONL files *are* the
  ground truth; scanning a generation (≤ a few hundred MB) takes seconds at
  startup and cannot desync. If gens grow to many GB, add a per-file cache
  of `{size, mtime, seeds}` as a pure optimization over the same protocol —
  still no authority handed to a side file.

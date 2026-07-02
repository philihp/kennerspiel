# 26 — First real training run

| | |
| --- | --- |
| Status | planned |
| Package | ops (a run dir + observations) |
| Depends on | [24](24-smoke-e2e.md), [25](25-rocm-runbook.md) |
| Milestone | M7 |

## Goal

The AlphaZero "it works" moment: a promoted generation that beats pure UCT
at equal simulations — brought up on 2-player · long · France, then widened
to the full config matrix (1–4 players × short/long × both countries, solo
success = score > 500; see "Widening to the full config mix" below).

## Starting configuration

`runs/2p-long-france-v1/config.json`, in full (schema shared with
[24](24-smoke-e2e.md)'s smoke config):

```json
{
  "run": "2p-long-france-v1",
  "game": { "players": 2, "country": "france", "length": "long" },
  "selfplay": {
    "gamesPerGen": 500,
    "workers": 12,
    "sims": 200,
    "cPuct": 1.5,
    "dirichlet": { "epsilon": 0.25, "alphaScale": 10 },
    "temperature": { "tau": 1.0, "moves": 30 },
    "curation": { "maxPerLevel": 24, "maxMoves": 64 },
    "gen0": { "evaluator": "rollout", "sims": 400, "rolloutDepth": 60 },
    "baseSeed": 100000
  },
  "train": {
    "device": "auto",
    "window": 5,
    "epochs": 2,
    "batchSize": 256,
    "lr": 0.0002,
    "lrSchedule": "cosine",
    "weightDecay": 0.0001,
    "valueLossWeight": 1.0,
    "seed": 42
  },
  "gate": {
    "games": 100,
    "sims": 200,
    "threshold": 0.55,
    "enforce": true,
    "baseSeed": 900000,
    "yardstick": { "policy": "mcts:400", "games": 100 }
  }
}
```

Rationale for the non-obvious values: `dirichlet.alphaScale` 10 yields
α ≈ 10/⟨branching 18⟩ ≈ 0.55 per [13](13-puct-search.md); `gen0.sims` 400 because gen-0 data quality
sets the ceiling for gen-1 and is paid only once; `tempMoves` 30 covers the
settlement-and-early-building phase where opening diversity matters.

## Expected generation timeline

Derived from the [README](README.md) assumption of 1–3 s/move at 200 sims
(midpoint 2 s), ~300 decisions/game, 12 workers — **to be corrected by
[08](08-benchmarks.md) numbers before trusting any of it**:

| Stage | Assumption | Estimate (range) |
| --- | --- | --- |
| gen-0 self-play, 500 games @ 400-sim UCT | 2–4 s/move, 150k moves ÷ 12 | ~10 h (7–14 h) |
| gen-N self-play, 500 games @ 200 sims | 1–3 s/move, 150k moves ÷ 12 | ~7 h (3.5–10.5 h) |
| export | ~1–2 ms/decision × ~150k | ~5 min |
| train (window 5 ≈ 750k samples × 2 epochs, batch 256 ≈ 6k steps) | 10–30 ms/step GPU | ~5 min (CPU fallback: ~30–60 min) |
| ONNX export | — | < 1 min |
| gate 100 games + yardstick 100 games @ 200 sims, pooled | ~60k moves ÷ 12 | ~3 h (2–5 h) |
| **Total per generation** | | **~10–15 h ⇒ ~1 generation/day** |

So the week-one plan is: gen-0 overnight, then roughly one gated generation
per day. Five generations ≈ one week — which is why decision point B exists.

## Monitoring checklist and journal

Each morning, from `loop-log.jsonl` plus a 5-minute look:

- [ ] Loop still alive; no `failedGateStreak` growth; disk headroom OK.
- [ ] Gate result and yardstick win-rate vs `mcts:400` (the absolute ruler).
- [ ] `finishedRate` ≈ 1.0 and avg steps stable in self-play (a legality or
      resign-path bug shows here first).
- [ ] Train log: policy loss ↓ across generations; policy top-1 agreement
      with `chosen` ↑; value calibration buckets roughly monotone.
- [ ] Skim 2–3 games' command lists for obvious pathology (move loops,
      degenerate all-commit endings).

Journal (`runs/2p-long-france-v1/journal.md`), one entry per generation:

```markdown
## gen-003 — 2026-07-09
- durations: selfplay 6.8h · train 4m · gate+yardstick 3.1h
- gate: 61/100 vs gen-002 → PROMOTED   | yardstick: 44/100 vs mcts:400 (-42 Elo)
- losses: policy 3.41→3.12 · value 0.221→0.209 · top-1 agreement 38%
- eyeball: openings diversifying; still overvalues early Peat
- changes made: none
- next: watch value calibration bucket 0.7–0.9 (overconfident)
```

The "changes made" line is the discipline: one knob per generation, recorded.

## Decision points

**A. Gen-1 fails the sanity gate** (NN-PUCT at 200 sims loses to the pure
UCT champion). Diagnostic ladder, in order — do not tune hyperparameters
first:

1. Plumbing: golden-batch parity test still green ([21](21-onnx-evaluator.md))?
   `netId` in gen-1 JSONL actually `gen-000`?
2. Data: gen-0 `finishedRate`, outcome balance (≈50/50 by seat), decisions
   per game in the expected 250–350 band.
3. Learning: did the [19](19-training-loop.md) overfit test pass on *this*
   box? Is policy top-1 agreement meaningfully above chance (≳ 25% vs the
   ~5% of uniform-over-18)? If not, the net learned nothing — inspect
   shards, not the LR.
4. Only then tune: +2 epochs, or halve LR, retrain gen-1 from the same
   shards (cheap — no new self-play needed) and re-gate.
5. If two retrains fail: generate 500 more gen-0 games (data volume is the
   most likely ceiling) before touching architecture.

**B. Throughput too low** (< ~300 games/day sustained, i.e. > ~36 h/gen):
pull the README levers in order — verify `completions()` fast path is
actually engaged ([07](07-engine-fast-paths.md)), lower curation caps
(`maxMoves` 64 → 48), then a sims schedule (e.g. 200 → 120 after move 60,
where branching collapses), then Stage-2 in-worker batching
([12](12-evaluator-interface.md)). Only after all four: consider fewer
games/gen (see tradeoffs). Never silently drop `gate.games`.

**C. Value loss plateaus** while policy loss still falls: expected, not
alarming — value MSE bottoms out at the outcome variance of near-even
positions. Check *calibration* (predicted-vs-actual by bucket) instead of
raw MSE. Act only if calibration is bad or gates stall alongside it:
widen `window` to 7–8 first (more diverse outcomes), then consider net
scale (below). If *policy* loss plateaus **and** gates stall for 3+
generations (the [23](23-orchestrator.md) halt), that is the real "look at
everything" signal.

## Widening to the full config mix

The bring-up run above is deliberately single-config (2p·long·France — one
bucket, one yardstick, fewest moving parts while pipeline bugs are still
live). The target state is **all 16 configs** (1–4 players × short/long ×
Ireland/France) served by the one config-conditioned net; the encoder
already carries players/length/country one-hots, so this is a config change,
not a code change. As soon as criteria 1–2 below hold on the bring-up run,
start `runs/all-configs-v1` by widening `game` to a weighted mix, e.g.:

```jsonc
"game": { "mix": [
  { "cfg": { "players": 2, "country": "france",  "length": "long"  }, "weight": 4 },
  { "cfg": { "players": 2, "country": "ireland", "length": "long"  }, "weight": 2 },
  { "cfg": { "players": 1, "country": "france",  "length": "long"  }, "weight": 2 },
  { "cfg": { "players": 3, "country": "france",  "length": "long"  }, "weight": 2 },
  { "cfg": { "players": 4, "country": "france",  "length": "long"  }, "weight": 2 },
  { "cfg": { "players": 2, "country": "france",  "length": "short" }, "weight": 2 }
  // …remaining combinations at weight 1
]},
"gate": { "panel": [
  { "bucket": "2p-long-france",  "games": 100 },
  { "bucket": "4p-short-ireland","games": 60 },
  { "bucket": "1p-long-france",  "games": 50 }   // paired-seed, score>500 rate
], "threshold": 0.55, "bucketFloor": 0.45 }
```

Self-play assigns each game's cfg by deterministic weighted round-robin over
the mix ([15](15-selfplay-workers.md)); JSONL/shards are config-heterogeneous
by design (every game line carries its `cfg`, every state row carries the
config one-hots). **Solo success = final score > 500**: search and training
use the `σ((score−500)/100)` value mapping from [09](09-game-adapter.md),
and the journal tracks the solo bucket's score>500 rate alongside per-bucket
gate results ([22](22-arena-gating.md)). Warm-start the all-configs run from
the bring-up run's best checkpoint — the config planes were constant during
bring-up, so the net treats new configs as unfamiliar inputs, not
contradictory ones; expect a few generations before the 3–4p and solo
buckets catch up.

## Success criteria

1. Gen-1 net's PUCT ≥ pure UCT at equal sims (sanity: the net learned
   *something* from gen-0 data).
2. Within a handful of generations, a promoted net **beats `mcts:400`
   decisively at 200 sims** — search doing less work and winning more.
3. The loop survives a week unattended (crashes resume, gates ratchet).

## Inputs

- Everything: the full pipeline ([23](23-orchestrator.md),
  [24](24-smoke-e2e.md)) on the ROCm box ([25](25-rocm-runbook.md)).

## Outputs

- `runs/2p-long-france-v1/` with a promoted `best.json` — the first policy
  artifact eligible for real-time play against humans (deployment is a
  follow-on project, see [README](README.md) "Later").
- Corrected timing table above, journal, and benchmark numbers feeding the
  next planning round.

## How it runs / verification

```sh
pnpm --dir agent loop --config runs/2p-long-france-v1/config.json
pnpm --dir agent arena 100 long nn:best@runs/2p-long-france-v1:200 mcts:400
```

## Design notes & tradeoffs

- **500 games/gen vs more.** More games per generation means better policy
  targets and less overfitting per net, but at ~1 gen/day, 2,000 games/gen
  would mean one *feedback cycle* every 4 days — and early on, feedback
  cycles (finding pipeline and data bugs) are worth more than data quality.
  500 games × window 5 still trains each net on ~2,500 games. Scale
  games/gen up only after the loop is demonstrably learning (criteria 1–2)
  and throughput levers are exhausted.
- **200 sims vs 400 for NN self-play.** Halving sims halves generation time;
  AlphaZero-style training tolerates it because the net supplies prior
  quality that raw UCT lacks — 200 NN-guided sims should quickly exceed 400
  blind ones (that is literally success criterion 2). Gen-0 gets 400 because
  there is no net to compensate, and it is a one-time cost. If gen-1 gating
  is marginal, raising gen-1's sims is the *last* lever, not the first —
  data volume and training fixes come cheaper.
- **Window 5.** Window 1 forgets too fast at 500 games (each net sees only
  its predecessor's biases); a very long window trains on stale, weaker
  play. K=5 ≈ 2,500 games ≈ 750k decisions is enough for a 2M-param net
  without letting gen-1 data haunt gen-9. Widen toward 7–8 if value
  calibration is poor (decision C); shrink toward 3 if the yardstick curve
  shows the net dragging old mistakes forward after big jumps.
- **When to scale the net.** Signals that ~2M params is the binding
  constraint, all of which must hold: training loss floors *above* the
  overfit-test regime (underfitting, not data noise), policy top-1
  agreement saturated across 2–3 generations, gates stalling, and the
  throughput budget shows headroom (a bigger net raises the 0.2–1 ms/eval
  in [21](21-onnx-evaluator.md), where the math says ~4× params is
  absorbable while engine-bound). Scale depth before width, re-run the
  overfit and parity tests, and note that a net change invalidates nothing
  durable — JSONL survives, shards re-export, and `best.json` keeps
  gating the new architecture against the old champion honestly.

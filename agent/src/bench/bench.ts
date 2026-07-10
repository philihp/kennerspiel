// Micro-benchmark harness: time the engine/search hot-path ops over a fixed
// corpus of real mid-game states and report percentiles. Deliberately small and
// honest (docs/trainer/08-benchmarks.md) — a warmup pass, fixed rep counts, a
// checksum to defeat dead-code elimination, and percentile aggregation across
// states (the enumeration cost is heavy-tailed, so a mean would hide the p99
// states that actually stall self-play workers).

import type { GameState } from 'hathora-et-labora-game'
import { control, completions, scores, encode, encodeInto, FEATURE_LEN } from 'hathora-et-labora-game'
import { enumerateMoves, sampleMove } from '../moves'
import { mulberry32 } from '../rng'
import type { Corpus } from './corpus'

// The search's per-node enumeration caps (DEFAULTS in mcts/search.ts).
const CURATION = { maxPerLevel: 24, maxMoves: 128 }

export type Stat = {
  name: string
  unit: 'ms' | 'count'
  p50: number
  p90: number
  p99: number
  max: number
  mean: number
  n: number
}

const quantile = (sorted: number[], q: number): number => {
  if (sorted.length === 0) return 0
  return sorted[Math.min(sorted.length - 1, Math.floor(q * sorted.length))]!
}

const summarize = (name: string, unit: Stat['unit'], xs: number[]): Stat => {
  const sorted = xs.slice().sort((a, b) => a - b)
  return {
    name,
    unit,
    p50: quantile(sorted, 0.5),
    p90: quantile(sorted, 0.9),
    p99: quantile(sorted, 0.99),
    max: sorted[sorted.length - 1] ?? 0,
    mean: xs.reduce((a, b) => a + b, 0) / (xs.length || 1),
    n: xs.length,
  }
}

// One timed op. `run` returns a number folded into an accumulator so the JIT
// can't elide the work; `reps` is picked per op so one per-state timing sample
// clears timer noise.
//
// `det` marks ops whose result is a pure function of the state, independent of
// process history — those feed the reproducibility `checksum` the tests assert.
// `enumerateMoves` (and `sampleMove`, which falls back to it) drill the whole
// completion tree, and the engine's completion enumeration carries module-level
// mutable state whose effect on deep partials depends on prior reducer calls in
// the process (a latent engine quirk, orthogonal to project 07 — `completions`
// is byte-identical to `control().completion`). Their results are still timed
// and folded into `sink` (DCE defeat), but are not part of the asserted
// checksum, because they are not reproducible across separate corpus builds.
type Op = {
  name: string
  reps: number
  det: boolean
  run: (state: GameState, i: number, scratch: Float32Array) => number
}

const OPS: Op[] = [
  { name: 'control(state, [])', reps: 20, det: true, run: (s) => (control(s, []).completion ?? []).length },
  { name: 'completions(state, [])', reps: 20, det: true, run: (s) => completions(s, []).length },
  { name: 'control(state, []).score', reps: 20, det: true, run: (s) => control(s, []).score.length },
  { name: 'scores(state)', reps: 20, det: true, run: (s) => scores(s).length },
  { name: 'enumerateMoves (capped 24/128)', reps: 4, det: false, run: (s) => enumerateMoves(s, CURATION).length },
  { name: 'enumerateMoves (uncapped)', reps: 1, det: false, run: (s) => enumerateMoves(s).length },
  { name: 'sampleMove', reps: 6, det: false, run: (s, i) => sampleMove(s, mulberry32(i + 1))?.length ?? 0 },
  { name: 'encode', reps: 6, det: true, run: (s) => encode(s)[0]! },
  {
    name: 'encodeInto (reused scratch)',
    reps: 6,
    det: true,
    run: (s, _i, scratch) => {
      encodeInto(s, undefined, scratch)
      return scratch[0]!
    },
  },
]

export type BenchReport = {
  corpus: { size: number; totalStates: number; seed: number; sources: string[] }
  reducerApplyMs: Stat
  ops: Stat[]
  branching: Stat // uncapped enumerateMoves().length distribution (counts, not ms)
  checksum: number // sum over the `det` ops — reproducible for a given corpus
  sink: number // sum over the non-`det` ops — DCE defeat only, not reproducible
}

export const runBench = (corpus: Corpus): BenchReport => {
  const states = corpus.states
  const scratch = new Float32Array(FEATURE_LEN)
  let checksum = 0
  let sink = 0
  const fold = (op: Op, v: number): void => {
    if (op.det) checksum += v
    else sink += v
  }

  // Warmup: exercise every op once over the whole corpus before timing.
  for (const op of OPS) for (let i = 0; i < states.length; i++) fold(op, op.run(states[i]!, i, scratch))

  // Timed: per state run `reps` times, record ms for a single op (total / reps).
  const ops = OPS.map((op) => {
    const perStateMs: number[] = []
    for (let i = 0; i < states.length; i++) {
      const s = states[i]!
      const t0 = process.hrtime.bigint()
      for (let r = 0; r < op.reps; r++) fold(op, op.run(s, i, scratch))
      const t1 = process.hrtime.bigint()
      perStateMs.push(Number(t1 - t0) / op.reps / 1e6)
    }
    return summarize(op.name, 'ms', perStateMs)
  })

  const branching = summarize(
    'branching (raw, pre-dedupe)',
    'count',
    states.map((s) => enumerateMoves(s).length)
  )
  const reducerApplyMs = summarize(
    'reducer apply (per command)',
    'ms',
    corpus.applyNs.map((ns) => ns / 1e6)
  )

  return {
    corpus: { size: states.length, totalStates: corpus.totalStates, seed: corpus.seed, sources: corpus.sources },
    reducerApplyMs,
    ops,
    branching,
    checksum,
    sink,
  }
}

const fmt = (x: number, unit: Stat['unit']): string => (unit === 'count' ? String(Math.round(x)) : x.toFixed(4))

export const formatMarkdown = (r: BenchReport): string => {
  const rows: Stat[] = [r.reducerApplyMs, ...r.ops, r.branching]
  return [
    `Corpus: ${r.corpus.size} states (sampled from ${r.corpus.totalStates}), seed ${r.corpus.seed}`,
    `Sources: ${r.corpus.sources.join(', ')}`,
    '',
    '| Op | unit | p50 | p90 | p99 | max | mean | n |',
    '| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |',
    ...rows.map(
      (s) =>
        `| ${s.name} | ${s.unit} | ${fmt(s.p50, s.unit)} | ${fmt(s.p90, s.unit)} | ${fmt(s.p99, s.unit)} | ${fmt(s.max, s.unit)} | ${fmt(s.mean, s.unit)} | ${s.n} |`
    ),
    '',
    `checksum: ${r.checksum} (deterministic ops; identical across runs for a given corpus seed)`,
  ].join('\n')
}

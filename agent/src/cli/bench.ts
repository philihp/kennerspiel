// Benchmark the engine/search hot-path ops over a corpus of real mid-game
// states. See docs/trainer/08-benchmarks.md.
//
//   pnpm --dir agent bench                       # default: markdown table
//   pnpm --dir agent bench --size 1000 --seed 7  # bigger corpus, other seed
//   pnpm --dir agent bench --games run.jsonl     # add self-play states
//   pnpm --dir agent bench --json > bench.json   # machine-readable
//
// The corpus is deterministic given --seed, so the printed checksum is
// identical across runs (proves the ops weren't optimized away).

import { buildCorpus } from '../bench/corpus'
import { runBench, formatMarkdown } from '../bench/bench'

const argv = process.argv.slice(2)
const hasFlag = (name: string): boolean => argv.includes(name)
const getOpt = (name: string): string | undefined => {
  const i = argv.indexOf(name)
  return i >= 0 ? argv[i + 1] : undefined
}

const size = Number.parseInt(getOpt('--size') ?? '500', 10)
const seed = Number.parseInt(getOpt('--seed') ?? '12345', 10)
const gamesPath = getOpt('--games')
const json = hasFlag('--json')

const corpus = await buildCorpus({ size, seed, gamesPath })
const report = runBench(corpus)
console.log(json ? JSON.stringify(report, null, 2) : formatMarkdown(report))

// Benchmark state corpus: realistic mid-game states to time engine/search ops
// against. Three sources, merged (docs/trainer/08-benchmarks.md):
//   - fixture replay: real finished games lifted from game/src/__tests__/
//     into ./fixtures/*.json (arrays of space-joined command strings)
//   - seeded generated games: a few deterministic policy games (zero
//     maintenance, always available)
//   - self-play JSONL (--games <path>): each line a SelfPlayGame with a
//     `commands` field — the most representative corpus, preferred when present
//
// Replaying each command list and collecting every intermediate PLAYING state
// yields hundreds of states per game; we seed-shuffle and slice to a fixed size
// so runtimes stay constant across runs.

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import type { GameState } from 'hathora-et-labora-game'
import { apply, initialState, isPlaying } from '../engine'
import type { Move } from '../engine'
import { playGame, type GameConfig } from '../arena'
import { oel } from '../game/oel'
import type { Policy } from '../policy'
import { greedyPolicy } from '../policies/greedy'
import { randomPolicy } from '../policies/random'
import { mulberry32, type Rng } from '../rng'

const HERE = dirname(fileURLToPath(import.meta.url))

const loadFixture = (file: string): Move[] =>
  (JSON.parse(readFileSync(join(HERE, 'fixtures', file), 'utf8')) as string[]).map((line) => line.split(' '))

// Replay a command list, returning every intermediate PLAYING state and the
// per-command reducer-apply time in nanoseconds (SETUP/terminal states are not
// search states, so they are timed but not collected).
type ReplayResult = { states: GameState[]; applyNs: number[] }
const replayCollect = (commands: Move[]): ReplayResult => {
  const states: GameState[] = []
  const applyNs: number[] = []
  let state: GameState = initialState
  for (const cmd of commands) {
    const t0 = process.hrtime.bigint()
    const next = apply(state, cmd)
    const t1 = process.hrtime.bigint()
    applyNs.push(Number(t1 - t0))
    if (next === undefined) break // fixture drifted from engine; stop this game
    state = next
    if (isPlaying(state)) states.push(state)
  }
  return { states, applyNs }
}

// A handful of deterministic policy games across player counts, so the corpus
// isn't only the two hand-authored fixtures. Random games are cheap and finish;
// one greedy game adds enumeration-heavy late states.
const generatedGames = async (): Promise<{ name: string; commands: Move[] }[]> => {
  const specs: { name: string; cfg: GameConfig; seed: number; policies: Policy<GameState, Move>[] }[] = [
    { name: 'gen:2p-random', cfg: cfg(2), seed: 101, policies: [randomPolicy(oel), randomPolicy(oel)] },
    { name: 'gen:3p-random', cfg: cfg(3), seed: 202, policies: [randomPolicy(oel), randomPolicy(oel), randomPolicy(oel)] },
    { name: 'gen:2p-greedy', cfg: cfg(2), seed: 303, policies: [greedyPolicy(oel), randomPolicy(oel)] },
  ]
  // Sequential (not Promise.all): deterministic order for a stable corpus.
  const out: { name: string; commands: Move[] }[] = []
  for (const { name, cfg: gcfg, seed, policies } of specs) {
    const { commands } = await playGame(oel, policies, gcfg, seed, mulberry32(seed * 7919 + 1))
    out.push({ name, commands })
  }
  return out
}

const COLORS = ['R', 'G', 'B', 'W']
const cfg = (players: number): GameConfig => ({
  players,
  country: 'france',
  length: 'long',
  colors: COLORS.slice(0, players),
})

// Self-play JSONL: one SelfPlayGame per line (agent/src/selfplay.ts); we only
// need its `commands` to replay.
const loadJsonl = (path: string): { name: string; commands: Move[] }[] =>
  readFileSync(path, 'utf8')
    .split('\n')
    .filter((line) => line.trim() !== '')
    .map((line, i) => ({ name: `jsonl:${i}`, commands: (JSON.parse(line) as { commands: Move[] }).commands }))

// Fisher–Yates with a seeded PRNG — deterministic given the seed.
const seededShuffle = <T>(xs: readonly T[], rng: Rng): T[] => {
  const out = xs.slice()
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[out[i], out[j]] = [out[j]!, out[i]!]
  }
  return out
}

export type Corpus = {
  states: GameState[] // sampled, seed-shuffled
  applyNs: number[] // per-command reducer-apply times across all games
  totalStates: number // before sampling
  seed: number
  sources: string[]
}

export const buildCorpus = async (opts: { size: number; seed: number; gamesPath?: string }): Promise<Corpus> => {
  const games: { name: string; commands: Move[] }[] = [
    { name: 'fixture:4aedf9e5-3p', commands: loadFixture('game4aedf9e5-3p.json') },
    { name: 'fixture:21872-4p', commands: loadFixture('game21872-4p.json') },
    ...(await generatedGames()),
    ...(opts.gamesPath ? loadJsonl(opts.gamesPath) : []),
  ]

  const allStates: GameState[] = []
  const applyNs: number[] = []
  for (const g of games) {
    const { states, applyNs: ns } = replayCollect(g.commands)
    allStates.push(...states)
    applyNs.push(...ns)
  }

  const shuffled = seededShuffle(allStates, mulberry32(opts.seed))
  return {
    states: shuffled.slice(0, opts.size),
    applyNs,
    totalStates: allStates.length,
    seed: opts.seed,
    sources: games.map((g) => g.name),
  }
}

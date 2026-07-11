// Tiny seeded PRNG for reproducible self-play, rollouts, and arena scheduling.
// Deterministic given a seed — same seed, same games.
//
// Uses the pcg library's PCG32 generator (the same family the game engine's
// START shuffle uses). pcg's API is immutable (state-threading); we wrap it in
// the mutable `() => number` closure this codebase expects — `getOutput` reads
// the current output, `nextState` advances. The stream id is fixed, so the seed
// alone selects the sequence (its starting point within the one periodic series).

import { createPcg32, getOutput, nextState } from 'pcg'

export type Rng = () => number // returns a float in [0, 1)

const UINT32 = 0x1_0000_0000 // 2^32
// Fixed stream id — distinct seeds give distinct sequences within this series.
const STREAM_ID = 0xda3e39cb

export const pcg32 = (seed: number): Rng => {
  let state = createPcg32({}, seed, STREAM_ID)
  return () => {
    const value = getOutput(state)
    state = nextState(state)
    return value / UINT32
  }
}

export const randInt = (rng: Rng, n: number): number => Math.floor(rng() * n)

export const choice = <T>(rng: Rng, xs: readonly T[]): T => xs[randInt(rng, xs.length)]!

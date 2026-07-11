// Tiny seeded PRNG (mulberry32) for reproducible self-play, rollouts, and
// arena scheduling. Deterministic given a seed — same seed, same games.
//
// Delegates to the `pcg` library's mulberry32 (the same generator the game
// engine's START shuffle uses) rather than hand-rolling the algorithm. `pcg`'s
// API is immutable (state-threading); we wrap it in the mutable `() => number`
// closure this codebase expects. `getOutput` then `nextState` reproduces the
// canonical mulberry32 sequence bit-for-bit (verified against the previous
// hand-rolled implementation), so seeded behavior is unchanged.

import { createMulberry32, getOutput, nextState } from 'pcg'

export type Rng = () => number // returns a float in [0, 1)

const UINT32 = 0x1_0000_0000 // 2^32

export const mulberry32 = (seed: number): Rng => {
  let state = createMulberry32(seed)
  return () => {
    const value = getOutput(state)
    state = nextState(state)
    return value / UINT32
  }
}

export const randInt = (rng: Rng, n: number): number => Math.floor(rng() * n)

export const choice = <T>(rng: Rng, xs: readonly T[]): T => xs[randInt(rng, xs.length)]!

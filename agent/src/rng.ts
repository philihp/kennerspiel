// Tiny seeded PRNG (mulberry32) for reproducible self-play, rollouts, and
// arena scheduling. Deterministic given a seed — same seed, same games.

export type Rng = () => number // returns a float in [0, 1)

export const mulberry32 = (seed: number): Rng => {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export const randInt = (rng: Rng, n: number): number => Math.floor(rng() * n)

export const choice = <T>(rng: Rng, xs: readonly T[]): T => xs[randInt(rng, xs.length)]!

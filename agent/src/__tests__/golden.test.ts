import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { playGame, CONFIG_2P_SHORT } from '../arena'
import { selfPlayGame } from '../selfplay'
import { oel } from '../game/oel'
import { randomPolicy } from '../policies/random'
import { pcg32 } from '../rng'

// Golden regression: seeded games are fully deterministic. These djb2 hashes of
// the command lists are pinned so any accidental change to the rng (pcg32),
// move ordering, or the game loop is caught. Captured in isolation but verified
// stable under heavy prior apply/enumerate work, so shared-runner test order
// does not perturb them.
const djb2 = (s: string): number => {
  let h = 5381
  for (let i = 0; i < s.length; i++) h = ((h * 33) ^ s.charCodeAt(i)) >>> 0
  return h
}
const rng = (seed: number) => pcg32(seed * 7919 + 1)
const randoms = () => [randomPolicy(oel), randomPolicy(oel)]

describe('golden: seeded games are deterministic (pcg32 rng)', () => {
  it('random-vs-random 2p short games (seeds 1, 2)', async () => {
    const g1 = await playGame(oel, randoms(), CONFIG_2P_SHORT, 1, rng(1))
    assert.equal(g1.commands.length, 644)
    assert.equal(djb2(JSON.stringify(g1.commands)), 1889008079)

    const g2 = await playGame(oel, randoms(), CONFIG_2P_SHORT, 2, rng(2))
    assert.equal(g2.commands.length, 613)
    assert.equal(djb2(JSON.stringify(g2.commands)), 3891132861)
  })

  it('a bounded self-play game (seed 3, sims 8, 20 steps)', async () => {
    const sp = await selfPlayGame(oel, CONFIG_2P_SHORT, 3, rng(3), { sims: 8 }, 20)
    assert.equal(sp.commands.length, 22)
    assert.equal(sp.decisions.length, 20)
    assert.equal(sp.steps, 20)
    assert.equal(sp.finished, false)
    assert.deepEqual(sp.outcome, [0.5, 0.5])
    assert.equal(djb2(JSON.stringify(sp.commands)), 458606814)
  })
})

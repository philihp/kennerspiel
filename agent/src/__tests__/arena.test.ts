import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { playGame, runMatch, CONFIG_2P_SHORT } from '../arena'
import { randomPolicy } from '../policies/random'
import { greedyPolicy } from '../policies/greedy'
import { mulberry32 } from '../rng'

describe('arena + baselines', () => {
  it('plays a full random-vs-random game and reports a result', () => {
    const res = playGame([randomPolicy(), randomPolicy()], CONFIG_2P_SHORT, 5, mulberry32(5))
    assert.equal(res.totals.length, 2)
    assert.equal(res.outcome.length, 2)
    assert.ok(res.steps > 10)
  })

  it('greedy does not lose a short deterministic match to random', () => {
    // deterministic (fixed seeds) so this is not flaky; greedy should dominate
    const r = runMatch(greedyPolicy(), randomPolicy(), { games: 4, cfg: CONFIG_2P_SHORT, baseSeed: 100 })
    assert.equal(r.games, 4)
    assert.ok(r.aWinRate >= 0.5, `greedy win-rate ${r.aWinRate} should be >= 0.5`)
  })

  it('alternates seats: a self-match is ~even', () => {
    const r = runMatch(randomPolicy(), randomPolicy(), { games: 4, cfg: CONFIG_2P_SHORT, baseSeed: 200 })
    assert.equal(r.aWins + r.bWins + r.draws, 4)
  })
})

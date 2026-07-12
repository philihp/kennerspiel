import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { replay, apply } from '../engine'
import type { Move } from '../engine'
import { search } from '../mcts/search'
import { mctsPolicy } from '../policies/mcts'
import { oel } from '../game/oel'
import { pcg32 } from '../rng'

const OPENING: Move[] = [
  ['CONFIG', '2', 'france', 'long'],
  ['START', '42', 'R', 'G'],
]

describe('mcts', () => {
  it('search returns a legal best move and a visit distribution', () => {
    const s = replay(OPENING)!
    const r = search(oel, s, pcg32(1), { sims: 24, rolloutDepth: 10 })
    assert.ok(r.best)
    assert.notEqual(apply(s, r.best!), undefined)
    const totalVisits = r.visits.reduce((a, v) => a + v.n, 0)
    assert.ok(totalVisits > 0 && totalVisits <= 24)
    r.visits.forEach((v) => assert.ok(v.q >= 0 && v.q <= 1))
  })

  it('is deterministic for a fixed seed', () => {
    const s = replay(OPENING)!
    const a = search(oel, s, pcg32(9), { sims: 24, rolloutDepth: 10 }).best
    const b = search(oel, s, pcg32(9), { sims: 24, rolloutDepth: 10 }).best
    assert.deepEqual(a, b)
  })

  it('is bit-identical with no budget set (and reports sims run)', () => {
    const s = replay(OPENING)!
    const a = search(oel, s, pcg32(9), { sims: 24, rolloutDepth: 10 })
    const b = search(oel, s, pcg32(9), { sims: 24, rolloutDepth: 10, budgetMs: undefined, minSims: undefined })
    assert.deepEqual(a.visits, b.visits)
    assert.equal(a.sims, 24)
    assert.equal(b.sims, 24)
  })

  it('budgetMs stops the loop early; minSims floor holds', () => {
    const s = replay(OPENING)!
    // an already-expired budget: only the minSims floor keeps it going
    const r = search(oel, s, pcg32(9), { sims: 10_000, rolloutDepth: 10, budgetMs: 0, minSims: 5 })
    assert.equal(r.sims, 5)
    assert.ok(r.best)
    assert.notEqual(apply(s, r.best!), undefined)
    const totalVisits = r.visits.reduce((a, v) => a + v.n, 0)
    assert.equal(totalVisits, 5)
  })

  it('a generous budget changes nothing', () => {
    const s = replay(OPENING)!
    const a = search(oel, s, pcg32(4), { sims: 16, rolloutDepth: 8 })
    const b = search(oel, s, pcg32(4), { sims: 16, rolloutDepth: 8, budgetMs: 60_000, minSims: 1 })
    assert.deepEqual(a.visits, b.visits)
    assert.equal(b.sims, 16)
  })

  it('mctsPolicy returns a legal move', async () => {
    const s = replay(OPENING)!
    const m = await mctsPolicy(oel, { sims: 16, rolloutDepth: 8 }).pick(s, pcg32(2))
    assert.ok(m)
    assert.notEqual(apply(s, m!), undefined)
  })
})

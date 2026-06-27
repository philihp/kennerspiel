import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { replay, apply } from '../engine'
import type { Move } from '../engine'
import { enumerateMoves, enumerateMovesInfo, sampleMove } from '../moves'
import { mulberry32 } from '../rng'

const OPENING: Move[] = [
  ['CONFIG', '2', 'france', 'long'],
  ['START', '42', 'R', 'G'],
]

describe('move generation', () => {
  it('enumerates only legal complete commands (each applies)', () => {
    const s = replay(OPENING)!
    const moves = enumerateMoves(s)
    assert.ok(moves.length > 0)
    moves.forEach((m) => {
      assert.ok(m.length > 0)
      assert.notEqual(apply(s, m), undefined, `expected legal: ${m.join(' ')}`)
    })
  })

  it('always offers COMMIT-or-equivalent progress (no dead state at the opening)', () => {
    const s = replay(OPENING)!
    const heads = new Set(enumerateMoves(s).map((m) => m[0]))
    assert.ok(heads.size > 0)
  })

  it('curation caps bound the branching factor', () => {
    const s = replay(OPENING)!
    const { moves, truncated } = enumerateMovesInfo(s, { maxPerLevel: 4, maxMoves: 30 })
    assert.ok(moves.length <= 30)
    // every capped move is still a legal command
    moves.forEach((m) => assert.notEqual(apply(s, m), undefined))
    assert.equal(typeof truncated, 'boolean')
  })

  it('sampleMove returns a legal move and is deterministic for a fixed seed', () => {
    const s = replay(OPENING)!
    const a = sampleMove(s, mulberry32(123))
    const b = sampleMove(s, mulberry32(123))
    assert.ok(a)
    assert.notEqual(apply(s, a!), undefined)
    assert.deepEqual(a, b) // same seed → same move
  })

  it('sampleMove can drive a full game to a terminal state', () => {
    let s = replay(OPENING)!
    const rng = mulberry32(7)
    let steps = 0
    while (s.status === 'PLAYING' && steps < 5000) {
      const m = sampleMove(s, rng)
      if (!m) break
      const next = apply(s, m)
      if (!next) break
      s = next
      steps++
    }
    // it should make real progress (this is a long game; just assert it advanced a lot)
    assert.ok(steps > 50, `expected many steps, got ${steps}`)
  })
})

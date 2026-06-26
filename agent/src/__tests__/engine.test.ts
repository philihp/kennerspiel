import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { apply, replay, isTerminal, isPlaying, playerToMove, numPlayers, scores, outcome, initialState } from '../engine'
import type { Move } from '../engine'

const OPENING: Move[] = [
  ['CONFIG', '2', 'france', 'long'],
  ['START', '42', 'R', 'G'],
]

describe('engine adapter', () => {
  it('applies a command and returns the next state', () => {
    const s = apply(initialState, ['CONFIG', '2', 'france', 'long'])
    assert.ok(s)
    assert.equal(s!.status, 'SETUP')
  })

  it('returns undefined for an illegal/unparseable command instead of throwing', () => {
    const s = replay(OPENING)!
    assert.equal(apply(s, ['NONSENSE', 'xyz']), undefined)
  })

  it('replays an opening into a PLAYING state with 2 players', () => {
    const s = replay(OPENING)!
    assert.ok(isPlaying(s))
    assert.ok(!isTerminal(s))
    assert.equal(numPlayers(s), 2)
    assert.equal(s.players!.length, 2)
  })

  it('playerToMove is the active player index', () => {
    const s = replay(OPENING)!
    assert.equal(playerToMove(s), s.frame!.activePlayerIndex)
  })

  it('scores returns one breakdown per (non-neutral) player with a numeric total', () => {
    const s = replay(OPENING)!
    const sc = scores(s)
    assert.equal(sc.length, 2)
    for (const p of sc) assert.equal(typeof p.total, 'number')
  })

  it('outcome is a per-player value vector summing to ~ (n-1)/... rank semantics', () => {
    // construct a fake terminal-ish comparison via scores math: just check shape + bounds
    const s = replay(OPENING)!
    const o = outcome(s)
    assert.equal(o.length, 2)
    for (const v of o) assert.ok(v >= 0 && v <= 1)
    // 2-player zero-sum-ish: the two values sum to 1 (win+loss) or 1 (0.5+0.5 tie)
    assert.equal(o[0]! + o[1]!, 1)
  })
})

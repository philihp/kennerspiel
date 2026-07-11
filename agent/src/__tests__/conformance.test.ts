import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { checkConformance } from '../game/conformance'
import { oel, CONFIG_2P_SHORT, CONFIG_2P_LONG } from '../game/oel'
import type { GameConfig } from '../game/oel'
import { mulberry32 } from '../rng'

const CONFIG_SOLO: GameConfig = { players: 1, country: 'france', length: 'short', colors: ['R'] }

// strictMoveKeys stays off for OeL until project 10 lands: raw enumeration
// still emits joined "col row" coordinate tokens (docs/trainer/
// 10-move-canonicalization.md). Flip it on in the same PR that adds
// canonicalize — it is the acceptance check for exactly that change.
const OEL_STRICT = { strictMoveKeys: false }

describe('oel adapter conformance (docs/trainer/28 gate 1)', () => {
  it('2p short: every contract holds over seeded random walks', () => {
    const violations = checkConformance(oel, CONFIG_2P_SHORT, {
      seeds: [11, 22],
      rng: mulberry32,
      maxSteps: 30,
      ...OEL_STRICT,
    })
    assert.deepEqual(violations, [])
  })

  it('2p long: every contract holds over a seeded random walk', () => {
    const violations = checkConformance(oel, CONFIG_2P_LONG, {
      seeds: [7],
      rng: mulberry32,
      maxSteps: 30,
      ...OEL_STRICT,
    })
    assert.deepEqual(violations, [])
  })

  it('solo: outcome is squashed into [0,1] mid-game', () => {
    const violations = checkConformance(oel, CONFIG_SOLO, {
      seeds: [5],
      rng: mulberry32,
      maxSteps: 30,
      ...OEL_STRICT,
    })
    assert.deepEqual(violations, [])
  })

  it('a full random game reaches terminal and keeps the outcome contract there', () => {
    const violations = checkConformance(oel, CONFIG_2P_SHORT, {
      seeds: [3],
      rng: mulberry32,
      maxSteps: 2000,
      checkStride: 50, // cheap walk; contract sampling only
      requireTerminal: true,
      ...OEL_STRICT,
    })
    assert.deepEqual(violations, [])
  })
})

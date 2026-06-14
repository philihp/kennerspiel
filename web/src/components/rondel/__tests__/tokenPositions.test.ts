import { describe as d, it as test, expect } from '../../../testHelpers'
import { GameCommandConfigParams, Rondel } from 'hathora-et-labora-game'
import {
  computeTokenPositions,
  getWedgePolygon,
  isGrapeUsed,
  isStoneUsed,
  TOKEN_INNER_RADIUS,
  TOKEN_OUTER_RADIUS,
} from '../tokenPositions'

const ireland4: GameCommandConfigParams = { players: 4, length: 'long', country: 'ireland' }
const france4: GameCommandConfigParams = { players: 4, length: 'long', country: 'france' }
const solo: GameCommandConfigParams = { players: 1, length: 'long', country: 'ireland' }

const baseRondel: Rondel = {
  pointingBefore: 0,
  wood: 0,
  clay: 1,
  coin: 2,
  grain: 3,
  peat: 4,
  sheep: 5,
  joker: 6,
  stone: 7,
  grape: undefined,
}

d('isGrapeUsed', () => {
  test('false for solo', () => expect(isGrapeUsed(solo)).toBe(false))
  test('false for ireland', () => expect(isGrapeUsed(ireland4)).toBe(false))
  test('true for france multiplayer', () => expect(isGrapeUsed(france4)).toBe(true))
})

d('isStoneUsed', () => {
  test('false for solo', () => expect(isStoneUsed(solo)).toBe(false))
  test('true for multiplayer', () => expect(isStoneUsed(ireland4)).toBe(true))
})

d('getWedgePolygon', () => {
  test('returns a 4-point polygon', () => {
    expect(getWedgePolygon(0)).toHaveLength(4)
  })
  test('vertices are at the inner and outer radii', () => {
    for (const pos of [0, 6, 12]) {
      const poly = getWedgePolygon(pos)
      for (const [x, y] of poly) {
        const r = Math.sqrt(x * x + y * y)
        expect(r >= TOKEN_INNER_RADIUS - 1).toBeTruthy()
        expect(r <= TOKEN_OUTER_RADIUS + 1).toBeTruthy()
      }
    }
  })
  test('different positions produce different polygons', () => {
    const p0 = getWedgePolygon(0)
    const p1 = getWedgePolygon(1)
    expect(p0[0][0] === p1[0][0] && p0[0][1] === p1[0][1]).toBe(false)
  })
})

d('computeTokenPositions', () => {
  test('returns a position for each token with a defined rondel slot', () => {
    const result = computeTokenPositions(baseRondel, ireland4)
    for (const key of ['wood', 'clay', 'coin', 'grain', 'peat', 'sheep', 'joker', 'stone'] as const) {
      expect(result[key]).toBeDefined()
    }
  })

  test('omits grape when country is not france', () => {
    const rondel = { ...baseRondel, grape: 3 }
    const result = computeTokenPositions(rondel, ireland4)
    expect(result.grape).toBeUndefined()
  })

  test('includes grape when country is france', () => {
    const rondel = { ...baseRondel, grape: 3 }
    const result = computeTokenPositions(rondel, france4)
    expect(result.grape).toBeDefined()
  })

  test('omits stone in solo games', () => {
    const result = computeTokenPositions(baseRondel, solo)
    expect(result.stone).toBeUndefined()
  })

  test('includes stone in multiplayer games', () => {
    const result = computeTokenPositions(baseRondel, ireland4)
    expect(result.stone).toBeDefined()
  })

  test('omits tokens whose position is undefined', () => {
    const rondel: Rondel = { ...baseRondel, peat: undefined }
    const result = computeTokenPositions(rondel, ireland4)
    expect(result.peat).toBeUndefined()
  })

  test('each token position is within the inner/outer radial band', () => {
    const result = computeTokenPositions(baseRondel, ireland4)
    for (const [x, y] of Object.values(result) as [number, number][]) {
      const r = Math.sqrt(x * x + y * y)
      expect(r >= TOKEN_INNER_RADIUS - 1).toBeTruthy()
      expect(r <= TOKEN_OUTER_RADIUS + 1).toBeTruthy()
    }
  })

  test('two tokens at the same position receive distinct coordinates', () => {
    const rondel: Rondel = { ...baseRondel, wood: 5, clay: 5 }
    const result = computeTokenPositions(rondel, ireland4)
    const wood = result.wood!
    const clay = result.clay!
    expect(wood[0] === clay[0] && wood[1] === clay[1]).toBe(false)
  })

  test('a single token at a position lands near the wedge centroid', () => {
    // With only one token in its wedge, pointille returns the centroid.
    // The centroid of a trapezoid sector is strictly between inner and outer radii.
    const rondel: Rondel = {
      ...baseRondel,
      wood: 0,
      clay: 1,
      coin: 2,
      grain: 3,
      peat: 4,
      sheep: 5,
      joker: 6,
      stone: 7,
    }
    const result = computeTokenPositions(rondel, ireland4)
    const [x, y] = result.wood!
    const r = Math.sqrt(x * x + y * y)
    expect(r > TOKEN_INNER_RADIUS).toBeTruthy()
    expect(r < TOKEN_OUTER_RADIUS).toBeTruthy()
  })
})

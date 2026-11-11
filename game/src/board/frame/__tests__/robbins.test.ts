import { describe, it, expect } from '../../../testHelpers'
import { createPcg32 } from 'pcg'
import { count, flatten, isNotNil, map, range, reduce } from 'ramda'
import { reducer } from '../../../reducer'
import { initialState } from '../../../state'
import { BuildingEnum, GameState, LandEnum, SettlementRound, Tile } from '../../../types'
import { nextFrame } from '../../frame'
import { roundBuildings } from '../../buildings'
import {
  coverNeutralSpace,
  crossing,
  emptyNeutralSpace,
  neutralBuild,
  nextFrameRobbins,
  nextFrameRobbinsAggressive,
  rankForRoll,
  rollProductionWheel,
  tokensAtRank,
  tokensOnWheel,
} from '../robbins'
import { rollProductionWheel as roll } from '../robbins'
import { introduceGrapeToken, introduceStoneToken } from '../../rondel'
import { nextFrameSolo } from '../nextFrameSolo'

const startGame = (variant: string, seed = '42'): GameState =>
  reducer(reducer(initialState, ['CONFIG', '1', 'france', 'long', variant])!, ['START', seed, 'R'])!

// advance the frames with no player input, until the game ends
const playOut = (state: GameState): GameState[] =>
  reduce((states: GameState[]) => [...states, nextFrame(states[states.length - 1])!], [state], range(0, 70))

const neutralBuildings = (state: GameState): BuildingEnum[] =>
  flatten(map((row: Tile[]) => map((tile: Tile) => tile[1], row), state.players![1].landscape)).filter(
    isNotNil
  ) as BuildingEnum[]

describe('board/frame/robbins', () => {
  describe('config', () => {
    it('parses the robbins variants', () => {
      const s1 = reducer(initialState, ['CONFIG', '1', 'france', 'long', 'robbins'])!
      expect(s1.config).toStrictEqual({ players: 1, country: 'france', length: 'long', variant: 'robbins' })
      const s2 = reducer(initialState, ['CONFIG', '1', 'france', 'long', 'robbins!'])!
      expect(s2.config!.variant).toBe('robbins!')
    })
    it('does not allow the variant for more than one player', () => {
      expect(() => reducer(initialState, ['CONFIG', '2', 'france', 'long', 'robbins'])).toThrow()
    })
    it('keeps Grapevine B in the C buildings for france', () => {
      expect(
        roundBuildings({ players: 1, country: 'france', length: 'long', variant: 'robbins' }, SettlementRound.C)
      ).toContain(BuildingEnum.GrapevineB)
      expect(roundBuildings({ players: 1, country: 'france', length: 'long' }, SettlementRound.C)).not.toContain(
        BuildingEnum.GrapevineB
      )
    })
  })

  describe('crossing', () => {
    it('gives the rotation of each letter crossing', () => {
      // these are the rotations of the solo settlement phases
      expect(crossing('A', 1)).toBe(11)
      expect(crossing('B', 2)).toBe(15)
      expect(crossing('C', 2)).toBe(21)
      expect(crossing('D', 2)).toBe(25)
      expect(crossing('E', 3)).toBe(31)
    })
  })

  describe('rankForRoll', () => {
    it('maps a d10 to a rank', () => {
      expect(map(rankForRoll, range(1, 11))).toStrictEqual([0, 0, 0, 0, 1, 1, 1, 2, 2, 3])
    })
  })

  describe('tokensAtRank', () => {
    const onWheel: [string, number][] = [
      ['grain', 10],
      ['sheep', 6],
      ['clay', 6],
      ['wood', 2],
    ]
    it('finds the tokens with the nth highest number', () => {
      expect(tokensAtRank(0, onWheel as never)).toStrictEqual(['grain'])
      expect(tokensAtRank(1, onWheel as never)).toStrictEqual(['sheep', 'clay'])
      expect(tokensAtRank(2, onWheel as never)).toStrictEqual(['wood'])
    })
    it('uses the lowest number if there are not enough numbers', () => {
      expect(tokensAtRank(3, onWheel as never)).toStrictEqual(['wood'])
    })
  })

  describe('rollProductionWheel', () => {
    const s0 = {
      config: { players: 1, country: 'france', length: 'long', variant: 'robbins' },
      randGen: createPcg32({}, 1, 42069),
      rondel: { pointingBefore: 6, grain: 6, sheep: 4, clay: 4, wood: 1, coin: 0, joker: 5, peat: 2 },
    } as GameState
    it('moves exactly one token to zero', () => {
      const s1 = rollProductionWheel(s0)!
      const moved = Object.keys(s0.rondel!).filter((k) => s0.rondel![k as 'grain'] !== s1.rondel![k as 'grain'])
      expect(moved).toHaveLength(1)
      expect(s1.rondel![moved[0] as 'grain']).toBe(6)
      expect(s1.randGen).not.toStrictEqual(s0.randGen)
    })
    it('is deterministic', () => {
      expect(roll(s0)).toStrictEqual(roll(s0))
    })
    it('only moves a token from the 4 highest numbers', () => {
      // over many seeds, the moved token is always one at the 1st-4th rank
      const ranks = map(
        (seed) => {
          const s1 = rollProductionWheel({ ...s0, randGen: createPcg32({}, seed, 42069) })!
          const before = tokensOnWheel(s0)
          const after = tokensOnWheel(s1)
          const movedIndex = before.findIndex(([, v], i) => after[i][1] !== v)
          return movedIndex === -1 ? -1 : before[movedIndex][1]
        },
        range(1, 200)
      )
      expect(ranks.every((v) => [6, 5, 3, 2].includes(v))).toBe(true)
    })
  })

  describe('neutral heartland', () => {
    const landscape: Tile[][] = [
      [
        [],
        [],
        [LandEnum.Plains, BuildingEnum.BuildersMarket],
        [LandEnum.Plains],
        [LandEnum.Plains],
        [LandEnum.Plains],
        [LandEnum.Hillside, BuildingEnum.ClayMoundB],
        [],
        [],
      ],
      [
        [],
        [],
        [LandEnum.Plains],
        [LandEnum.Plains],
        [LandEnum.Plains, BuildingEnum.FarmYardB],
        [LandEnum.Plains],
        [LandEnum.Plains, BuildingEnum.CloisterOfficeB],
        [],
        [],
      ],
    ]
    it('fills the top row left to right first, then the bottom row', () => {
      expect(emptyNeutralSpace(landscape)).toStrictEqual([0, 3])
      const full = [
        landscape[0].map((t, i) => (i >= 3 && i <= 5 ? [t[0], BuildingEnum.Bakery] : t)),
        landscape[1],
      ] as Tile[][]
      expect(emptyNeutralSpace(full)).toStrictEqual([1, 2])
    })
    it('covers the top row from the Builders Market when full', () => {
      expect(coverNeutralSpace(landscape, 0)).toStrictEqual([0, 2])
      expect(coverNeutralSpace(landscape, 1)).toStrictEqual([0, 6])
      expect(coverNeutralSpace(landscape, 2)).toStrictEqual([0, 2])
    })
  })

  describe('neutralBuild', () => {
    it('does nothing if no building of the type is in the display', () => {
      const s0 = startGame('robbins')
      const s1 = { ...s0, buildings: [] }
      expect(neutralBuild(SettlementRound.S)(s1)).toBe(s1)
    })
    it('falls back to any building in the display', () => {
      const s0 = startGame('robbins')
      const s1 = { ...s0, buildings: [BuildingEnum.Inn] }
      const s2 = neutralBuild(SettlementRound.S, true)(s1)!
      expect(s2.buildings).toStrictEqual([])
      expect(s2.players![1].landscape[0][3][1]).toBe(BuildingEnum.Inn)
    })
  })

  describe('frame flow', () => {
    it('rolls the wheel before every rotation', () => {
      const rolls = count((f) => !!f.upkeep?.includes(roll), Object.values(nextFrameRobbins))
      expect(rolls).toBe(31)
    })
    it('introduces grape and stone like the multi-player long game', () => {
      expect(Object.values(nextFrameRobbins).some((f) => f.upkeep?.includes(introduceGrapeToken))).toBe(true)
      expect(Object.values(nextFrameRobbins).some((f) => f.upkeep?.includes(introduceStoneToken))).toBe(true)
      expect(Object.values(nextFrameSolo).some((f) => f.upkeep?.includes(introduceGrapeToken))).toBe(false)
    })
    it('keeps the same frames as the solo game', () => {
      expect(Object.keys(nextFrameRobbins)).toStrictEqual(Object.keys(nextFrameSolo))
      expect(Object.keys(nextFrameRobbinsAggressive)).toStrictEqual(Object.keys(nextFrameSolo))
    })
  })

  describe('a whole game', () => {
    it('normal: neutral builds 7 times', () => {
      const states = playOut(startGame('robbins'))
      const last = states[states.length - 1]
      expect(last.status).toBe('FINISHED')
      // 4 pre-printed buildings, 6 empty spaces, the 7th build covers the Builders Market
      expect(last.neutralCovers).toBe(1)
      expect(neutralBuildings(last)).toHaveLength(10)
      expect(last.players![1].landscape[0][2][1]).not.toBe(BuildingEnum.BuildersMarket)
    })
    it('normal: builds a starting building on the first B crossing', () => {
      const states = playOut(startGame('robbins'))
      const before = states.find((s) => s.rondel!.pointingBefore === 1)!
      const after = states.find((s) => s.rondel!.pointingBefore === 2)!
      expect(before.buildings!.length - after.buildings!.length).toBe(1)
      const built = after.players![1].landscape[0][3][1] as BuildingEnum
      expect(roundBuildings(after.config!, SettlementRound.S)).toContain(built)
    })
    it('aggressive: neutral builds 12 times', () => {
      const states = playOut(startGame('robbins!'))
      const last = states[states.length - 1]
      expect(last.status).toBe('FINISHED')
      expect(last.neutralCovers).toBe(6)
    })
    it('is deterministic for a seed, and differs between seeds', () => {
      const a = playOut(startGame('robbins', '7'))
      const b = playOut(startGame('robbins', '7'))
      const c = playOut(startGame('robbins', '8'))
      expect(a[a.length - 1]).toStrictEqual(b[b.length - 1])
      expect(a[a.length - 1].players![1].landscape).not.toStrictEqual(c[c.length - 1].players![1].landscape)
    })
    it('the grape and stone tokens enter the wheel', () => {
      const states = playOut(startGame('robbins'))
      expect(states.some((s) => s.rondel!.grape !== undefined)).toBe(true)
      expect(states.some((s) => s.rondel!.stone !== undefined)).toBe(true)
    })
  })
})

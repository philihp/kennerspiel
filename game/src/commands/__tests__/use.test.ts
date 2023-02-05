import { initialState } from '../../reducer'
import { BuildingEnum, Clergy, LandEnum, PlayerColor, Tile } from '../../types'
import { config } from '../config'
import { start } from '../start'
import { findBuilding, use } from '../use'

describe('commands/use', () => {
  const s0 = initialState
  const s1 = config(s0, { country: 'france', players: 3, length: 'long' })!
  const s2 = start(s1, { seed: 42, colors: [PlayerColor.Red, PlayerColor.Blue, PlayerColor.Green] })!

  describe('use', () => {
    it('throws errors on invalid building', () => {
      expect(() => use('XXX' as unknown as BuildingEnum, [])(s2)).toThrow()
    })
    it('moves next clergyman to the building', () => {
      const s0 = initialState
      const s1 = config(s0, { country: 'france', length: 'long', players: 2 })!
      const s2 = start(s1, { seed: 42, colors: [PlayerColor.Red, PlayerColor.Blue] })!
      const s3 = use(BuildingEnum.FarmYardB, ['ShJo'])(s2)!
      expect(s2.turn.activePlayerIndex).toBe(0)
      expect(s2.players[0].color).toBe(PlayerColor.Blue)
      expect(s2.players[0].landscape[1][4]).toStrictEqual(['P', 'LB2'])
      expect(s2.players[0].clergy).toStrictEqual(['LB1B', 'LB2B', 'PRIB'])
      expect(s3.players[0].clergy).toStrictEqual(['LB2B', 'PRIB'])
      expect(s3.players[0].landscape[1][4]).toStrictEqual(['P', 'LB2', 'LB1B'])
    })
    it('fallback to prior if laypeople are used', () => {
      const s0 = initialState
      const s1 = config(s0, { country: 'france', length: 'long', players: 2 })!
      const s2 = start(s1, { seed: 42, colors: [PlayerColor.Red, PlayerColor.Blue] })!
      s2.players[0].clergy = [Clergy.PriorB]
      const s3 = use(BuildingEnum.FarmYardB, ['ShJo'])(s2)!
      expect(s2.turn.activePlayerIndex).toBe(0)
      expect(s2.players[0].color).toBe(PlayerColor.Blue)
      expect(s2.players[0].landscape[1][4]).toStrictEqual(['P', 'LB2'])
      expect(s2.players[0].clergy).toStrictEqual(['PRIB'])
      expect(s3.players[0].clergy).toStrictEqual([])
      expect(s3.players[0].landscape[1][4]).toStrictEqual(['P', 'LB2', 'PRIB'])
    })
    it('gathers the goods', () => {
      const s0 = initialState
      const s1 = config(s0, { country: 'france', length: 'long', players: 2 })!
      const s2 = start(s1, { seed: 42, colors: [PlayerColor.Red, PlayerColor.Blue] })!
      const s3 = use(BuildingEnum.FarmYardB, ['Sh'])(s2)!
      expect(s2.turn.activePlayerIndex).toBe(0)
      expect(s2.players[0].color).toBe(PlayerColor.Blue)
      expect(s2.players[0].sheep).toBe(1)
      expect(s2.rondel.sheep).toBe(0)
      expect(s2.rondel.joker).toBe(0)
      expect(s3.players[0].sheep).toBe(3)
      expect(s3.rondel.sheep).toBe(1)
      expect(s3.rondel.joker).toBe(0)
    })
    it('can use a joker', () => {
      const s0 = initialState
      const s1 = config(s0, { country: 'france', length: 'long', players: 2 })!
      const s2 = start(s1, { seed: 42, colors: [PlayerColor.Red, PlayerColor.Blue] })!
      const s3 = use(BuildingEnum.FarmYardB, ['ShJo'])(s2)!
      expect(s2.turn.activePlayerIndex).toBe(0)
      expect(s2.players[0].color).toBe(PlayerColor.Blue)
      expect(s2.players[0].sheep).toBe(1)
      expect(s2.rondel.joker).toBe(0)
      expect(s2.rondel.sheep).toBe(0)
      expect(s3.players[0].sheep).toBe(3)
      expect(s3.rondel.joker).toBe(1)
      expect(s3.rondel.sheep).toBe(0)
    })
  })

  describe('findBuilding', () => {
    const landscape: Tile[][] = [
      [
        [LandEnum.Plains, BuildingEnum.Bathhouse],
        [LandEnum.Plains],
        [LandEnum.Plains, BuildingEnum.Camera],
        [LandEnum.Hillside, BuildingEnum.CloisterLibrary],
        [LandEnum.Hillside, BuildingEnum.ChamberOfWonders, Clergy.LayBrother1B],
      ],
      [
        [LandEnum.Plains, BuildingEnum.Peat],
        [LandEnum.Plains, BuildingEnum.Forest],
        [LandEnum.Hillside, BuildingEnum.FarmYardB, Clergy.PriorB],
        [LandEnum.Hillside],
        [LandEnum.Hillside],
      ],
    ]
    it('finds the building', () => {
      expect(findBuilding(landscape, BuildingEnum.FarmYardB)).toStrictEqual({ row: 1, col: 2 })
    })
    it('returns undefined if not found', () => {
      expect(findBuilding(landscape, BuildingEnum.Alehouse)).toStrictEqual({ row: undefined, col: undefined })
    })
  })
})

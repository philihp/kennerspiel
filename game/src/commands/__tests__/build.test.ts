import { initialState, reducer } from '../../reducer'
import { BuildingEnum, GameStatePlaying, LandEnum, PlayerColor } from '../../types'
import { config } from '../config'
import { start } from '../start'

describe('commands/build', () => {
  const s0 = initialState
  const s1 = config(s0, { country: 'france', players: 3, length: 'long' })!
  const s2 = start(s1, {
    seed: 42,
    colors: [PlayerColor.Red, PlayerColor.Blue, PlayerColor.Green],
  })! as GameStatePlaying

  describe('build', () => {
    it('fails when building is not available', () => {
      const s3: GameStatePlaying = {
        ...s2,
        activePlayerIndex: 0,
        players: [
          {
            ...s2.players[0],
            wood: 10,
            penny: 10,
            clay: 10,
          },
          ...s2.players.slice(1),
        ],
        buildings: s2.buildings.filter((b) => b !== 'G07'),
      }
      const s4 = reducer(s3, ['BUILD', 'G07', '3', '1'])! as GameStatePlaying
      expect(s4).toBeUndefined()
    })
    it('fails when erection present', () => {
      const s3: GameStatePlaying = {
        ...s2,
        activePlayerIndex: 0,
        players: [
          {
            ...s2.players[0],
            wood: 10,
            penny: 10,
            clay: 10,
          },
          ...s2.players.slice(1),
        ],
      }
      const s4 = reducer(s3, ['BUILD', 'G07', '0', '1'])! as GameStatePlaying
      expect(s4).toBeUndefined()
    })
    it('fails when player cant afford building', () => {
      const s3: GameStatePlaying = {
        ...s2,
        activePlayerIndex: 0,
        players: [
          {
            ...s2.players[0],
            wood: 0,
            penny: 0,
            clay: 0,
            stone: 0,
            straw: 0,
          },
          ...s2.players.slice(1),
        ],
      }
      const s4 = reducer(s3, ['BUILD', 'G07', '3', '1'])! as GameStatePlaying
      expect(s4).toBeUndefined()
    })
    it('fails if building cloister without being neighbors to another', () => {
      const s3: GameStatePlaying = {
        ...s2,
        activePlayerIndex: 0,
        players: [
          {
            ...s2.players[0],
            wood: 10,
            penny: 10,
            clay: 10,
            stone: 10,
          },
          ...s2.players.slice(1),
        ],
      }
      const s4 = reducer(s3, ['BUILD', BuildingEnum.Priory, '3', '0'])! as GameStatePlaying
      expect(s4).toBeUndefined()
    })
    it('builds just fine', () => {
      const s3: GameStatePlaying = {
        ...s2,
        activePlayerIndex: 0,
        players: [
          {
            ...s2.players[0],
            wood: 10,
            penny: 10,
            clay: 10,
            stone: 10,
            straw: 10,
          },
          ...s2.players.slice(1),
        ],
      }
      const s4 = reducer(s3, ['BUILD', BuildingEnum.Windmill, '3', '1'])! as GameStatePlaying
      expect(s4).toBeDefined()
      expect(s4.buildings).not.toContain(BuildingEnum.Windmill)
      expect(s4.players[0].landscape[1][5][1]).toBe(BuildingEnum.Windmill)
      expect(s4.players[0].wood).toBe(7)
      expect(s4.players[0].clay).toBe(8)
      expect(s4.players[0].stone).toBe(10)
      expect(s4.players[0].straw).toBe(10)
    })
    it('accounts for landscape Y offset', () => {
      const s3: GameStatePlaying = {
        ...s2,
        activePlayerIndex: 0,
        players: [
          {
            ...s2.players[0],
            wood: 10,
            penny: 10,
            clay: 10,
            stone: 10,
            straw: 10,
            landscapeOffset: 1,
            landscape: [
              [[], [], [LandEnum.Plains], [LandEnum.Plains], [LandEnum.Plains], [], []],
              [[], [], [LandEnum.Plains], [LandEnum.Plains], [LandEnum.Plains], [], []],
              [[], [], [LandEnum.Plains], [LandEnum.Plains], [LandEnum.Plains], [], []],
            ],
          },
          ...s2.players.slice(1),
        ],
      }
      const s4 = reducer(s3, ['BUILD', BuildingEnum.Windmill, '1', '-1'])! as GameStatePlaying
      expect(s4).toBeDefined()
      expect(s4.buildings).not.toContain(BuildingEnum.Windmill)
      expect(s4.players[0]).toMatchObject({
        wood: 7,
        clay: 8,
        stone: 10,
        straw: 10,
        landscape: [
          [[], [], ['P'], ['P', 'F04'], ['P'], [], []],
          [[], [], ['P'], ['P'], ['P'], [], []],
          [[], [], ['P'], ['P'], ['P'], [], []],
        ],
      })
    })
  })
})

import { initialState, reducer } from '../../reducer'
import { BuildingEnum, GameStatePlaying, PlayerColor } from '../../types'
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
          },
          ...s2.players.slice(1),
        ],
      }
      const s4 = reducer(s3, ['BUILD', 'G07', '3', '1'])! as GameStatePlaying
      expect(s4).toBeDefined()
    })
  })
})

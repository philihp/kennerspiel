import { config } from '../../commands/config'
import { start } from '../../commands/start'
import { reducer, initialState } from '../../reducer'
import { BuildingEnum, PlayerColor, ResourceEnum } from '../../types'
import { farmyard } from '../farmyard'

describe('buildings/farmyard', () => {
  describe('use', () => {
    it('goes through a happy path', () => {
      expect.assertions(8)
      const s0 = initialState
      const s1 = config(s0, { country: 'france', length: 'short', players: 3 })!
      expect(s1).toBeDefined()
      const s2 = start(s1, { colors: [PlayerColor.Red, PlayerColor.Blue, PlayerColor.Green], seed: 42 })!
      expect(s2).toBeDefined()
      expect(s2.activePlayerIndex).toBe(0)
      expect(s2.players[0].landscape[1][2]).toStrictEqual(['P', 'LR2'])
      expect(s2.players[0].sheep).toBe(2)
      const s3 = farmyard('Sh')(s2)!
      expect(s3.rondel.joker).not.toBe(s3.rondel.pointingBefore)
      expect(s3.rondel.sheep).toBe(s3.rondel.pointingBefore)
      expect(s3.players[0].sheep).toBe(4)
    })
    it('can use the joker', () => {
      expect.assertions(8)
      const s0 = initialState
      const s1 = config(s0, { country: 'france', length: 'short', players: 3 })!
      expect(s1).toBeDefined()
      const s2 = start(s1, { colors: [PlayerColor.Red, PlayerColor.Blue, PlayerColor.Green], seed: 42 })!
      expect(s2).toBeDefined()
      expect(s2.activePlayerIndex).toBe(0)
      expect(s2.players[0].landscape[1][2]).toStrictEqual(['P', 'LR2'])
      expect(s2.players[0].sheep).toBe(2)
      const s3 = farmyard('JoSh')(s2)!
      expect(s3.rondel.joker).toBe(s3.rondel.pointingBefore)
      expect(s3.rondel.sheep).not.toBe(s3.rondel.pointingBefore)
      expect(s3.players[0].sheep).toBe(4)
    })
    it('can pick up grain', () => {
      expect.assertions(8)
      const s0 = initialState
      const s1 = config(s0, { country: 'france', length: 'short', players: 3 })!
      expect(s1).toBeDefined()
      const s2 = start(s1, { colors: [PlayerColor.Red, PlayerColor.Blue, PlayerColor.Green], seed: 42 })!
      expect(s2).toBeDefined()
      expect(s2.activePlayerIndex).toBe(0)
      expect(s2.players[0].landscape[1][2]).toStrictEqual(['P', 'LR2'])
      expect(s2.players[0].grain).toBe(2)
      const s3 = farmyard('Gn')(s2)!
      expect(s3.rondel.joker).not.toBe(s3.rondel.pointingBefore)
      expect(s3.rondel.grain).toBe(s3.rondel.pointingBefore)
      expect(s3.players[0].grain).toBe(4)
    })
  })
})

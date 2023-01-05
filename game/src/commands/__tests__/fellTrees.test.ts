import { initialState } from '../../reducer'
import { PlayerColor } from '../../types'
import { config } from '../config'
import { fellTrees } from '../fellTrees'
import { start } from '../start'

describe('commands/fellTrees', () => {
  describe('fellTrees', () => {
    it('removes the forest', () => {
      expect.assertions(2)
      const s0 = initialState
      const s1 = config(s0, { country: 'france', players: 3, length: 'long' })!
      const s2 = start(s1, { seed: 12345, colors: [PlayerColor.Red, PlayerColor.Blue, PlayerColor.Green] })!
      expect(s2.players?.[0].landscape).toStrictEqual([
        [['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['H', 'LR1']],
        [['P', 'LPE'], ['P', 'LFO'], ['P', 'LR2'], ['P'], ['P', 'LR3']],
      ])
      const s3 = fellTrees({ row: 0, col: 1, useJoker: false })(s2)!
      expect(s3.players?.[0].landscape).toStrictEqual([
        [['P', 'LPE'], ['P'], ['P', 'LFO'], ['P'], ['H', 'LR1']],
        [['P', 'LPE'], ['P', 'LFO'], ['P', 'LR2'], ['P'], ['P', 'LR3']],
      ])
    })
    it('wont fell trees where there are no trees', () => {
      expect.assertions(2)
      const s0 = initialState
      const s1 = config(s0, { country: 'france', players: 3, length: 'long' })!
      const s2 = start(s1, { seed: 12345, colors: [PlayerColor.Red, PlayerColor.Blue, PlayerColor.Green] })!
      expect(s2.players?.[0].landscape).toStrictEqual([
        [['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['H', 'LR1']],
        [['P', 'LPE'], ['P', 'LFO'], ['P', 'LR2'], ['P'], ['P', 'LR3']],
      ])
      const s3 = fellTrees({ row: 0, col: 0, useJoker: false })(s2)
      expect(s3).toBeUndefined()
    })
    it('moves up the joker', () => {
      expect.assertions(2)
      const s0 = initialState
      const s1 = config(s0, { country: 'france', players: 3, length: 'long' })!
      const s2 = start(s1, { seed: 12345, colors: [PlayerColor.Red, PlayerColor.Blue, PlayerColor.Green] })!
      const s3 = fellTrees({ row: 0, col: 1, useJoker: true })(s2)!
      expect(s3.rondel.joker).toBe(1)
      expect(s3.rondel.wood).toBe(0)
    })
    it('moves up the wood token', () => {
      expect.assertions(2)
      const s0 = initialState
      const s1 = config(s0, { country: 'france', players: 3, length: 'long' })!
      const s2 = start(s1, { seed: 12345, colors: [PlayerColor.Red, PlayerColor.Blue, PlayerColor.Green] })!
      const s3 = fellTrees({ row: 0, col: 1, useJoker: false })(s2)!
      expect(s3.rondel.joker).toBe(0)
      expect(s3.rondel.wood).toBe(1)
    })
    it('gives the active player wood', () => {
      expect.assertions(6)
      const s0 = initialState
      const s1 = config(s0, { country: 'france', players: 3, length: 'long' })!
      const s2 = start(s1, { seed: 12345, colors: [PlayerColor.Red, PlayerColor.Blue, PlayerColor.Green] })!
      expect(s2.players?.[0].wood).toBe(1)
      expect(s2.players?.[1].wood).toBe(1)
      expect(s2.players?.[2].wood).toBe(1)
      const s3 = fellTrees({ row: 0, col: 1, useJoker: false })(s2)!
      expect(s3.players?.[0].wood).toBe(3)
      expect(s2.players?.[1].wood).toBe(1)
      expect(s2.players?.[2].wood).toBe(1)
    })
  })
})

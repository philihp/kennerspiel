import { initialState } from '../../reducer'
import { PlayerColor } from '../../types'
import { config } from '../config'
import { cutPeat } from '../cutPeat'
import { start } from '../start'

describe('commands/cutPeat', () => {
  describe('cutPeat', () => {
    it('removes the peat', () => {
      expect.assertions(2)
      const s0 = initialState
      const s1 = config(s0, { country: 'france', players: 3, length: 'long' })!
      const s2 = start(s1, { seed: 12345, colors: [PlayerColor.Red, PlayerColor.Blue, PlayerColor.Green] })!
      expect(s2.players?.[0].landscape).toStrictEqual([
        [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['H', 'LR1'], [], []],
        [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LR2'], ['P'], ['P', 'LR3'], [], []],
      ])
      const s3 = cutPeat({ row: 0, col: 0, useJoker: false })(s2)!
      expect(s3.players?.[0].landscape).toStrictEqual([
        [[], [], ['P'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['H', 'LR1'], [], []],
        [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LR2'], ['P'], ['P', 'LR3'], [], []],
      ])
    })
    it('wont cut peat where there is no peat', () => {
      expect.assertions(2)
      const s0 = initialState
      const s1 = config(s0, { country: 'france', players: 3, length: 'long' })!
      const s2 = start(s1, { seed: 12345, colors: [PlayerColor.Red, PlayerColor.Blue, PlayerColor.Green] })!
      expect(s2.players?.[0].landscape).toStrictEqual([
        [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['H', 'LR1'], [], []],
        [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LR2'], ['P'], ['P', 'LR3'], [], []],
      ])
      const s3 = cutPeat({ row: 0, col: 1, useJoker: false })(s2)
      expect(s3).toBeUndefined()
    })
    it('moves up the joker', () => {
      expect.assertions(2)
      const s0 = initialState
      const s1 = config(s0, { country: 'france', players: 3, length: 'long' })!
      const s2 = start(s1, { seed: 12345, colors: [PlayerColor.Red, PlayerColor.Blue, PlayerColor.Green] })!
      const s3 = cutPeat({ row: 0, col: 0, useJoker: true })(s2)!
      expect(s3.rondel.joker).toBe(1)
      expect(s3.rondel.peat).toBe(0)
    })
    it('moves up the peat token', () => {
      expect.assertions(2)
      const s0 = initialState
      const s1 = config(s0, { country: 'france', players: 3, length: 'long' })!
      const s2 = start(s1, { seed: 12345, colors: [PlayerColor.Red, PlayerColor.Blue, PlayerColor.Green] })!
      const s3 = cutPeat({ row: 0, col: 0, useJoker: false })(s2)!
      expect(s3.rondel.joker).toBe(0)
      expect(s3.rondel.peat).toBe(1)
    })
    it('gives the active player peat', () => {
      expect.assertions(6)
      const s0 = initialState
      const s1 = config(s0, { country: 'france', players: 3, length: 'long' })!
      const s2 = start(s1, { seed: 12345, colors: [PlayerColor.Red, PlayerColor.Blue, PlayerColor.Green] })!
      expect(s2.players?.[0].peat).toBe(1)
      expect(s2.players?.[1].peat).toBe(1)
      expect(s2.players?.[2].peat).toBe(1)
      const s3 = cutPeat({ row: 0, col: 0, useJoker: false })(s2)!
      expect(s3.players?.[0].peat).toBe(3)
      expect(s2.players?.[1].peat).toBe(1)
      expect(s2.players?.[2].peat).toBe(1)
    })
  })
})

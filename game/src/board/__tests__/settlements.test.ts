import { PlayerColor, SettlementRound } from '../../types'
import { roundSettlements } from '../settlements'

describe('board/settlements', () => {
  describe('roundSettlements', () => {
    it('returns list for settlement L', () => {
      expect.assertions(1)
      expect(roundSettlements(PlayerColor.Blue, SettlementRound.L)).toStrictEqual([])
    })
    it('returns list for settlement S', () => {
      expect.assertions(1)
      expect(roundSettlements(PlayerColor.Blue, SettlementRound.S)).toStrictEqual(['SB1', 'SB2', 'SB3', 'SB4'])
    })
    it('returns list for settlement A', () => {
      expect.assertions(1)
      expect(roundSettlements(PlayerColor.Blue, SettlementRound.A)).toStrictEqual(['SB5'])
    })
    it('returns list for settlement B', () => {
      expect.assertions(1)
      expect(roundSettlements(PlayerColor.Blue, SettlementRound.B)).toStrictEqual(['SB6'])
    })
    it('returns list for settlement C', () => {
      expect.assertions(1)
      expect(roundSettlements(PlayerColor.Blue, SettlementRound.C)).toStrictEqual(['SB7'])
    })
    it('returns list for settlement D', () => {
      expect.assertions(1)
      expect(roundSettlements(PlayerColor.Blue, SettlementRound.D)).toStrictEqual(['SB8'])
    })
    it('returns list for settlement E', () => {
      expect.assertions(1)
      expect(roundSettlements(PlayerColor.Blue, SettlementRound.E)).toStrictEqual([])
    })
    it('considers the player color', () => {
      expect.assertions(1)
      expect(roundSettlements(PlayerColor.Red, SettlementRound.S)).toStrictEqual(['SR1', 'SR2', 'SR3', 'SR4'])
    })
  })
})

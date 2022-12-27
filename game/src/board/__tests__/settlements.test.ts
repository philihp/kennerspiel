import { PlayerColor, SettlementRound } from '../../types'
import { roundSettlements, settlementRounds } from '../settlements'

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
  })
})

describe('settlementRounds', () => {
  it('returns rounds for 1 player france short', () => {
    expect.assertions(1)
    expect(settlementRounds({ players: 1, country: 'france', length: 'short' })).toStrictEqual([11, 15, 21, 25, 31])
  })
  it('returns rounds for 1 player ireland short', () => {
    expect.assertions(1)
    expect(settlementRounds({ players: 1, country: 'ireland', length: 'short' })).toStrictEqual([11, 15, 21, 25, 31])
  })
  it('returns rounds for 1 player france long', () => {
    expect.assertions(1)
    expect(settlementRounds({ players: 1, country: 'france', length: 'long' })).toStrictEqual([11, 15, 21, 25, 31])
  })
  it('returns rounds for 1 player ireland long', () => {
    expect.assertions(1)
    expect(settlementRounds({ players: 1, country: 'ireland', length: 'long' })).toStrictEqual([11, 15, 21, 25, 31])
  })
  it('returns rounds for 2 player france short', () => {
    expect.assertions(1)
    expect(settlementRounds({ players: 2, country: 'france', length: 'short' })).toStrictEqual([6, 13, 20, 27])
  })
  it('returns rounds for 2 player ireland short', () => {
    expect.assertions(1)
    expect(settlementRounds({ players: 2, country: 'ireland', length: 'short' })).toStrictEqual([6, 13, 20, 27])
  })
  it('returns rounds for 2 player france long', () => {
    expect.assertions(1)
    expect(settlementRounds({ players: 2, country: 'france', length: 'long' })).toStrictEqual([6, 13, 20, 27])
  })
  it('returns rounds for 2 player ireland long', () => {
    expect.assertions(1)
    expect(settlementRounds({ players: 2, country: 'ireland', length: 'long' })).toStrictEqual([6, 13, 20, 27])
  })
  it('returns rounds for 3 player france short', () => {
    expect.assertions(1)
    expect(settlementRounds({ players: 3, country: 'france', length: 'short' })).toStrictEqual([2, 4, 6, 8, 12])
  })
  it('returns rounds for 3 player ireland short', () => {
    expect.assertions(1)
    expect(settlementRounds({ players: 3, country: 'ireland', length: 'short' })).toStrictEqual([2, 4, 6, 8, 12])
  })
  it('returns rounds for 3 player france long', () => {
    expect.assertions(1)
    expect(settlementRounds({ players: 3, country: 'france', length: 'long' })).toStrictEqual([5, 10, 14, 19, 24])
  })
  it('returns rounds for 3 player ireland long', () => {
    expect.assertions(1)
    expect(settlementRounds({ players: 3, country: 'ireland', length: 'long' })).toStrictEqual([5, 10, 14, 19, 24])
  })
  it('returns rounds for 4 player france short', () => {
    expect.assertions(1)
    expect(settlementRounds({ players: 4, country: 'france', length: 'short' })).toStrictEqual([2, 4, 6, 8, 12])
  })
  it('returns rounds for 4 player ireland short', () => {
    expect.assertions(1)
    expect(settlementRounds({ players: 4, country: 'ireland', length: 'short' })).toStrictEqual([2, 4, 6, 8, 12])
  })
  it('returns rounds for 4 player france long', () => {
    expect.assertions(1)
    expect(settlementRounds({ players: 4, country: 'france', length: 'long' })).toStrictEqual([6, 9, 15, 18, 24])
  })
  it('returns rounds for 4 player ireland long', () => {
    expect.assertions(1)
    expect(settlementRounds({ players: 4, country: 'ireland', length: 'long' })).toStrictEqual([6, 9, 15, 18, 24])
  })
})

import { GameCommandConfigParams, PlayerColor, SettlementRound } from '../../types'
import { roundSettlements, settlementOnRound } from '../settlements'

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

  describe('settlementOnRound', () => {
    it('returns rounds for 1 player france short', () => {
      expect.assertions(5)
      const config: GameCommandConfigParams = { players: 1, country: 'france', length: 'short' }
      expect(settlementOnRound(config, SettlementRound.A)).toBe(11)
      expect(settlementOnRound(config, SettlementRound.B)).toBe(15)
      expect(settlementOnRound(config, SettlementRound.C)).toBe(21)
      expect(settlementOnRound(config, SettlementRound.D)).toBe(25)
      expect(settlementOnRound(config, SettlementRound.E)).toBe(31)
    })
    it('returns rounds for 1 player ireland short', () => {
      expect.assertions(5)
      const config: GameCommandConfigParams = { players: 1, country: 'ireland', length: 'short' }
      expect(settlementOnRound(config, SettlementRound.A)).toBe(11)
      expect(settlementOnRound(config, SettlementRound.B)).toBe(15)
      expect(settlementOnRound(config, SettlementRound.C)).toBe(21)
      expect(settlementOnRound(config, SettlementRound.D)).toBe(25)
      expect(settlementOnRound(config, SettlementRound.E)).toBe(31)
    })
    it('returns rounds for 1 player france long', () => {
      expect.assertions(5)
      const config: GameCommandConfigParams = { players: 1, country: 'france', length: 'long' }
      expect(settlementOnRound(config, SettlementRound.A)).toBe(11)
      expect(settlementOnRound(config, SettlementRound.B)).toBe(15)
      expect(settlementOnRound(config, SettlementRound.C)).toBe(21)
      expect(settlementOnRound(config, SettlementRound.D)).toBe(25)
      expect(settlementOnRound(config, SettlementRound.E)).toBe(31)
    })
    it('returns rounds for 1 player ireland long', () => {
      expect.assertions(5)
      const config: GameCommandConfigParams = { players: 1, country: 'ireland', length: 'long' }
      expect(settlementOnRound(config, SettlementRound.A)).toBe(11)
      expect(settlementOnRound(config, SettlementRound.B)).toBe(15)
      expect(settlementOnRound(config, SettlementRound.C)).toBe(21)
      expect(settlementOnRound(config, SettlementRound.D)).toBe(25)
      expect(settlementOnRound(config, SettlementRound.E)).toBe(31)
    })
    it('returns rounds for 2 player france short', () => {
      expect.assertions(4)
      const config: GameCommandConfigParams = { players: 2, country: 'france', length: 'short' }
      expect(settlementOnRound(config, SettlementRound.A)).toBe(6)
      expect(settlementOnRound(config, SettlementRound.B)).toBe(13)
      expect(settlementOnRound(config, SettlementRound.C)).toBe(20)
      expect(settlementOnRound(config, SettlementRound.D)).toBe(27)
    })
    it('returns rounds for 2 player ireland short', () => {
      expect.assertions(4)
      const config: GameCommandConfigParams = { players: 2, country: 'ireland', length: 'short' }
      expect(settlementOnRound(config, SettlementRound.A)).toBe(6)
      expect(settlementOnRound(config, SettlementRound.B)).toBe(13)
      expect(settlementOnRound(config, SettlementRound.C)).toBe(20)
      expect(settlementOnRound(config, SettlementRound.D)).toBe(27)
    })
    it('returns rounds for 2 player france long', () => {
      expect.assertions(4)
      const config: GameCommandConfigParams = { players: 2, country: 'france', length: 'long' }
      expect(settlementOnRound(config, SettlementRound.A)).toBe(6)
      expect(settlementOnRound(config, SettlementRound.B)).toBe(13)
      expect(settlementOnRound(config, SettlementRound.C)).toBe(20)
      expect(settlementOnRound(config, SettlementRound.D)).toBe(27)
    })
    it('returns rounds for 2 player ireland long', () => {
      expect.assertions(4)
      const config: GameCommandConfigParams = { players: 2, country: 'ireland', length: 'long' }
      expect(settlementOnRound(config, SettlementRound.A)).toBe(6)
      expect(settlementOnRound(config, SettlementRound.B)).toBe(13)
      expect(settlementOnRound(config, SettlementRound.C)).toBe(20)
      expect(settlementOnRound(config, SettlementRound.D)).toBe(27)
    })
    it('returns rounds for 3 player france short', () => {
      expect.assertions(5)
      const config: GameCommandConfigParams = { players: 3, country: 'france', length: 'short' }
      expect(settlementOnRound(config, SettlementRound.A)).toBe(2)
      expect(settlementOnRound(config, SettlementRound.B)).toBe(4)
      expect(settlementOnRound(config, SettlementRound.C)).toBe(6)
      expect(settlementOnRound(config, SettlementRound.D)).toBe(8)
      expect(settlementOnRound(config, SettlementRound.E)).toBe(12)
    })
    it('returns rounds for 3 player ireland short', () => {
      expect.assertions(5)
      const config: GameCommandConfigParams = { players: 3, country: 'ireland', length: 'short' }
      expect(settlementOnRound(config, SettlementRound.A)).toBe(2)
      expect(settlementOnRound(config, SettlementRound.B)).toBe(4)
      expect(settlementOnRound(config, SettlementRound.C)).toBe(6)
      expect(settlementOnRound(config, SettlementRound.D)).toBe(8)
      expect(settlementOnRound(config, SettlementRound.E)).toBe(12)
    })
    it('returns rounds for 3 player france long', () => {
      expect.assertions(5)
      const config: GameCommandConfigParams = { players: 3, country: 'france', length: 'long' }
      expect(settlementOnRound(config, SettlementRound.A)).toBe(5)
      expect(settlementOnRound(config, SettlementRound.B)).toBe(10)
      expect(settlementOnRound(config, SettlementRound.C)).toBe(14)
      expect(settlementOnRound(config, SettlementRound.D)).toBe(19)
      expect(settlementOnRound(config, SettlementRound.E)).toBe(24)
    })
    it('returns rounds for 3 player ireland long', () => {
      expect.assertions(5)
      const config: GameCommandConfigParams = { players: 3, country: 'ireland', length: 'long' }
      expect(settlementOnRound(config, SettlementRound.A)).toBe(5)
      expect(settlementOnRound(config, SettlementRound.B)).toBe(10)
      expect(settlementOnRound(config, SettlementRound.C)).toBe(14)
      expect(settlementOnRound(config, SettlementRound.D)).toBe(19)
      expect(settlementOnRound(config, SettlementRound.E)).toBe(24)
    })
    it('returns rounds for 4 player france short', () => {
      expect.assertions(5)
      const config: GameCommandConfigParams = { players: 4, country: 'france', length: 'short' }
      expect(settlementOnRound(config, SettlementRound.A)).toBe(2)
      expect(settlementOnRound(config, SettlementRound.B)).toBe(4)
      expect(settlementOnRound(config, SettlementRound.C)).toBe(6)
      expect(settlementOnRound(config, SettlementRound.D)).toBe(8)
      expect(settlementOnRound(config, SettlementRound.E)).toBe(12)
    })
    it('returns rounds for 4 player ireland short', () => {
      expect.assertions(5)
      const config: GameCommandConfigParams = { players: 4, country: 'ireland', length: 'short' }
      expect(settlementOnRound(config, SettlementRound.A)).toBe(2)
      expect(settlementOnRound(config, SettlementRound.B)).toBe(4)
      expect(settlementOnRound(config, SettlementRound.C)).toBe(6)
      expect(settlementOnRound(config, SettlementRound.D)).toBe(8)
      expect(settlementOnRound(config, SettlementRound.E)).toBe(12)
    })
    it('returns rounds for 4 player france long', () => {
      expect.assertions(5)
      const config: GameCommandConfigParams = { players: 4, country: 'france', length: 'long' }
      expect(settlementOnRound(config, SettlementRound.A)).toBe(6)
      expect(settlementOnRound(config, SettlementRound.B)).toBe(9)
      expect(settlementOnRound(config, SettlementRound.C)).toBe(15)
      expect(settlementOnRound(config, SettlementRound.D)).toBe(18)
      expect(settlementOnRound(config, SettlementRound.E)).toBe(24)
    })
    it('returns rounds for 4 player ireland long', () => {
      expect.assertions(5)
      const config: GameCommandConfigParams = { players: 4, country: 'ireland', length: 'long' }
      expect(settlementOnRound(config, SettlementRound.A)).toBe(6)
      expect(settlementOnRound(config, SettlementRound.B)).toBe(9)
      expect(settlementOnRound(config, SettlementRound.C)).toBe(15)
      expect(settlementOnRound(config, SettlementRound.D)).toBe(18)
      expect(settlementOnRound(config, SettlementRound.E)).toBe(24)
    })
  })
})

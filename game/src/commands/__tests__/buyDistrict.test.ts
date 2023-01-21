import { initialState } from '../../reducer'
import { GameStatePlaying, PlayerColor } from '../../types'
import { buyDistrict } from '../buyDistrict'
import { config } from '../config'
import { start } from '../start'

describe('commands/buyDistrict', () => {
  describe('buyDistrict', () => {
    it('can buyDistrict', () => {
      const s0 = initialState
      const s1 = config(s0, {
        players: 3,
        country: 'ireland',
        length: 'long',
      })!
      const s2 = start(s1, {
        seed: 42,
        colors: [PlayerColor.Red, PlayerColor.Green, PlayerColor.Blue],
      })! as GameStatePlaying
      const s3: GameStatePlaying = {
        ...s2,
        players: [{ ...s2.players[0], penny: 0, nickel: 1 }, ...s2.players.slice(1)],
      }
      expect(s3).toMatchObject({
        canBuyLandscape: true,
        activePlayerIndex: 0,
        districtPurchasePrices: [2, 3, 4, 4, 5, 5, 6, 7, 8],
      })
      const s4 = buyDistrict({ side: 'HILLS', y: 0 })(s3)!
      expect(s4).toMatchObject({
        canBuyLandscape: false,
        districtPurchasePrices: [3, 4, 4, 5, 5, 6, 7, 8],
      })
      expect(s4.players[0]).toMatchObject({
        penny: 3,
        landscape: [
          // TODO: this should go up or down depending on 'y' param
          [['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['H'], ['H']],
          [['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['H', 'LR1']],
          [['P', 'LPE'], ['P', 'LFO'], ['P', 'LR2'], ['P'], ['P', 'LR3']],
        ],
      })
    })
  })
})

import { initialState } from '../../reducer'
import { GameStatePlaying, PlayerColor, Tile } from '../../types'
import { buyDistrict } from '../buyDistrict'
import { config } from '../config'
import { start } from '../start'

describe('commands/buyDistrict', () => {
  describe('buyDistrict', () => {
    it('can buyDistrict to top', () => {
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
      expect(s3).toBeDefined()
      const s4 = buyDistrict({ side: 'HILLS', y: -1 })(s3)!
      expect(s4).toMatchObject({
        canBuyLandscape: false,
        districtPurchasePrices: [3, 4, 4, 5, 5, 6, 7, 8],
      })
      expect(s4.players[0]).toMatchObject({
        penny: 3,
        landscapeOffset: 1,
        landscape: [
          [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['H'], ['H'], [], []],
          [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['H', 'LR1'], [], []],
          [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LR2'], ['P'], ['P', 'LR3'], [], []],
        ],
      })
    })
    it('does not allow buying twice', () => {
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
      const s4 = buyDistrict({ side: 'HILLS', y: -1 })(s3)!
      expect(s4).toMatchObject({
        canBuyLandscape: false,
      })
      const s5 = buyDistrict({ side: 'PLAINS', y: -2 })(s4)!
      expect(s5).toBeUndefined()
    })
    it('can buyDistrict to bottom', () => {
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
      expect(s3).toBeDefined()
      const s4 = buyDistrict({ side: 'PLAINS', y: 2 })(s3)!
      expect(s4).toMatchObject({
        canBuyLandscape: false,
        districtPurchasePrices: [3, 4, 4, 5, 5, 6, 7, 8],
      })
      expect(s4.players[0]).toMatchObject({
        penny: 3,
        landscapeOffset: 0,
        landscape: [
          [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['H', 'LR1'], [], []],
          [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LR2'], ['P'], ['P', 'LR3'], [], []],
          [[], [], ['P', 'LFO'], ['P'], ['P'], ['P'], ['H'], [], []],
        ],
      })
    })

    it('can buy a district with a gap', () => {
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
        players: [
          {
            ...s2.players[0],
            penny: 0,
            nickel: 5,
            landscape: [
              [['W'], ['C'], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['H', 'LR1'], [], []],
              [['W'], ['C'], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LR2'], ['P'], ['P', 'LR3'], [], []],
              [['W'], ['C'], [], [], [], [], [], [], []],
              [['W'], ['C'], [], [], [], [], [], [], []],
            ] as Tile[][],
          },
          ...s2.players.slice(1),
        ],
      }
      expect(s3).toMatchObject({
        canBuyLandscape: true,
        activePlayerIndex: 0,
        districtPurchasePrices: [2, 3, 4, 4, 5, 5, 6, 7, 8],
      })
      expect(s3).toBeDefined()
      const s4 = buyDistrict({ side: 'PLAINS', y: 3 })(s3)!
      expect(s4).toMatchObject({
        canBuyLandscape: false,
        districtPurchasePrices: [3, 4, 4, 5, 5, 6, 7, 8],
      })
      expect(s4.players[0]).toMatchObject({
        penny: 3,
        landscapeOffset: 0,
        landscape: [
          [['W'], ['C'], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['H', 'LR1'], [], []],
          [['W'], ['C'], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LR2'], ['P'], ['P', 'LR3'], [], []],
          [['W'], ['C'], [], [], [], [], [], [], []],
          [['W'], ['C'], ['P', 'LFO'], ['P'], ['P'], ['P'], ['H'], [], []],
        ],
      })
    })
  })
})

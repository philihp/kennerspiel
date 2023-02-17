import { initialState } from '../../state'
import {
  GameStatePlaying,
  GameStatusEnum,
  NextUseClergy,
  PlayerColor,
  SettlementRound,
  Tableau,
  Tile,
} from '../../types'
import { stoneMerchant } from '../stoneMerchant'

describe('buildings/stoneMerchant', () => {
  describe('stoneMerchant', () => {
    const p0: Tableau = {
      color: PlayerColor.Blue,
      clergy: [],
      settlements: [],
      landscape: [
        [[], [], ['P'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['P'], [], []],
        [[], [], ['P'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['P'], [], []],
      ] as Tile[][],
      wonders: 0,
      landscapeOffset: 0,
      peat: 10,
      penny: 10,
      clay: 10,
      wood: 10,
      grain: 10,
      sheep: 10,
      stone: 10,
      flour: 10,
      grape: 10,
      nickel: 10,
      hops: 10,
      coal: 10,
      book: 10,
      pottery: 10,
      whiskey: 10,
      straw: 10,
      meat: 10,
      ornament: 10,
      bread: 10,
      wine: 10,
      beer: 10,
      reliquary: 10,
    }
    const s0: GameStatePlaying = {
      ...initialState,
      status: GameStatusEnum.PLAYING,
      frame: {
        next: 1,
        startingPlayer: 1,
        settlementRound: SettlementRound.S,
        currentPlayerIndex: 0,
        activePlayerIndex: 0,
        neutralBuildingPhase: false,
        bonusRoundPlacement: false,
        mainActionUsed: false,
        bonusActions: [],
        canBuyLandscape: true,
        unusableBuildings: [],
        usableBuildings: [],
        nextUse: NextUseClergy.Any,
      },
      config: {
        country: 'france',
        players: 3,
        length: 'long',
      },
      rondel: {
        pointingBefore: 0,
      },
      wonders: 0,
      players: [{ ...p0 }, { ...p0 }, { ...p0 }],
      buildings: [],
      plotPurchasePrices: [1, 1, 1, 1, 1, 1],
      districtPurchasePrices: [],
    }

    it('goes through a happy path', () => {
      const s1 = stoneMerchant('ShShCo')(s0)! as GameStatePlaying
      expect(s1.players[0]).toMatchObject({
        sheep: 8,
        coal: 9,
        stone: 12,
      })
    })

    it('does not give energy change', () => {
      const s1 = stoneMerchant('ShCo')(s0)! as GameStatePlaying
      expect(s1.players[0]).toMatchObject({
        wood: 10,
        sheep: 9,
        coal: 9,
        stone: 11,
      })
    })
    it('does not give food change', () => {
      const s1 = stoneMerchant('GnCo')(s0)! as GameStatePlaying
      expect(s1.players[0]).toMatchObject({
        wood: 10,
        grain: 9,
        coal: 9,
        stone: 10, // not even 2 food, gives you zero stone
      })
    })

    it('can be used up to 5 times', () => {
      const s1 = stoneMerchant('ShShShShShWoWoWoWoWo')(s0)! as GameStatePlaying
      expect(s1.players[0]).toMatchObject({
        sheep: 5,
        wood: 5,
        stone: 15,
      })
    })

    it('max output is 5, but still consumes everything', () => {
      const s1 = stoneMerchant('ShShShShShShShWoWoWoWoWoWoWo')(s0)! as GameStatePlaying
      expect(s1.players[0]).toMatchObject({
        sheep: 3,
        wood: 3,
        stone: 15,
      })
    })

    it('does not consume what it doesnt have', () => {
      const s1 = {
        ...s0,
        players: [{ ...s0.players[0], sheep: 0, wood: 0, stone: 0 }, ...s0.players.slice(1)],
      }
      const s2 = stoneMerchant('ShWo')(s1)! as GameStatePlaying
      expect(s2).toBeUndefined()
    })
  })
})

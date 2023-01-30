import { initialState } from '../../reducer'
import {
  GameStatePlaying,
  GameStatusEnum,
  NextUseClergy,
  PlayerColor,
  SettlementRound,
  Tableau,
  Tile,
} from '../../types'
import { grapevine } from '../grapevine'
import { townEstate } from '../townEstate'

describe('buildings/grapevine', () => {
  describe('grapevine', () => {
    const p0: Tableau = {
      color: PlayerColor.Blue,
      clergy: [],
      settlements: [],
      landscape: [
        [[], [], ['P'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['P'], [], []],
        [[], [], ['P'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['P'], [], []],
      ] as Tile[][],
      landscapeOffset: 0,
      peat: 0,
      penny: 0,
      clay: 0,
      wood: 0,
      grain: 0,
      sheep: 0,
      stone: 0,
      flour: 0,
      grape: 0,
      nickel: 0,
      hops: 0,
      coal: 0,
      book: 0,
      pottery: 3,
      whiskey: 0,
      straw: 0,
      meat: 0,
      ornament: 0,
      bread: 0,
      wine: 0,
      beer: 0,
      reliquary: 0,
    }
    const s0: GameStatePlaying = {
      ...initialState,
      status: GameStatusEnum.PLAYING,
      activePlayerIndex: 0,
      config: {
        country: 'france',
        players: 3,
        length: 'long',
      },
      rondel: {
        pointingBefore: 3,
        grape: 1,
        joker: 2,
      },
      players: [{ ...p0 }, { ...p0 }, { ...p0 }],
      settling: false,
      extraRound: false,
      moveInRound: 1,
      round: 1,
      startingPlayer: 1,
      settlementRound: SettlementRound.S,
      buildings: [],
      nextUse: NextUseClergy.Any,
      canBuyLandscape: true,
      plotPurchasePrices: [1, 1, 1, 1, 1, 1],
      districtPurchasePrices: [],
      neutralBuildingPhase: false,
    }

    it('can convert pottery', () => {
      const s1 = townEstate('Po')(s0)!
      expect(s1.players[0]).toMatchObject({
        pottery: 2,
        nickel: 2,
        penny: 2,
      })
    })

    it('allows noop', () => {
      const s1 = townEstate()(s0)!
      expect(s1.players[0]).toMatchObject({
        pottery: 3,
        nickel: 0,
        penny: 0,
      })
    })

    it('does not upchange', () => {
      const s1 = { ...s0, players: [{ ...s0.players[0], pottery: 3, penny: 3, nickel: 0 }, ...s0.players.slice(1)] }
      const s2 = townEstate('Po')(s1)!
      expect(s2.players[0]).toMatchObject({
        pottery: 2,
        nickel: 2,
        penny: 5,
      })
    })

    it('retains undefined state', () => {
      const s1 = townEstate('Po')(undefined)!
      expect(s1).toBeUndefined()
    })
  })
})

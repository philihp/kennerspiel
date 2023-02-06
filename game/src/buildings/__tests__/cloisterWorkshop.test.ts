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
import { cloisterWorkshop } from '../cloisterWorkshop'

describe('buildings/cloisterWorkshop', () => {
  describe('cloisterWorkshop', () => {
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
      peat: 0,
      penny: 0,
      clay: 10,
      wood: 0,
      grain: 0,
      sheep: 0,
      stone: 10,
      flour: 0,
      grape: 0,
      nickel: 0,
      hops: 0,
      coal: 10,
      book: 0,
      pottery: 0,
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
      turn: {
        activePlayerIndex: 0,
        settling: false,
        extraRound: false,
        moveInRound: 1,
        round: 1,
        startingPlayer: 1,
        settlementRound: SettlementRound.S,
        nextUse: NextUseClergy.Any,
        canBuyLandscape: true,
        neutralBuildingPhase: false,
        mainActionUsed: false,
        bonusActions: [],
      },
    }

    it('goes through a happy path', () => {
      const s1 = cloisterWorkshop('ClClClCoCoSn')(s0)! as GameStatePlaying
      expect(s1.players[0]).toMatchObject({
        pottery: 3,
        ornament: 1,
        clay: 7,
        stone: 9,
        coal: 8,
      })
    })

    it('eats all the energy', () => {
      const s1 = cloisterWorkshop('CoSn')(s0)! as GameStatePlaying
      expect(s1.players[0]).toMatchObject({
        pottery: 0,
        ornament: 1,
        clay: 10,
        stone: 9,
        coal: 9,
      })
    })
  })
})

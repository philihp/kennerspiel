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
import { cloisterLibrary } from '../cloisterLibrary'

describe('buildings/cloisterLibrary', () => {
  describe('cloisterLibrary', () => {
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
      penny: 10,
      clay: 0,
      wood: 0,
      grain: 0,
      sheep: 0,
      stone: 0,
      flour: 0,
      grape: 0,
      nickel: 1,
      malt: 0,
      coal: 0,
      book: 10,
      ceramic: 0,
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
    }

    it('supports a noop with empty strings', () => {
      const s1 = cloisterLibrary('', '')(s0)! as GameStatePlaying
      expect(s1.players[0]).toMatchObject({
        penny: 10,
        book: 10,
        meat: 0,
        wine: 0,
      })
    })

    it('supports a noop with no params', () => {
      const s1 = cloisterLibrary()(s0)! as GameStatePlaying
      expect(s1.players[0]).toMatchObject({
        penny: 10,
        book: 10,
        meat: 0,
        wine: 0,
      })
    })

    it('goes through a happy path', () => {
      const s1 = cloisterLibrary('PnPnPn', 'Bo')(s0)! as GameStatePlaying
      expect(s1.players[0]).toMatchObject({
        penny: 7,
        book: 12,
        meat: 1,
        wine: 1,
      })
    })

    it('might only consume books', () => {
      const s1 = cloisterLibrary('', 'Bo')(s0)! as GameStatePlaying
      expect(s1.players[0]).toMatchObject({
        penny: 10,
        book: 9,
        meat: 1,
        wine: 1,
      })
    })

    it('maybe only makes books', () => {
      const s1 = cloisterLibrary('PnPn', '')(s0)! as GameStatePlaying
      expect(s1.players[0]).toMatchObject({
        penny: 8,
        book: 12,
        meat: 0,
        wine: 0,
      })
    })

    it('can consume a nickel instead', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            nickel: 1,
            penny: 0,
            book: 0,
          },
          ...s0.players.slice(1),
        ],
      }
      const s2 = cloisterLibrary('Ni', '')(s1)! as GameStatePlaying
      expect(s2.players[0]).toMatchObject({
        nickel: 0,
        penny: 0,
        book: 3,
        meat: 0,
        wine: 0,
      })
    })

    it('can make meat out of wine', () => {
      const s1 = {
        ...s0,
        players: [{ ...s0.players[0], nickel: 0, penny: 0, wine: 1, book: 0, meat: 0 }, ...s0.players.slice(1)],
      }
      const s2 = cloisterLibrary('Wn', 'Bo')(s1)! as GameStatePlaying
      expect(s2.players[0]).toMatchObject({
        nickel: 0,
        penny: 0,
        book: 0,
        meat: 1,
        wine: 1,
      })
    })
  })
})

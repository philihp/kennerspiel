import {
  GameStatePlaying,
  GameStatusEnum,
  NextUseClergy,
  PlayerColor,
  SettlementRound,
  Tableau,
  Tile,
} from '../../types'
import { initialState } from '../../state'
import { brewery } from '..'

describe('buildings/brewery', () => {
  describe('brewery', () => {
    const p0: Tableau = {
      color: PlayerColor.Blue,
      clergy: [],
      settlements: [],
      landscape: [
        [[], [], ['P'], ['P'], ['P'], ['P'], ['P'], [], []],
        [[], [], ['P'], ['P'], ['P'], ['P'], ['P'], [], []],
      ] as Tile[][],
      wonders: 0,
      landscapeOffset: 0,
      peat: 0,
      penny: 0,
      clay: 0,
      wood: 0,
      grain: 0,
      sheep: 0,
      stone: 0,
      malt: 0,
      grape: 0,
      nickel: 0,
      flour: 0,
      coal: 0,
      book: 0,
      ceramic: 0,
      whiskey: 0,
      straw: 0,
      meat: 0,
      ornament: 0,
      beer: 0,
      wine: 0,
      bread: 0,
      reliquary: 0,
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

    it('retains undefined state', () => {
      const s1 = brewery()(undefined)
      expect(s1).toBeUndefined()
    })
    it('fails if you give it more malt than energy', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            grain: 10,
            malt: 10,
            wood: 10,
            beer: 10,
          },
          ...s0.players.slice(1),
        ],
      }
      const s2 = brewery('WoHoHoHo')(s1)!
      expect(s2).toBeUndefined()
    })
    it('brews beer using wood, then converts to coins', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            grain: 10,
            malt: 10,
            wood: 10,
            beer: 10,
          },
          ...s0.players.slice(1),
        ],
      }
      const s2 = brewery('WoHoHoBeBe')(s1)!
      expect(s2.players[0]).toMatchObject({
        grain: 10,
        malt: 8,
        wood: 9,
        beer: 10,
        penny: 3,
        nickel: 1,
      })
    })
    it('brews beer using wood with partial coin conversion', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            grain: 10,
            malt: 10,
            wood: 10,
            beer: 10,
          },
          ...s0.players.slice(1),
        ],
      }
      const s2 = brewery('WoHoHoBeBe')(s1)!
      const s3 = brewery('WoHoHoBe')(s2)!
      expect(s3.players[0]).toMatchObject({
        malt: 6,
        wood: 8,
        beer: 11,
        nickel: 1,
        penny: 7,
      })
    })
    it('brews beer using wood with no coin conversion', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            grain: 10,
            malt: 10,
            wood: 10,
            beer: 10,
          },
          ...s0.players.slice(1),
        ],
      }
      const s2 = brewery('WoHoHoBeBe')(s1)!
      expect(s2.players[0]).toMatchObject({
        grain: 10,
        malt: 8,
        wood: 9,
        beer: 10,
        penny: 3,
        nickel: 1,
      })
      const s3 = brewery('WoHoHo')(s2)!
      expect(s3.players[0]).toMatchObject({
        malt: 6,
        wood: 8,
        beer: 12,
        nickel: 1,
        penny: 3,
      })
    })
    it('brewing beer with wood, rounds down on half usage', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            grain: 10,
            malt: 10,
            wood: 10,
            beer: 10,
          },
          ...s0.players.slice(1),
        ],
      }
      const s2 = brewery('WoHoHoBeBe')(s1)!
      expect(s2.players[0]).toMatchObject({
        grain: 10,
        malt: 8,
        wood: 9,
        beer: 10,
        penny: 3,
        nickel: 1,
      })
      const s3 = brewery('WoHo')(s2)!
      expect(s3.players[0]).toMatchObject({
        beer: 11,
        malt: 7,
        nickel: 1,
        penny: 3,
        wood: 8,
      })
    })
    it('allows using just to sell beer without brewing', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            grain: 10,
            malt: 10,
            wood: 10,
            beer: 10,
          },
          ...s0.players.slice(1),
        ],
      }
      const s2 = brewery('BeBe')(s1)!
      expect(s2.players[0]).toMatchObject({
        grain: 10,
        malt: 10,
        wood: 10,
        beer: 8,
        nickel: 1,
        penny: 3,
      })
    })
    it('can brew one beer, but sell two if already had one', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            grain: 10,
            malt: 10,
            wood: 10,
            beer: 10,
          },
          ...s0.players.slice(1),
        ],
      }
      const s2 = brewery('WoHoBeBe')(s1)!
      expect(s2.players[0]).toMatchObject({
        grain: 10,
        malt: 9,
        wood: 9,
        beer: 9,
        nickel: 1,
        penny: 3,
      })
    })
    it('does not allow selling beer you dont have and arent making', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            grain: 10,
            malt: 10,
            wood: 10,
            beer: 0,
          },
          ...s0.players.slice(1),
        ],
      }
      const s2 = brewery('BeBe')(s1)!
      expect(s2).toBeUndefined()
    })
  })
})

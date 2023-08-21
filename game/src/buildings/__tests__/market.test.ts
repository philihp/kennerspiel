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
import { complete, market } from '../market'

describe('buildings/market', () => {
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
    flour: 0,
    grape: 0,
    nickel: 0,
    malt: 0,
    coal: 0,
    book: 0,
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
    frame: {
      round: 1,
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

  describe('market', () => {
    it('goes through a happy path', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            straw: 1,
            clay: 1,
            peat: 1,
            penny: 1,
          },
          ...s0.players.slice(1),
        ],
      }
      const s2 = market('SwClPtPn')(s1)!
      expect(s2.players[0]).toMatchObject({
        straw: 0,
        clay: 0,
        peat: 0,
        penny: 2,
        nickel: 1,
        bread: 1,
      })
    })

    it('allows a noop', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            straw: 1,
            clay: 1,
            peat: 1,
            penny: 1,
          },
          ...s0.players.slice(1),
        ],
      }
      const s2 = market('')(s1)!
      expect(s2.players[0]).toMatchObject({
        straw: 1,
        clay: 1,
        peat: 1,
        penny: 1,
        bread: 0,
      })
    })

    it('fails if given 3 different things', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            straw: 1,
            clay: 1,
            penny: 2,
          },
          ...s0.players.slice(1),
        ],
      }
      const s2 = market('SwClPnPn')(s1)!
      expect(s2).toBeUndefined()
    })
  })

  describe('complete', () => {
    it('gives 5 options for 4 things, with 5 different things,', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            peat: 1,
            penny: 2,
            sheep: 1,
            clay: 1,
            wood: 5,
          },
          ...s0.players.slice(1),
        ],
      }
      const c0 = complete([])(s1)
      expect(c0).toStrictEqual(['PtPnClWo', 'PtPnClSh', 'PtPnWoSh', 'PtClWoSh', 'PnClWoSh', ''])
    })
    it('gives 1 option for 4 things, with 4 different things,', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            peat: 1,
            penny: 2,
            sheep: 1,
            wood: 5,
          },
          ...s0.players.slice(1),
        ],
      }
      const c0 = complete([])(s1)
      expect(c0).toStrictEqual(['PtPnWoSh', ''])
    })
    it('gives 0 option for 4 things, with 3 different things,', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            peat: 1,
            penny: 2,
            sheep: 1,
          },
          ...s0.players.slice(1),
        ],
      }
      const c0 = complete([])(s1)
      expect(c0).toStrictEqual([''])
    })
  })
})

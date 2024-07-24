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
import { complete, spinningMill } from '../spinningMill'

describe('buildings/spinningMill', () => {
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
    plotPurchasePrices: [],
    districtPurchasePrices: [],
  }
  describe('spinningMill', () => {
    it('maintains an undefined state', () => {
      const s1 = spinningMill()(undefined)!
      expect(s1).toBeUndefined()
    })

    it('gives no coins if no sheep', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            sheep: 0,
          },
          s0.players.slice(1),
        ],
      } as GameStatePlaying
      const s2 = spinningMill()(s1)!
      expect(s2.players[0]).toMatchObject({
        penny: 0,
      })
    })
    it('gives 3 coin if 1 sheep', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            sheep: 1,
          },
          s0.players.slice(1),
        ],
      } as GameStatePlaying
      const s2 = spinningMill()(s1)!
      expect(s2.players[0]).toMatchObject({
        penny: 3,
      })
    })
    it('gives 3 coin if 2 sheep', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            sheep: 2,
          },
          s0.players.slice(1),
        ],
      } as GameStatePlaying
      const s2 = spinningMill()(s1)!
      expect(s2.players[0]).toMatchObject({
        penny: 3,
      })
    })
    it('gives 3 coin if 4 sheep', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            sheep: 4,
          },
          s0.players.slice(1),
        ],
      } as GameStatePlaying
      const s2 = spinningMill()(s1)!
      expect(s2.players[0]).toMatchObject({
        penny: 3,
      })
    })
    it('gives 5 coin if 5 sheep', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            sheep: 5,
          },
          s0.players.slice(1),
        ],
      } as GameStatePlaying
      const s2 = spinningMill()(s1)!
      expect(s2.players[0]).toMatchObject({
        penny: 5,
      })
    })
    it('gives 5 coin if 6 sheep', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            sheep: 6,
          },
          s0.players.slice(1),
        ],
      } as GameStatePlaying
      const s2 = spinningMill()(s1)!
      expect(s2.players[0]).toMatchObject({
        penny: 5,
      })
    })
    it('gives 5 coin if 8 sheep', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            sheep: 8,
          },
          s0.players.slice(1),
        ],
      } as GameStatePlaying
      const s2 = spinningMill()(s1)!
      expect(s2.players[0]).toMatchObject({
        penny: 5,
      })
    })
    it('gives 6 coin if 9 sheep', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            sheep: 9,
          },
          s0.players.slice(1),
        ],
      } as GameStatePlaying
      const s2 = spinningMill()(s1)!
      expect(s2.players[0]).toMatchObject({
        penny: 6,
      })
    })
    it('gives 6 coin if 10 sheep', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            sheep: 10,
          },
          s0.players.slice(1),
        ],
      } as GameStatePlaying
      const s2 = spinningMill()(s1)!
      expect(s2.players[0]).toMatchObject({
        penny: 6,
      })
    })
  })

  describe('complete', () => {
    it('takes no parameters', () => {
      const c0 = complete([])(s0)
      expect(c0).toStrictEqual([''])
    })
    it('does not complete anything with a param', () => {
      const c0 = complete([''])(s0)
      expect(c0).toStrictEqual([])
    })
  })
})

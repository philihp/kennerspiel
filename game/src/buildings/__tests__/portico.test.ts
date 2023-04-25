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
import { portico, complete } from '../portico'

describe('buildings/portico', () => {
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
    reliquary: 10,
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

  describe('portico', () => {
    it('retains undefined state', () => {
      const s0: GameStatePlaying | undefined = undefined
      const s1 = portico()(s0)
      expect(s1).toBeUndefined()
    })
    it('allows using with no input', () => {
      const s0: GameStatePlaying | undefined = undefined
      const s1 = portico()(s0)
      expect(s0).toBe(s1)
    })
    it('allows using with empty string', () => {
      const s0: GameStatePlaying | undefined = undefined
      const s1 = portico('')(s0)
      expect(s0).toBe(s1)
    })
    it('turns grain into malt and straw', () => {
      const s1 = portico('Rq')(s0)! as GameStatePlaying
      expect(s1.players[0]).toMatchObject({
        reliquary: 9,
        stone: 2,
        clay: 2,
        wood: 2,
        peat: 2,
        penny: 2,
        grain: 2,
        sheep: 2,
      })
    })
  })

  describe('complete', () => {
    it('gives the option of Rq if player has a reliquary', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            reliquary: 2,
          },
          ...s0.players.slice(1),
        ],
      }
      const c0 = complete([])(s1)
      expect(c0).toStrictEqual(['Rq', ''])
    })
    it('only allows nothing if no reliquaries', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            reliquary: 0,
          },
          ...s0.players.slice(1),
        ],
      }
      const c0 = complete([])(s1)
      expect(c0).toStrictEqual([''])
    })
    it('once it knows, that is it', () => {
      const c0 = complete(['Rq'])(s0)
      expect(c0).toStrictEqual([''])
    })
    it('does not complete anything with a param', () => {
      const c0 = complete(['Rq', 'Rq'])(s0)
      expect(c0).toStrictEqual([])
    })
  })
})

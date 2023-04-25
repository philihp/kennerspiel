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
import { shipyard, complete } from '../shipyard'

describe('buildings/shipyard', () => {
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
    wood: 10,
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

  describe('shipyard', () => {
    it('allows a noop', () => {
      const s1 = shipyard('')(s0)!
      expect(s1.players[0]).toStrictEqual(s0.players[0])
    })

    it('allows a noop with undefined', () => {
      const s1 = shipyard()(s0)!
      expect(s1.players[0]).toStrictEqual(s0.players[0])
    })

    it('turns two wood into 1 ornament and 1 nickel', () => {
      const s1 = shipyard('WoWo')(s0)! as GameStatePlaying
      expect(s1.players[0]).toMatchObject({
        wood: 8,
        ornament: 1,
        nickel: 1,
      })
    })
  })

  describe('complete', () => {
    it('offers to use wood if they have two', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            wood: 4,
          },
          s0.players.slice(1),
        ],
      } as GameStatePlaying
      const c0 = complete([])(s1)
      expect(c0).toStrictEqual(['WoWo', ''])
    })
    it('only offers noop if theres not enough wood', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            wood: 1,
          },
          s0.players.slice(1),
        ],
      } as GameStatePlaying
      const c0 = complete([])(s1)
      expect(c0).toStrictEqual([''])
    })
    it('complete if given a param', () => {
      const c0 = complete(['WoWo'])(s0)
      expect(c0).toStrictEqual([''])
    })
    it('dont allow complete with two params', () => {
      const c0 = complete(['Wo', 'Wo'])(s0)
      expect(c0).toStrictEqual([])
    })
  })
})

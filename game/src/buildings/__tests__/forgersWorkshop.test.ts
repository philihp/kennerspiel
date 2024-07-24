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
import { forgersWorkshop, complete } from '../forgersWorkshop'

describe('buildings/forgersWorkshop', () => {
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
    nickel: 10,
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
      pointingBefore: 3,
      grape: 1,
      joker: 2,
    },
    wonders: 0,
    players: [{ ...p0 }, { ...p0 }, { ...p0 }],
    buildings: [],
    plotPurchasePrices: [1, 1, 1, 1, 1, 1],
    districtPurchasePrices: [],
  }

  describe('forgersWorkshop', () => {
    it('can do a noop', () => {
      const s1 = forgersWorkshop()(undefined)!
      expect(s1).toBeUndefined()
    })

    it('can do a noop with no input', () => {
      const s1 = forgersWorkshop('')(undefined)!
      expect(s1).toBeUndefined()
    })

    it('can do both things', () => {
      const s1 = forgersWorkshop('NiNiNi')(s0)!
      expect(s1.players[0]).toMatchObject({
        reliquary: 2,
        nickel: 7,
      })
    })

    it('can do just one', () => {
      const s1 = forgersWorkshop('Ni')(s0)!
      expect(s1.players[0]).toMatchObject({
        reliquary: 1,
        nickel: 9,
      })
    })

    it('can do it 4 times', () => {
      const s1 = forgersWorkshop('NiNiNiNiNiNiNi')(s0)!
      expect(s1.players[0]).toMatchObject({
        reliquary: 4,
        nickel: 3,
      })
    })
  })

  describe('complete', () => {
    it('allows usage at 5 or 15', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            nickel: 4,
          },
          s0.players.slice(1),
        ],
      } as GameStatePlaying
      const c0 = complete([])(s1)
      expect(c0).toStrictEqual(['NiNiNi', 'Ni', ''])
    })
    it('allows mixed inputs', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            nickel: 2,
            whiskey: 2,
            penny: 3,
          },
          s0.players.slice(1),
        ],
      } as GameStatePlaying
      const c0 = complete([])(s1)
      expect(c0).toStrictEqual([
        'NiNiPnWhWh',
        'NiNiPnPnWhWh',
        'NiNiPnPnPnWh',
        'Ni',
        'PnWhWh',
        'PnPnWhWh',
        'PnPnPnWh',
        '',
      ])
    })
    it('allows noop if not enough input', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            nickel: 0,
          },
          s0.players.slice(1),
        ],
      } as GameStatePlaying
      const c0 = complete([])(s1)
      expect(c0).toStrictEqual([''])
    })
    it('can only pay with 1 nickel', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            nickel: 2,
          },
          s0.players.slice(1),
        ],
      } as GameStatePlaying
      const c0 = complete([])(s1)
      expect(c0).toStrictEqual(['Ni', ''])
    })
    it('finish command after 1 param', () => {
      const s1 = {
        ...s0,
      } as GameStatePlaying
      const c0 = complete(['NiNiNi'])(s1)
      expect(c0).toStrictEqual([''])
    })
    it('ignores more than one param', () => {
      const s1 = {
        ...s0,
      } as GameStatePlaying
      const c0 = complete(['Or', 'Bo'])(s1)
      expect(c0).toStrictEqual([])
    })
  })
})

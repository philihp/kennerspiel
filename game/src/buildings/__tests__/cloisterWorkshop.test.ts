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
import { cloisterWorkshop, complete } from '../cloisterWorkshop'

describe('buildings/cloisterWorkshop', () => {
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
    malt: 0,
    coal: 10,
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
  }
  describe('cloisterWorkshop', () => {
    it('allows noop with null', () => {
      const s1 = cloisterWorkshop()(s0)! as GameStatePlaying
      expect(s1.players[0]).toMatchObject({
        ceramic: 0,
        ornament: 0,
        clay: 10,
        stone: 10,
        coal: 10,
      })
    })

    it('allows noop with empty string', () => {
      const s1 = cloisterWorkshop('')(s0)! as GameStatePlaying
      expect(s1.players[0]).toMatchObject({
        ceramic: 0,
        ornament: 0,
        clay: 10,
        stone: 10,
        coal: 10,
      })
    })

    it('plenty of coal, make three ceramic and 1 ornament', () => {
      const s1 = cloisterWorkshop('ClClClSnCoCoCoCo')(s0)! as GameStatePlaying
      expect(s1.players[0]).toMatchObject({
        ceramic: 3,
        ornament: 1,
        clay: 7,
        stone: 9,
        coal: 6,
      })
    })

    it('when abundant clay/stone, prefer to make an ornament', () => {
      const s1 = cloisterWorkshop('ClClClSnCo')(s0)! as GameStatePlaying
      expect(s1.players[0]).toMatchObject({
        ceramic: 2,
        ornament: 1,
        clay: 7, // but still everything it is given is consumed
        stone: 9,
        coal: 9,
      })
    })

    it('eats all the energy', () => {
      const s1 = cloisterWorkshop('CoSn')(s0)! as GameStatePlaying
      expect(s1.players[0]).toMatchObject({
        ceramic: 0,
        ornament: 1,
        clay: 10,
        stone: 9,
        coal: 9,
      })
    })

    it('can be used for only ceramic', () => {
      const s1 = cloisterWorkshop('CoClCl')(s0)! as GameStatePlaying
      expect(s1.players[0]).toMatchObject({
        ceramic: 2,
        ornament: 0,
        clay: 8,
        stone: 10,
        coal: 9,
      })
    })
  })

  describe('complete', () => {
    it('when no energy, only noop', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            clay: 2,
            stone: 1,
            coal: 0,
          },
          s0.players.slice(1),
        ],
      } as GameStatePlaying
      const c0 = complete([])(s1)
      expect(c0).toStrictEqual([''])
    })
    it('can only do one stone', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            clay: 0,
            stone: 2,
            coal: 1,
            wood: 1,
          },
          s0.players.slice(1),
        ],
      } as GameStatePlaying
      const c0 = complete([])(s1)
      expect(c0).toStrictEqual(['SnCo', 'SnWo', ''])
    })
    it('can do up to 3 clay', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            clay: 5,
            stone: 0,
            coal: 1,
            wood: 1,
          },
          s0.players.slice(1),
        ],
      } as GameStatePlaying
      const c0 = complete([])(s1)
      expect(c0).toStrictEqual(['ClClClCo', 'ClClCo', 'ClCo', 'ClWo', ''])
    })
    it('can do a mix of clay and stone', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            clay: 5,
            stone: 3,
            coal: 1,
            wood: 3,
          },
          s0.players.slice(1),
        ],
      } as GameStatePlaying
      const c0 = complete([])(s1)
      expect(c0).toStrictEqual([
        'ClClClSnCoWo',
        'ClClClCo',
        'ClClClWoWoWo',
        'ClClSnCo',
        'ClClSnWoWoWo',
        'ClClCo',
        'ClClWoWo',
        'ClSnCo',
        'ClSnWoWo',
        'ClCo',
        'ClWo',
        'SnCo',
        'SnWo',
        '',
      ])
    })
    it('complete if given a param', () => {
      const c0 = complete(['ClSnPt'])(s0)
      expect(c0).toStrictEqual([''])
    })
    it('dont allow complete with two params', () => {
      const c0 = complete(['ClWo', 'SnWo'])(s0)
      expect(c0).toStrictEqual([])
    })
  })
})

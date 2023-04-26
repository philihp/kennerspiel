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
import { estate, complete } from '../estate'

describe('buildings/estate', () => {
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
    coal: 10,
    book: 0,
    ceramic: 3,
    whiskey: 0,
    straw: 0,
    meat: 10,
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
      pointingBefore: 3,
      grape: 1,
      joker: 2,
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

  describe('use', () => {
    it('retains undefined state', () => {
      const s1 = estate('')(undefined)!
      expect(s1).toBeUndefined()
    })

    it('allows noop', () => {
      const s1 = estate()(s0)!
      expect(s1.players[0]).toMatchObject({
        book: 0,
        ornament: 0,
        meat: 10,
        coal: 10,
      })
    })

    it('can convert 10 food', () => {
      const s1 = estate('MtMt')(s0)!
      expect(s1.players[0]).toMatchObject({
        book: 1,
        ornament: 1,
        meat: 8,
        coal: 10,
      })
    })
    it('can convert 15 food and just loses the extra', () => {
      const s1 = estate('MtMtMt')(s0)!
      expect(s1.players[0]).toMatchObject({
        book: 1,
        ornament: 1,
        meat: 7,
        coal: 10,
      })
    })
    it('can convert 20 food', () => {
      const s1 = estate('MtMtMtMt')(s0)!
      expect(s1.players[0]).toMatchObject({
        book: 2,
        ornament: 2,
        meat: 6,
        coal: 10,
      })
    })

    it('can convert 10 food and 6 energy', () => {
      const s1 = estate('MtMtCoCo')(s0)!
      expect(s1.players[0]).toMatchObject({
        book: 2,
        ornament: 2,
        meat: 8,
        coal: 8,
      })
    })

    it('can convert 6 energy', () => {
      const s1 = estate('CoCo')(s0)!
      expect(s1.players[0]).toMatchObject({
        book: 1,
        ornament: 1,
        meat: 10,
        coal: 8,
      })
    })
    it('can convert 12 energy', () => {
      const s1 = estate('CoCoCoCo')(s0)!
      expect(s1.players[0]).toMatchObject({
        book: 2,
        ornament: 2,
        meat: 10,
        coal: 6,
      })
    })
  })

  describe('complete', () => {
    it('shows multiple ways of arranging for 12 fuel', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            coal: 4,
            peat: 6,
            wood: 1,
            meat: 2,
            sheep: 5,
          },
          s0.players.slice(1),
        ],
      } as GameStatePlaying
      const c0 = complete([], s1)
      expect(c0).toStrictEqual([
        // ways of doing 12 fuel
        'CoCoCoCo',
        'PtPtPtPtPtPt',
        'CoPtPtPtPtPt',
        'CoCoPtPtPt',
        'CoCoCoPtPt',
        'CoPtPtPtPtWo', // this one surprised me
        'CoCoCoPtWo',
        // ways of doing 6 fuel 10 food
        'CoCoMtMt',
        'CoCoShShShShSh',
        'CoCoMtShShSh', // also surprised, yeah you could do 11 food i guess
        'PtPtPtMtMt',
        'PtPtPtShShShShSh',
        'PtPtPtMtShShSh',
        'CoPtPtMtMt', // also surprised, sure spend 7 fuel
        'CoPtPtShShShShSh',
        'CoPtPtMtShShSh',
        'CoPtWoMtMt',
        'CoPtWoShShShShSh',
        'CoPtWoMtShShSh',
        // ways of doing 20 food
        'MtMtShShShShSh',
        // just 6 energy
        'CoCo',
        'PtPtPt',
        'CoPtPt',
        'CoPtWo',
        // just 10 food
        'MtMt',
        'ShShShShSh',
        'MtShShSh',
      ])
    })

    it('only allows completion if one param', () => {
      const c0 = complete(['CoCoMtMt'])(s0)
      expect(c0).toStrictEqual([''])
    })
    it('returns [] on more than one param', () => {
      const c0 = complete(['CoCo', 'MtMt'])(s0)
      expect(c0).toStrictEqual([])
    })
  })
})

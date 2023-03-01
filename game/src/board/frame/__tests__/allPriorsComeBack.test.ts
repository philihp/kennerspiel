import { initialState } from '../../../state'
import {
  Clergy,
  GameStatePlaying,
  GameStatusEnum,
  NextUseClergy,
  PlayerColor,
  SettlementRound,
  Tableau,
  Tile,
} from '../../../types'
import { allPriorsComeBack } from '../allPriorsComeBack'

describe('board/frame/allPriorsComeBack', () => {
  const p0: Tableau = {
    color: PlayerColor.Blue,
    clergy: ['LB1B', 'LB2B', 'PRIB'] as Clergy[],
    settlements: [],
    landscape: [
      [[], [], ['P'], ['P'], ['P'], ['P'], ['P'], [], []],
      [[], [], ['P'], ['P'], ['P'], ['P'], ['P'], [], []],
    ] as Tile[][],
    wonders: 0,
    landscapeOffset: 0,
    peat: 0,
    penny: 100,
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

  it('retains undefined state', () => {
    const s1 = allPriorsComeBack(undefined)!
    expect(s1).toBeUndefined()
  })

  it('returns all priors for all players', () => {
    const s1 = {
      ...s0,
      players: [
        {
          ...s0.players[0],
          color: PlayerColor.Red,
          clergy: ['LB1R', 'LB2R'],
          landscape: [
            [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['P', 'G06', 'PRIR'], ['H', 'LR1'], [], []],
            [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LR2'], ['P'], ['P', 'LR3'], [], []],
          ] as Tile[][],
          landscapeOffset: 0,
        },

        {
          ...s0.players[0],
          color: PlayerColor.Green,
          clergy: ['LB2G'],
          landscape: [
            [['W'], ['C'], [], [], [], [], [], [], []],
            [['W'], ['C'], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['H', 'LR1'], [], []],
            [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LR2'], ['P', 'G01', 'PRIG'], ['P', 'LR3', 'LB1G'], [], []],
          ] as Tile[][],
          landscapeOffset: 1,
        },

        {
          ...s0.players[0],
          color: PlayerColor.Blue,
          clergy: ['LB2B'],
          landscape: [
            [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['H', 'LR1', 'LB1B'], [], []],
            [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LR2'], ['P', 'G13', 'PRIB'], ['P', 'LR3'], [], []],
          ] as Tile[][],
          landscapeOffset: 0,
        },
      ],
    } as GameStatePlaying
    const s2 = allPriorsComeBack(s1)!
    expect(s2.players[0].clergy).toContain('PRIR')
    expect(s2.players[1].clergy).toContain('PRIG')
    expect(s2.players[2].clergy).toContain('PRIB')
  })

  it('returns all priors if some players dont have them out', () => {
    const s1 = {
      ...s0,
      players: [
        {
          ...s0.players[0],
          color: PlayerColor.Red,
          clergy: ['LB1R', 'LB2R', 'PRIR'],
          landscape: [
            [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['P', 'G06'], ['H', 'LR1'], [], []],
            [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LR2'], ['P'], ['P', 'LR3'], [], []],
          ] as Tile[][],
          landscapeOffset: 0,
        },

        {
          ...s0.players[0],
          color: PlayerColor.Green,
          clergy: ['LB2G'],
          landscape: [
            [['W'], ['C'], [], [], [], [], [], [], []],
            [['W'], ['C'], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['H', 'LR1'], [], []],
            [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LR2'], ['P', 'G01', 'PRIG'], ['P', 'LR3', 'LB1G'], [], []],
          ] as Tile[][],
          landscapeOffset: 1,
        },

        {
          ...s0.players[0],
          color: PlayerColor.Blue,
          clergy: ['LB2B'],
          landscape: [
            [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['H', 'LR1', 'LB1B'], [], []],
            [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LR2'], ['P', 'G13', 'PRIB'], ['P', 'LR3'], [], []],
          ] as Tile[][],
          landscapeOffset: 0,
        },
      ],
    } as GameStatePlaying
    const s2 = allPriorsComeBack(s1)!
    expect(s2.players[0]).toBe(s1.players[0]) // keep the same object because nothing changed
    expect(s2.players[0].clergy).toContain('PRIR')
    expect(s2.players[1]).not.toBe(s1.players[1])
    expect(s2.players[1].clergy).toContain('PRIG')
    expect(s2.players[2]).not.toBe(s1.players[2])
    expect(s2.players[2].clergy).toContain('PRIB')
  })

  it('keeps previous state if nothing changed', () => {
    const s1 = allPriorsComeBack(s0)!
    expect(s1.players).toBe(s0.players)
  })
})

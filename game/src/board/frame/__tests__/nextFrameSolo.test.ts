import { assocPath } from 'ramda'
import { control } from '../../../control'
import { Frame, GameCommandConfigParams, GameStatePlaying, GameStatusEnum, PlayerColor, Tableau } from '../../../types'
import { nextFrame } from '../../frame'
import { initialState } from '../../..'
import { nextFrameSolo } from '../nextFrameSolo'
import { returnClergyIfPlaced } from '../returnClergyIfPlaced'

describe('board/frame/nextFrameSolo', () => {
  const c1 = {
    country: 'france',
    players: 1,
    length: 'short',
  } as GameCommandConfigParams
  const p0: Tableau = {
    color: PlayerColor.Red,
    clergy: [],
    landscape: [[]],
    landscapeOffset: 0,
    settlements: [],
    wonders: 0,
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
  const s1: GameStatePlaying = {
    ...initialState,
    status: GameStatusEnum.PLAYING,
    config: c1,
    rondel: {
      pointingBefore: 0,
    },
    wonders: 0,
    players: [p0, p0] as Tableau[],
    buildings: ['G01'],
    plotPurchasePrices: [],
    districtPurchasePrices: [],
    frame: {
      activePlayerIndex: 0,
      round: 1,
      next: 2,
    } as Frame,
  } as GameStatePlaying

  it('gives a nice flow', () => {
    const s2 = control(s1, ['CONVERT'])
    expect(s2.flow.map(({ round, player, bonus, settle }) => [round, player, bonus, settle])).toStrictEqual([
      [1, 'R', false, false],
      [1, 'R', false, false],
      [2, 'R', false, false],
      [2, 'R', false, false],
      [3, 'R', false, false],
      [3, 'R', false, false],
      [4, 'R', false, false],
      [4, 'R', false, false],
      [5, 'R', false, false],
      [5, 'R', false, false],
      [6, 'R', false, false],
      [6, 'R', false, false],
      [7, 'R', false, false],
      [7, 'R', false, false],
      [8, 'R', false, false],
      [8, 'R', false, false],
      [9, 'R', false, false],
      [9, 'R', false, false],
      [10, 'R', false, false],
      [10, 'R', false, false],
      [11, 'R', false, false],
      [11, 'R', false, false],
      [11, 'R', false, true],
      [12, 'R', false, false],
      [12, 'R', false, false],
      [13, 'R', false, false],
      [13, 'R', false, false],
      [14, 'R', false, false],
      [14, 'R', false, false],
      [15, 'R', false, false],
      [15, 'R', false, false],
      [15, 'R', false, true],
      [16, 'R', false, false],
      [16, 'R', false, false],
      [17, 'R', false, false],
      [17, 'R', false, false],
      [18, 'R', false, false],
      [18, 'R', false, false],
      [19, 'R', false, false],
      [19, 'R', false, false],
      [20, 'R', false, false],
      [20, 'R', false, false],
      [21, 'R', false, false],
      [21, 'R', false, false],
      [21, 'R', false, true],
      [22, 'R', false, false],
      [22, 'R', false, false],
      [23, 'R', false, false],
      [23, 'R', false, false],
      [24, 'R', false, false],
      [24, 'R', false, false],
      [25, 'R', false, false],
      [25, 'R', false, false],
      [25, 'R', false, true],
      [25, 'R', false, false],
      [25, 'R', false, false],
      [26, 'R', false, false],
      [26, 'R', false, false],
      [27, 'R', false, false],
      [27, 'R', false, false],
      [28, 'R', false, false],
      [28, 'R', false, false],
      [29, 'R', false, false],
      [29, 'R', false, false],
      [30, 'R', false, false],
      [30, 'R', false, false],
    ])
  })
  describe('returning clergy before settlement round', () => {
    const s2 = {
      ...s1,
      players: [
        {
          ...s1.players[0],
          color: PlayerColor.Red,
          landscape: [
            [[], [], ['P'], ['P'], ['P', 'LFO'], ['P'], ['H', 'LR1', 'PRIR'], [], []],
            [[], [], ['P'], ['P'], ['P', 'LR2', 'LB1R'], ['P'], ['H', 'LR3', 'LB2R'], [], []],
          ],
          clergy: [],
        },
        {
          ...s1.players[1],
          color: PlayerColor.Blue,
          landscape: [
            [[], [], ['P'], ['P'], ['P', 'LFO'], ['P'], ['H', 'LB1', 'PRIB'], [], []],
            [[], [], ['P'], ['P'], ['P', 'LB2', 'LB1B'], ['P'], ['H', 'LB3', 'LB2B'], [], []],
          ],
          clergy: [],
        },
      ],
    } as GameStatePlaying

    it('returns clergy home before settlement A', () => {
      const s3 = {
        ...s2,
        frame: {
          ...s2.frame,
          next: 23,
        },
      }
      expect(nextFrameSolo[s3.frame.next].upkeep).toContain(returnClergyIfPlaced)
      const s4 = nextFrame(s3)
      expect(s4).toBeDefined()
      expect(s4!.players[0]).toMatchObject({
        landscape: [
          [[], [], ['P'], ['P'], ['P', 'LFO'], ['P'], ['H', 'LR1'], [], []],
          [[], [], ['P'], ['P'], ['P', 'LR2'], ['P'], ['H', 'LR3'], [], []],
        ],
        clergy: ['LB1R', 'LB2R', 'PRIR'],
      })
      expect(s4!.players[1]).toMatchObject({
        landscape: [
          [[], [], ['P'], ['P'], ['P', 'LFO'], ['P'], ['H', 'LB1'], [], []],
          [[], [], ['P'], ['P'], ['P', 'LB2'], ['P'], ['H', 'LB3'], [], []],
        ],
        clergy: ['LB1B', 'LB2B', 'PRIB'],
      })
    })

    it('returns clergy home before settlement B', () => {
      const s3 = {
        ...s2,
        frame: {
          ...s2.frame,
          next: 32,
        },
      }
      expect(nextFrameSolo[s3.frame.next].upkeep).toContain(returnClergyIfPlaced)
      const s4 = nextFrame(s3)
      expect(s4).toBeDefined()
      expect(s4!.players[0]).toMatchObject({
        landscape: [
          [[], [], ['P'], ['P'], ['P', 'LFO'], ['P'], ['H', 'LR1'], [], []],
          [[], [], ['P'], ['P'], ['P', 'LR2'], ['P'], ['H', 'LR3'], [], []],
        ],
        clergy: ['LB1R', 'LB2R', 'PRIR'],
      })
      expect(s4!.players[1]).toMatchObject({
        landscape: [
          [[], [], ['P'], ['P'], ['P', 'LFO'], ['P'], ['H', 'LB1'], [], []],
          [[], [], ['P'], ['P'], ['P', 'LB2'], ['P'], ['H', 'LB3'], [], []],
        ],
        clergy: ['LB1B', 'LB2B', 'PRIB'],
      })
    })

    it('returns clergy home before settlement C', () => {
      const s3 = {
        ...s2,
        frame: {
          ...s2.frame,
          next: 45,
        },
      }
      expect(nextFrameSolo[s3.frame.next].upkeep).toContain(returnClergyIfPlaced)
      const s4 = nextFrame(s3)
      expect(s4).toBeDefined()
      expect(s4!.players[0]).toMatchObject({
        landscape: [
          [[], [], ['P'], ['P'], ['P', 'LFO'], ['P'], ['H', 'LR1'], [], []],
          [[], [], ['P'], ['P'], ['P', 'LR2'], ['P'], ['H', 'LR3'], [], []],
        ],
        clergy: ['LB1R', 'LB2R', 'PRIR'],
      })
      expect(s4!.players[1]).toMatchObject({
        landscape: [
          [[], [], ['P'], ['P'], ['P', 'LFO'], ['P'], ['H', 'LB1'], [], []],
          [[], [], ['P'], ['P'], ['P', 'LB2'], ['P'], ['H', 'LB3'], [], []],
        ],
        clergy: ['LB1B', 'LB2B', 'PRIB'],
      })
    })

    it('returns clergy home before settlement D', () => {
      const s3 = {
        ...s2,
        frame: {
          ...s2.frame,
          next: 55,
        },
      }
      expect(nextFrameSolo[s3.frame.next].upkeep).toContain(returnClergyIfPlaced)
      const s4 = nextFrame(s3)
      expect(s4).toBeDefined()
      expect(s4!.players[0]).toMatchObject({
        landscape: [
          [[], [], ['P'], ['P'], ['P', 'LFO'], ['P'], ['H', 'LR1'], [], []],
          [[], [], ['P'], ['P'], ['P', 'LR2'], ['P'], ['H', 'LR3'], [], []],
        ],
        clergy: ['LB1R', 'LB2R', 'PRIR'],
      })
      expect(s4!.players[1]).toMatchObject({
        landscape: [
          [[], [], ['P'], ['P'], ['P', 'LFO'], ['P'], ['H', 'LB1'], [], []],
          [[], [], ['P'], ['P'], ['P', 'LB2'], ['P'], ['H', 'LB3'], [], []],
        ],
        clergy: ['LB1B', 'LB2B', 'PRIB'],
      })
    })
  })
})

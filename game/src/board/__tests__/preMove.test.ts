import { config } from '../../commands/config'
import { start } from '../../commands/start'
import { initialState } from '../../reducer'
import {
  Clergy,
  GameConfigCountry,
  GameConfigLength,
  GameConfigPlayers,
  GameState,
  GameStatePlaying,
  GameStateSetup,
  PlayerColor,
} from '../../types'
import { preMove } from '../preMove'

describe('board/preMove', () => {
  it('removes all clergy if all are placed', () => {
    expect.assertions(2)
    const configuration = {
      players: 2 as GameConfigPlayers,
      country: 'ireland' as GameConfigCountry,
      length: 'long' as GameConfigLength,
    }
    const s0 = initialState
    const s1 = config(s0, configuration)! as GameStateSetup
    const s2 = start(s1, { seed: 42, colors: [PlayerColor.Red, PlayerColor.Blue] })! as GameStatePlaying
    const s3: GameStatePlaying = {
      ...s2,
      frame: {
        ...s2.frame,
        moveInRound: 1,
      },
      players: [
        {
          ...s2!.players![0]!,
          clergy: [],
          landscape: [
            [
              s2!.players![0].landscape[0][0],
              s2!.players![0].landscape[0][1],
              s2!.players![0].landscape[0][2],
              s2!.players![0].landscape[0][3],
              [s2!.players![0].landscape[0][4][0], s2!.players![0].landscape[0][4][1], Clergy.LayBrother1B],
              s2!.players![0].landscape[0][5],
              [s2!.players![0].landscape[0][6][0], s2!.players![0].landscape[0][6][1], Clergy.LayBrother1B],
              s2!.players![0].landscape[0][7],
              s2!.players![0].landscape[0][8],
            ],
            [
              s2!.players![0].landscape[1][0],
              s2!.players![0].landscape[1][1],
              s2!.players![0].landscape[1][2],
              s2!.players![0].landscape[1][3],
              s2!.players![0].landscape[1][4],
              s2!.players![0].landscape[1][5],
              [s2!.players![0].landscape[1][6][0], s2!.players![0].landscape[1][6][1], Clergy.PriorB],
              s2!.players![0].landscape[1][7],
              s2!.players![0].landscape[1][8],
            ],
          ],
        },
        {
          ...s2!.players![1],
        },
      ],
    }
    const s4 = preMove(s3)
    expect(s4!.players![0].clergy).toStrictEqual(['LB1B', 'LB2B', 'PRIB'])
    expect(s4!.players![0].landscape).toStrictEqual([
      [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['H', 'LB1'], [], []],
      [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LB2'], ['P'], ['P', 'LB3'], [], []],
    ])
  })

  it('doesnt update anything if clergy still unplaced', () => {
    expect.assertions(4)
    const configuration = {
      players: 2 as GameConfigPlayers,
      country: 'ireland' as GameConfigCountry,
      length: 'long' as GameConfigLength,
    }
    const s0 = initialState
    const s1 = config(s0, configuration)
    const s2 = start(s1!, { seed: 42, colors: [PlayerColor.Red, PlayerColor.Blue] })! as GameStatePlaying
    const s3: GameState = {
      ...s2!,
      frame: {
        ...s2.frame,
        moveInRound: 1,
      },
      players: [
        {
          ...s2!.players![0]!,
          clergy: [Clergy.LayBrother2B],
          landscape: [
            [
              s2!.players![0].landscape[0][0],
              s2!.players![0].landscape[0][1],
              s2!.players![0].landscape[0][2],
              s2!.players![0].landscape[0][3],
              s2!.players![0].landscape[0][4],
              s2!.players![0].landscape[0][5],
              [s2!.players![0].landscape[0][6][0], s2!.players![0].landscape[0][6][1], Clergy.LayBrother1B],
              s2!.players![0].landscape[0][7],
              s2!.players![0].landscape[0][8],
            ],
            [
              s2!.players![0].landscape[1][0],
              s2!.players![0].landscape[1][1],
              s2!.players![0].landscape[1][2],
              s2!.players![0].landscape[1][3],
              s2!.players![0].landscape[1][4],
              s2!.players![0].landscape[1][5],
              [s2!.players![0].landscape[1][6][0], s2!.players![0].landscape[1][6][1], Clergy.PriorB],
              s2!.players![0].landscape[1][7],
              s2!.players![0].landscape[1][8],
            ],
          ],
        },
        {
          ...s2!.players![1],
        },
      ],
    }
    const s4 = preMove(s3!)
    expect(s4!.players![0].clergy).toBe(s3!.players![0].clergy)
    expect(s4!.players![0].clergy).toStrictEqual(['LB2B'])
    expect(s4!.players![0].landscape).toBe(s3!.players![0].landscape)
    expect(s4!.players![0].landscape).toStrictEqual([
      [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['H', 'LB1', 'LB1B'], [], []],
      [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LB2'], ['P'], ['P', 'LB3', 'PRIB'], [], []],
    ])
  })

  it('pushes the arm forward', () => {
    expect.assertions(2)
    const configuration = {
      players: 3 as GameConfigPlayers,
      country: 'ireland' as GameConfigCountry,
      length: 'long' as GameConfigLength,
    }
    const s0 = initialState
    const s1 = config(s0, configuration)!
    const s2 = start(s1, { seed: 42, colors: [PlayerColor.Red, PlayerColor.White, PlayerColor.Blue] })!
    expect(s2.rondel?.pointingBefore).toBe(1)
    expect(s2.buildings).toStrictEqual(['G01', 'G02', 'I04', 'I05', 'G06', 'G07', 'I08', 'I09', 'I11', 'G12'])
  })
})

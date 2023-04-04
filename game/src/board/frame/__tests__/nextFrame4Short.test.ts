import { control } from '../../../control'
import { GameCommandConfigParams, GameStatePlaying, PlayerColor } from '../../../types'

describe('board/frame/nextFrame4Short', () => {
  it('gives a nice flow', () => {
    const c1 = {
      players: 4,
      length: 'short',
    } as GameCommandConfigParams
    const s1 = {
      config: c1,
      players: [
        { color: PlayerColor.Red },
        { color: PlayerColor.Blue },
        { color: PlayerColor.Green },
        { color: PlayerColor.White },
      ],
      frame: {
        next: 1,
      },
    } as GameStatePlaying
    const s2 = control(s1, ['CONVERT'], 0)
    expect(s2.flow.map(({ round, player, bonus, settle }) => [round, player, bonus, settle])).toStrictEqual([
      [1, 'R', false, false],
      [1, 'B', false, false],
      [1, 'G', false, false],
      [1, 'W', false, false],
      [1, 'R', false, false],
      [2, 'B', false, false],
      [2, 'G', false, false],
      [2, 'W', false, false],
      [2, 'R', false, false],
      [2, 'B', false, false],
      [2, 'G', false, true],
      [2, 'W', false, true],
      [2, 'R', false, true],
      [2, 'B', false, true],
      [3, 'G', false, false],
      [3, 'W', false, false],
      [3, 'R', false, false],
      [3, 'B', false, false],
      [3, 'G', false, false],
      [4, 'W', false, false],
      [4, 'R', false, false],
      [4, 'B', false, false],
      [4, 'G', false, false],
      [4, 'W', false, false],
      [4, 'R', false, true],
      [4, 'B', false, true],
      [4, 'G', false, true],
      [4, 'W', false, true],
      [5, 'R', false, false],
      [5, 'B', false, false],
      [5, 'G', false, false],
      [5, 'W', false, false],
      [5, 'R', false, false],
      [6, 'B', false, false],
      [6, 'G', false, false],
      [6, 'W', false, false],
      [6, 'R', false, false],
      [6, 'B', false, false],
      [6, 'G', false, true],
      [6, 'W', false, true],
      [6, 'R', false, true],
      [6, 'B', false, true],
      [7, 'G', false, false],
      [7, 'W', false, false],
      [7, 'R', false, false],
      [7, 'B', false, false],
      [7, 'G', false, false],
      [8, 'W', false, false],
      [8, 'R', false, false],
      [8, 'B', false, false],
      [8, 'G', false, false],
      [8, 'W', false, false],
      [8, 'R', false, true],
    ])
  })
})

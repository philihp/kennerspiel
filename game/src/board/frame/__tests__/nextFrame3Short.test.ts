import { reducer } from '../../..'
import { control } from '../../../control'
import { spiel } from '../../../spiel'
import { GameCommandConfigParams, GameStatePlaying, PlayerColor } from '../../../types'

describe('board/frame/nextFrame3Short', () => {
  it('gives a nice flow', () => {
    const c1 = {
      players: 3,
      length: 'short',
    } as GameCommandConfigParams
    const s1 = {
      config: c1,
      players: [{ color: PlayerColor.Red }, { color: PlayerColor.Blue }, { color: PlayerColor.Green }],
      frame: {
        round: 1,
        next: 2,
        activePlayerIndex: 0,
      },
    } as GameStatePlaying
    const s2 = control(s1, ['CONVERT'], 0)
    expect(s2.flow.map(({ round, player, bonus, settle }) => [round, player, bonus, settle])).toStrictEqual([
      [1, 'R', false, false],
      [1, 'B', false, false],
      [1, 'G', false, false],
      [1, 'R', false, false],
      [2, 'B', false, false],
      [2, 'G', false, false],
      [2, 'R', false, false],
      [2, 'B', false, false],
      [2, 'G', false, true],
      [2, 'R', false, true],
      [2, 'B', false, true],
      [3, 'G', false, false],
      [3, 'R', false, false],
      [3, 'B', false, false],
      [3, 'G', false, false],
      [4, 'R', false, false],
      [4, 'B', false, false],
      [4, 'G', false, false],
      [4, 'R', false, false],
      [4, 'B', false, true],
      [4, 'G', false, true],
      [4, 'R', false, true],
      [5, 'B', false, false],
      [5, 'G', false, false],
      [5, 'R', false, false],
      [5, 'B', false, false],
      [6, 'G', false, false],
      [6, 'R', false, false],
      [6, 'B', false, false],
      [6, 'G', false, false],
      [6, 'R', false, true],
      [6, 'B', false, true],
      [6, 'G', false, true],
      [7, 'R', false, false],
      [7, 'B', false, false],
      [7, 'G', false, false],
      [7, 'R', false, false],
      [8, 'B', false, false],
      [8, 'G', false, false],
      [8, 'R', false, false],
      [8, 'B', false, false],
      [8, 'G', false, true],
      [8, 'R', false, true],
      [8, 'B', false, true],
      [9, 'G', false, false],
      [9, 'R', false, false],
      [9, 'B', false, false],
      [9, 'G', false, false],
      [10, 'R', false, false],
      [10, 'B', false, false],
      [10, 'G', false, false],
      [10, 'R', false, false],
      [11, 'B', false, false],
      [11, 'G', false, false],
      [11, 'R', false, false],
      [11, 'B', false, false],
      [12, 'G', false, false],
      [12, 'R', false, false],
      [12, 'B', false, false],
      [12, 'G', false, false],
      [12, 'R', true, false],
      [12, 'B', true, false],
      [12, 'G', true, false],
      [12, 'R', false, true],
      [12, 'B', false, true],
      [12, 'G', false, true],
    ])
  })

  it('gives an extra good to everyone whenever someone uses the wheel', () => {
    const s0 = spiel`
CONFIG 3 france short
START B W R`
    const s1 = reducer(s0!, ['USE', 'LB1']) as GameStatePlaying
    expect(s0?.players?.map((s) => s.clay)).toStrictEqual([1, 1, 1])
    expect(s1?.players?.map((s) => s.clay)).toStrictEqual([4, 2, 2])
  })
})

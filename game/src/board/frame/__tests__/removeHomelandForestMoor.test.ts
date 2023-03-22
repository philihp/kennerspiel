import { GameStatePlaying, Tableau, Tile } from '../../../types'
import { removeHomelandForestMoor } from '../removeHomelandForestMoor'

describe('board/frame/removeHomelandForestMoor', () => {
  const p0 = {
    landscape: [
      [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['H', 'LB1'], [], []],
      [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LB2'], ['P'], ['P', 'LB3'], [], []],
    ] as Tile[][],
  } as Tableau

  it('removes the first two landscape tiles from a player', () => {
    const p1 = removeHomelandForestMoor(p0)
    expect(p1.landscape).toStrictEqual([
      [[], [], ['P'], ['P'], ['P', 'LFO'], ['P'], ['H', 'LB1'], [], []],
      [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LB2'], ['P'], ['P', 'LB3'], [], []],
    ])
  })
})

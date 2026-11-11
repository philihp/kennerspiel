import { describe, it, expect } from '../../testHelpers'
import { reducer } from '../../reducer'
import { initialState } from '../../state'
import { GameState } from '../../types'
import { timestampsUsed, withTimestamps } from '../entropy'

const play = (commands: string[][], timestamps: number[]): GameState =>
  commands.reduce<GameState>((s, c) => reducer(s, c)!, withTimestamps(timestamps)(initialState))

const robbins = [
  ['CONFIG', '1', 'france', 'long', 'robbins'],
  ['START', '42', 'R'],
]

describe('board/entropy', () => {
  it('START in a robbins game uses one timestamp', () => {
    const s = play(robbins, [1762848128, 1762848200])
    expect(timestampsUsed(withTimestamps([1762848128, 1762848200])(initialState), s)).toBe(1)
    expect(s.timestamps).toStrictEqual([1762848200])
  })
  it('does not leave the per-command flag in state', () => {
    const s = play(robbins, [1762848128])
    expect(s.entropyStepped).toBeUndefined()
  })
  it('a plain solo game uses no timestamps', () => {
    const s = play(
      [
        ['CONFIG', '1', 'france', 'long'],
        ['START', '42', 'R'],
      ],
      [1762848128]
    )
    expect(s.timestamps).toStrictEqual([1762848128])
  })
  it('only a COMMIT that turns the wheel uses a timestamp', () => {
    const s1 = play(robbins, [1, 2, 3])
    // first COMMIT ends the first action of the round, no rotation
    const s2 = reducer(s1, ['COMMIT'])!
    expect(s2.timestamps).toStrictEqual([2, 3])
    // second COMMIT starts the next round, which rolls the wheel
    const s3 = reducer(s2, ['COMMIT'])!
    expect(s3.timestamps).toStrictEqual([3])
  })
  it('is the same for the same timestamps', () => {
    const commands = [...robbins, ['COMMIT'], ['COMMIT'], ['COMMIT'], ['COMMIT']]
    expect(play(commands, [10, 20, 30])).toStrictEqual(play(commands, [10, 20, 30]))
  })
  it('changes the draws when the timestamps change', () => {
    const commands = [...robbins, ...Array(20).fill(['COMMIT'])]
    const a = play(
      commands,
      Array.from({ length: 12 }, (_, i) => 1762848128 + i * 60)
    )
    const b = play(
      commands,
      Array.from({ length: 12 }, (_, i) => 1762848129 + i * 60)
    )
    expect(a.randGen).not.toStrictEqual(b.randGen)
    expect(a.rondel).not.toStrictEqual(b.rondel)
  })
  it('still works with no timestamps', () => {
    const s = play([...robbins, ['COMMIT'], ['COMMIT']], [])
    expect(s.rondel!.pointingBefore).toBe(2)
  })
})

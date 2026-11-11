import { describe as d, it as test, expect } from '../../testHelpers'
import { replay, timestampsAfter, usedTimestamps } from '../engine'

const robbins = ['CONFIG 1 france long robbins', 'START 42 R']

d('timestamps', () => {
  test('START in a robbins game takes a timestamp', () =>
    expect(timestampsAfter(robbins, [], 1762848128)).toStrictEqual([1762848128]))
  test('START in a plain solo game takes none', () =>
    expect(timestampsAfter(['CONFIG 1 france long', 'START 42 R'], [], 1762848128)).toStrictEqual([]))
  test('a COMMIT that does not turn the wheel takes none', () =>
    expect(timestampsAfter([...robbins, 'COMMIT'], [100], 200)).toStrictEqual([100]))
  test('a COMMIT that turns the wheel takes the new one', () =>
    expect(timestampsAfter([...robbins, 'COMMIT', 'COMMIT'], [100], 200)).toStrictEqual([100, 200]))
  test('after an undo, extra timestamps are dropped', () =>
    expect(usedTimestamps([...robbins, 'COMMIT'], [100, 200])).toStrictEqual([100]))
  test('replay uses the stored timestamps', () => {
    const commands = [...robbins, 'COMMIT', 'COMMIT']
    expect(replay(commands, [100, 200])?.randGen).not.toStrictEqual(replay(commands, [100, 201])?.randGen)
  })
})

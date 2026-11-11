import { describe as d, it as test, expect } from '../../testHelpers'
import { replay, stampCommand, usesTimestamps } from '../engine'

d('usesTimestamps', () => {
  test('robbins', () => expect(usesTimestamps(['CONFIG 1 france long robbins'])).toBe(true))
  test('robbins aggressive', () => expect(usesTimestamps(['CONFIG 1 france long robbins-aggressive'])).toBe(true))
  test('plain solo', () => expect(usesTimestamps(['CONFIG 1 france long'])).toBe(false))
  test('no commands', () => expect(usesTimestamps([])).toBe(false))
})

d('stampCommand', () => {
  test('adds a timestamp', () => expect(stampCommand('USE LR1', 1794384781)).toBe('USE LR1 #2026-11-11T08:13:01Z'))
  test('replaces a timestamp', () =>
    expect(stampCommand('COMMIT #2026-01-01T00:00:00Z', 1794384781)).toBe('COMMIT #2026-11-11T08:13:01Z'))
  test('keeps a note', () =>
    expect(stampCommand('COMMIT # my note', 1794384781)).toBe('COMMIT #2026-11-11T08:13:01Z my note'))
  test('replaces an old timestamp and keeps the note', () =>
    expect(stampCommand('COMMIT #1 my note', 1794384781)).toBe('COMMIT #2026-11-11T08:13:01Z my note'))
})

d('replay', () => {
  test('replays stamped commands', () => {
    const state = replay(['CONFIG 1 france long robbins', 'START 42 R #1794384700', 'COMMIT #1794384781'])
    expect(state?.frame?.next).toBe(3)
  })
})

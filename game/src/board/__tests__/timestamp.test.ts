import { describe, it, expect } from '../../testHelpers'
import { reducer } from '../../reducer'
import { initialState } from '../../state'
import { GameState } from '../../types'
import { formatTimestamp, parseTimestamp, splitComment, splitTimestamp, withTimestamp } from '../timestamp'

const play = (commands: string[]): GameState =>
  commands.reduce<GameState>((s, c) => reducer(s, c.split(' '))!, initialState)

const robbins = ['CONFIG 1 france long robbins', 'START 42 R #1762848000']

describe('board/timestamp', () => {
  describe('parseTimestamp', () => {
    it('reads unix seconds', () => expect(parseTimestamp('1762848128')).toBe(1762848128))
    it('reads ISO8601', () => expect(parseTimestamp('2026-11-11T08:13:01Z')).toBe(1794384781))
    it('drops milliseconds', () => expect(parseTimestamp('2026-11-11T08:13:01.999Z')).toBe(1794384781))
    it('reads an offset', () => expect(parseTimestamp('2026-11-11T09:13:01+01:00')).toBe(1794384781))
    it('rejects junk', () => expect(parseTimestamp('soon')).toBeUndefined())
    it('rejects a loose date', () => expect(parseTimestamp('March 3')).toBeUndefined())
  })

  describe('formatTimestamp', () => {
    it('writes ISO8601 to the second', () => expect(formatTimestamp(1794384781)).toBe('2026-11-11T08:13:01Z'))
  })

  describe('splitTimestamp', () => {
    it('takes the timestamp off the end', () =>
      expect(splitTimestamp(['COMMIT', '#1794384781'])).toStrictEqual([['COMMIT'], 1794384781]))
    it('leaves a command with no timestamp', () =>
      expect(splitTimestamp(['USE', 'LR1'])).toStrictEqual([['USE', 'LR1'], undefined]))
    it('ignores a comment that is not a timestamp', () =>
      expect(splitTimestamp(['COMMIT', '#a', 'good', 'move'])).toStrictEqual([['COMMIT'], undefined]))
    it('finds a comment with no space before it', () =>
      expect(splitTimestamp(['COMMIT#1794384781'])).toStrictEqual([['COMMIT'], 1794384781]))
  })

  describe('splitComment', () => {
    it('splits at the first #', () =>
      expect(splitComment('USE LR1 # note # more')).toStrictEqual(['USE LR1', 'note # more']))
    it('has no comment', () => expect(splitComment('USE LR1')).toStrictEqual(['USE LR1', undefined]))
  })

  describe('withTimestamp', () => {
    it('replaces any comment', () =>
      expect(withTimestamp('COMMIT # hi', 1794384781)).toBe('COMMIT #2026-11-11T08:13:01Z'))
  })

  describe('reducer', () => {
    it('steps the pcg by the timestamp', () => {
      const a = play([...robbins, 'COMMIT #1762848100'])
      const b = play([...robbins, 'COMMIT #1762848101'])
      const c = play([...robbins, 'COMMIT'])
      expect(a.randGen).not.toStrictEqual(b.randGen)
      expect(a.randGen).not.toStrictEqual(c.randGen)
    })
    it('gives the same state for both notations', () => {
      const a = play([...robbins, 'COMMIT #1794384781', 'COMMIT #1794384790'])
      const b = play([...robbins, 'COMMIT #2026-11-11T08:13:01Z', 'COMMIT #2026-11-11T08:13:10.500Z'])
      expect(a).toStrictEqual(b)
    })
    it('changes the draws of a robbins game', () => {
      const commands = (offset: number) => [
        ...robbins,
        ...Array.from({ length: 20 }, (_, i) => `COMMIT #${1762848100 + i * 60 + offset}`),
      ]
      expect(play(commands(0)).rondel).not.toStrictEqual(play(commands(1)).rondel)
    })
    it('a plain comment does not change the game', () => {
      expect(play([...robbins, 'COMMIT # thinking'])).toStrictEqual(play([...robbins, 'COMMIT']))
    })
    it('is the same as no timestamp for other moves', () => {
      const a = play([...robbins, 'COMMIT #1762848100'])
      const b = play([...robbins, 'COMMIT'])
      expect(a.frame).toStrictEqual(b.frame)
    })
  })
})

import { stepState } from 'pcg'
import { GameState, GameStatusEnum } from '../types'

// A "#" starts a comment, which runs to the end of the line, like in many
// programming languages. The game ignores a comment, with one exception: if
// the comment is a timestamp, the pcg steps forward by the seconds since the
// unix epoch before the command runs. A move made at a different second then
// gives different draws.
//
//   COMMIT #2026-11-11T08:13:01Z             steps the pcg by 1794384781
//   COMMIT #1794384781                       the same
//   COMMIT # 2026-11-11T08:13:01Z good move  the same, with a note after it
//   COMMIT # a good move                     only a comment
//
// Only the first word of the comment can be the timestamp.
// A timestamp is kept to the second. Anything more precise, like milliseconds, is dropped.

const COMMENT = '#'

const DIGITS = /^\d+$/
const ISO8601 = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:?\d{2})$/

// seconds since the unix epoch, from "1794384781" or an ISO8601 date and time
export const parseTimestamp = (value: string): number | undefined => {
  if (DIGITS.test(value)) return Number.parseInt(value, 10)
  if (!ISO8601.test(value)) return undefined
  const ms = Date.parse(value)
  return Number.isNaN(ms) ? undefined : Math.floor(ms / 1000)
}

// the ISO8601 form of a timestamp, to the second. e.g. 2026-11-11T08:13:01Z
export const formatTimestamp = (seconds: number): string =>
  new Date(seconds * 1000).toISOString().replace(/\.\d{3}Z$/, 'Z')

const tokens = (line: string): string[] => line.split(' ').filter((s) => s !== '')

// split a line into the command and its comment, if it has one
export const splitComment = (line: string): [string, string | undefined] => {
  const at = line.indexOf(COMMENT)
  return at === -1 ? [line, undefined] : [line.slice(0, at).trim(), line.slice(at + 1).trim()]
}

// the line without its comment
export const stripComment = (line: string): string => splitComment(line)[0]

// split a comment into its timestamp (the first word, if it is one) and the note after it
export const splitNote = (comment: string): [number | undefined, string] => {
  const [first = '', ...rest] = tokens(comment)
  const seconds = parseTimestamp(first)
  return seconds === undefined ? [undefined, tokens(comment).join(' ')] : [seconds, rest.join(' ')]
}

// the line with this timestamp at the start of its comment. A note in the comment is kept, and an old timestamp is replaced.
export const withTimestamp = (line: string, seconds: number): string => {
  const [command, comment] = splitComment(line)
  const [, note] = splitNote(comment ?? '')
  return [command, `${COMMENT}${formatTimestamp(seconds)}`, ...(note ? [note] : [])].join(' ')
}

// split a tokenized command into the command tokens and the timestamp in its comment
export const splitTimestamp = (command: string[]): [string[], number | undefined] => {
  const [line, comment] = splitComment(command.join(' '))
  return [tokens(line), comment === undefined ? undefined : splitNote(comment)[0]]
}

// step the pcg forward. Before START there is no pcg yet, so nothing happens.
export const stepByTimestamp =
  (seconds?: number) =>
  (state: GameState): GameState =>
    seconds === undefined || state.status === GameStatusEnum.SETUP || state.randGen === undefined
      ? state
      : { ...state, randGen: stepState(seconds, state.randGen) }

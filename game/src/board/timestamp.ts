import { stepState } from 'pcg'
import { init, last } from 'ramda'
import { GameState, GameStatusEnum } from '../types'

// A command may end with a timestamp token, like "COMMIT #1762848128" or
// "COMMIT #2026-11-11T08:13:01Z". The value is a moment in time, kept to the
// second: anything more precise, like milliseconds, is dropped. The seconds
// since the unix epoch are the distance that the pcg steps forward before the
// command runs, so a move made at a different second gives different draws.

const TIMESTAMP_PREFIX = '#'

const DIGITS = /^\d+$/

// seconds since the unix epoch, from "1762848128" or an ISO8601 string
export const parseTimestamp = (value: string): number | undefined => {
  if (DIGITS.test(value)) return Number.parseInt(value, 10)
  const ms = Date.parse(value)
  return Number.isNaN(ms) ? undefined : Math.floor(ms / 1000)
}

// the ISO8601 form of a timestamp, for game notation. e.g. 2026-11-11T08:13:01Z
export const formatTimestamp = (seconds: number): string =>
  new Date(seconds * 1000).toISOString().replace(/\.\d{3}Z$/, 'Z')

export const isTimestampToken = (token?: string): boolean => token?.startsWith(TIMESTAMP_PREFIX) ?? false

// split a tokenized command into the command and its timestamp, if it has one
export const splitTimestamp = (command: string[]): [string[], number | undefined] => {
  const token = last(command)
  if (!isTimestampToken(token)) return [command, undefined]
  const seconds = parseTimestamp(token!.slice(TIMESTAMP_PREFIX.length))
  if (seconds === undefined) throw new Error(`Unable to parse timestamp [${token}]`)
  return [init(command), seconds]
}

export const timestampToken = (seconds: number): string => `${TIMESTAMP_PREFIX}${seconds}`

// step the pcg forward. Before START there is no pcg yet, so nothing happens.
export const stepByTimestamp =
  (seconds?: number) =>
  (state: GameState): GameState =>
    seconds === undefined || state.status === GameStatusEnum.SETUP || state.randGen === undefined
      ? state
      : { ...state, randGen: stepState(seconds, state.randGen) }

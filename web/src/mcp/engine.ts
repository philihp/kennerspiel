import { GameState, initialState, reducer, Tableau } from 'hathora-et-labora-game'
import {
  BuildingEnum,
  Frame,
  GameCommandConfigParams,
  GameStatusEnum,
  PlayerColor,
  Rondel,
} from 'hathora-et-labora-game/dist/types'
import { match } from 'ts-pattern'
import { Enums } from '@/supabase.types'

export type GameStatePlaying = GameState & {
  players: Tableau[]
  frame: Frame
  config: GameCommandConfigParams
  rondel: Rondel
}

type CommandReducer = (state: GameState | undefined, command: string[]) => GameState | undefined

// the reducer throws on commands it cannot parse (game/src/reducer.ts:115), so
// both helpers normalize that to undefined alongside ordinary illegal moves

export const replay = (commands: string[]): GameState | undefined => {
  try {
    return commands.map((s) => s.split(' ')).reduce<GameState | undefined>(reducer as CommandReducer, initialState)
  } catch {
    return undefined
  }
}

export const tokenize = (command: string): string[] =>
  command
    .trim()
    .split(/\s+/)
    .filter((s) => s)

export const applyCommand = (state: GameState, command: string[]): GameState | undefined => {
  try {
    return (reducer as CommandReducer)(state, command)
  } catch {
    return undefined
  }
}

export const asPlaying = (state?: GameState): GameStatePlaying | undefined =>
  state !== undefined && state.status !== GameStatusEnum.SETUP ? (state as GameStatePlaying) : undefined

export const activePlayerColor = (state: GameStatePlaying): PlayerColor | undefined =>
  state.players?.[state.frame.activePlayerIndex]?.color

export const engineColorToEntrantColor = (c?: PlayerColor): Enums<'color'> | undefined =>
  match<PlayerColor | undefined, Enums<'color'> | undefined>(c)
    .with(PlayerColor.Red, () => 'red')
    .with(PlayerColor.Green, () => 'green')
    .with(PlayerColor.Blue, () => 'blue')
    .with(PlayerColor.White, () => 'white')
    .with(undefined, () => undefined)
    .exhaustive()

export type PendingWorkContract = {
  contractor: PlayerColor
  owner: PlayerColor
  building: BuildingEnum
}

// after a WORK_CONTRACT on an owner holding both a prior and a lay brother, the
// engine hands the active seat to the owner to send WITH_PRIOR/WITH_LAYBROTHER,
// while the contractor stays the current player and waits
export const pendingWorkContract = (state?: GameStatePlaying): PendingWorkContract | undefined => {
  const frame = state?.frame
  if (frame === undefined || frame.activePlayerIndex === frame.currentPlayerIndex) return undefined
  const contractor = state?.players?.[frame.currentPlayerIndex]?.color
  const owner = state?.players?.[frame.activePlayerIndex]?.color
  const [building] = frame.usableBuildings ?? []
  if (contractor === undefined || owner === undefined || building === undefined) return undefined
  return { contractor, owner, building }
}

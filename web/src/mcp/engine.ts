import { GameState, initialState, reducer, Tableau } from 'hathora-et-labora-game'
import { Frame, GameCommandConfigParams, GameStatusEnum, PlayerColor, Rondel } from 'hathora-et-labora-game/dist/types'
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

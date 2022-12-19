import { GameState, Tableau } from '../types'

export const getActivePlayer = (state: GameState): Tableau | undefined => state.players?.[state.activePlayerIndex]

export const setActivePlayer = (state: GameState, player: Tableau): GameState => {
  if (state.players === undefined) return state
  return {
    ...state,
    players: [
      ...state.players.slice(0, state.activePlayerIndex),
      player,
      ...state.players.slice(state.activePlayerIndex + 1),
    ],
  }
}

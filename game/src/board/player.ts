import { P } from 'ts-pattern'
import { Clergy, Cost, GameStatePlaying, PlayerColor, Tableau } from '../types'

export const clergyForColor = (color: PlayerColor): Clergy[] => {
  switch (color) {
    case PlayerColor.Red:
      return [Clergy.LayBrother1R, Clergy.LayBrother2R, Clergy.PriorR]
    case PlayerColor.Green:
      return [Clergy.LayBrother1G, Clergy.LayBrother2G, Clergy.PriorG]
    case PlayerColor.Blue:
      return [Clergy.LayBrother1B, Clergy.LayBrother2B, Clergy.PriorB]
    case PlayerColor.White:
      return [Clergy.LayBrother1W, Clergy.LayBrother2W, Clergy.PriorW]
    default:
      return []
  }
}

export const getPlayer = (state: GameStatePlaying, playerIndex?: number): Tableau => {
  const index = playerIndex ?? state?.activePlayerIndex
  return state.players[index]
}

export const setPlayer = (state: GameStatePlaying, player: Tableau, playerIndex?: number): GameStatePlaying => {
  if (state.players === undefined) return state
  const i = playerIndex || state.activePlayerIndex
  return {
    ...state,
    players: [...state.players.slice(0, i), player, ...state.players.slice(i + 1)],
  }
}

export const setPlayerCurried =
  (player: Tableau) =>
  (state: GameStatePlaying): GameStatePlaying =>
    setPlayer(state, player)

export const isPrior = (clergy: Clergy | undefined) =>
  clergy && [Clergy.PriorR, Clergy.PriorG, Clergy.PriorB, Clergy.PriorW].includes(clergy)

export const isLayBrother = (clergy: Clergy | undefined) => clergy && !isPrior(clergy)

export const payCost =
  (cost: Cost) =>
  (player: Tableau): Tableau | undefined => {
    const newPlayer: Tableau | undefined = { ...player }
    const fields = Object.entries(cost)
    for (let i = 0; i < fields.length; i++) {
      const [type, amount] = fields[i]
      const newValue = (newPlayer[type as keyof Tableau] as number) - amount
      if (newValue < 0) return undefined
      newPlayer[type as keyof Cost] = newValue
    }
    return newPlayer
  }

export const getCost =
  (cost: Cost) =>
  (player: Tableau): Tableau =>
    Object.entries(cost).reduce(
      (player, [type, amount]) => ({
        ...player,
        [type]: (player[type as keyof Tableau] as number) + amount,
      }),
      player
    )

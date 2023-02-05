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
  const index = playerIndex ?? state?.turn?.activePlayerIndex
  return state.players[index]
}

export const setPlayer = (state: GameStatePlaying, player: Tableau, playerIndex?: number): GameStatePlaying => {
  if (state.players === undefined) return state
  const i = playerIndex || state.turn.activePlayerIndex
  return {
    ...state,
    players: [...state.players.slice(0, i), player, ...state.players.slice(i + 1)],
  }
}

export const setPlayerCurried =
  (player?: Tableau) =>
  (state: GameStatePlaying): GameStatePlaying | undefined =>
    player && setPlayer(state, player)

export const withActivePlayer =
  (func: (player: Tableau) => Tableau | undefined) =>
  (state: GameStatePlaying | undefined): GameStatePlaying | undefined => {
    if (state === undefined) return state
    const beforePlayers = state.players.slice(0, state.turn.activePlayerIndex)
    const afterPlayers = state.players.slice(state.turn.activePlayerIndex + 1)

    const updatedPlayer = func(state.players[state.turn.activePlayerIndex])
    if (updatedPlayer === undefined) return undefined

    const players: Tableau[] = [...beforePlayers, updatedPlayer, ...afterPlayers]
    return {
      ...state,
      players,
    }
  }

export const isPrior = (clergy: Clergy | undefined) =>
  clergy && [Clergy.PriorR, Clergy.PriorG, Clergy.PriorB, Clergy.PriorW].includes(clergy)

export const isLayBrother = (clergy: Clergy | undefined) => clergy && !isPrior(clergy)

export const payCost =
  (cost: Cost) =>
  (player: Tableau | undefined): Tableau | undefined => {
    if (player === undefined) return undefined
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
  (player: Tableau | undefined): Tableau | undefined =>
    player &&
    Object.entries(cost).reduce(
      (player, [type, amount]) => ({
        ...player,
        [type]: (player[type as keyof Tableau] as number) + amount,
      }),
      player
    )

export const subtractCoins =
  (amount: number) =>
  (player: Tableau | undefined): Tableau | undefined => {
    if (player === undefined) return undefined
    // first clone p
    const p = { ...player }

    // Taken from Player.subtractCoins... feels gross
    // https://github.com/philihp/weblabora/blob/737717fd59c1301da6584a6874a20420eba4e71e/src/main/java/com/philihp/weblabora/model/Player.java#L542
    p.penny -= amount
    while (p.penny < 0 && p.nickel > 0) {
      p.penny += 5
      p.nickel -= 1
    }
    if (p.penny < 0 && p.penny + p.wine >= 0) {
      p.wine += p.penny
      p.penny = 0
    }
    while (p.penny < 0 && p.whiskey > 0) {
      p.penny += 2
      p.whiskey -= 1
    }

    if (p.penny < 0 || p.nickel < 0 || p.wine < 0 || p.whiskey < 0) return undefined

    return p
  }

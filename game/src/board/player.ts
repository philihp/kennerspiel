import { any, map } from 'ramda'
import { match } from 'ts-pattern'
import {
  Clergy,
  Cost,
  GameCommandConfigParams,
  GameStatePlaying,
  PlayerColor,
  StateReducer,
  Tableau,
  Tile,
} from '../types'

export const withActivePlayer =
  (func: (player: Tableau) => Tableau | undefined): StateReducer =>
  (state) => {
    if (state === undefined) return state
    const oldPlayer = state.players[state.frame.activePlayerIndex]
    const player = func(oldPlayer)
    if (player === oldPlayer) return state // dont create another state if nothing changes
    if (player === undefined) return undefined
    return {
      ...state,
      players: [
        ...state.players.slice(0, state.frame.activePlayerIndex),
        player,
        ...state.players.slice(state.frame.activePlayerIndex + 1),
      ],
    }
  }

export const withPlayer =
  (playerIndex: number) =>
  (func: (player: Tableau) => Tableau | undefined): StateReducer =>
  (state) => {
    if (state === undefined) return state
    const oldPlayer = state.players[playerIndex]
    const player = func(oldPlayer)
    if (player === oldPlayer) return state // dont create another state if nothing changes
    if (player === undefined) return undefined
    return {
      ...state,
      players: [...state.players.slice(0, playerIndex), player, ...state.players.slice(playerIndex + 1)],
    }
  }

export const withEachPlayer =
  (func: (player: Tableau) => Tableau | undefined): StateReducer =>
  (state) => {
    if (state === undefined) return state
    let dirty = false
    const players = map((p) => {
      const q = func(p)
      if (p !== q) dirty = true
      return q
    }, state.players)
    if (!dirty) return state
    if (any((p) => p === undefined, players)) return undefined
    return {
      ...state,
      players: players as Tableau[],
    }
  }

export const clergyForColor = (config?: GameCommandConfigParams) => {
  if ((config?.players === 3 || config?.players === 4) && config?.length === 'short') {
    return (color: PlayerColor): Clergy[] =>
      match(color)
        .with(PlayerColor.Red, () => [Clergy.LayBrother1R, Clergy.PriorR])
        .with(PlayerColor.Green, () => [Clergy.LayBrother1G, Clergy.PriorG])
        .with(PlayerColor.Blue, () => [Clergy.LayBrother1B, Clergy.PriorB])
        .with(PlayerColor.White, () => [Clergy.LayBrother1W, Clergy.PriorW])
        .exhaustive()
  }
  return (color: PlayerColor): Clergy[] =>
    match(color)
      .with(PlayerColor.Red, () => [Clergy.LayBrother1R, Clergy.LayBrother2R, Clergy.PriorR])
      .with(PlayerColor.Green, () => [Clergy.LayBrother1G, Clergy.LayBrother2G, Clergy.PriorG])
      .with(PlayerColor.Blue, () => [Clergy.LayBrother1B, Clergy.LayBrother2B, Clergy.PriorB])
      .with(PlayerColor.White, () => [Clergy.LayBrother1W, Clergy.LayBrother2W, Clergy.PriorW])
      .exhaustive()
}

export const priors = (state: GameStatePlaying | undefined): Clergy[] =>
  (state &&
    state.players
      .map(({ color }) => color)
      .map(clergyForColor(state.config))
      .map(([, , prior]) => prior)) ??
  []

export const isPrior = (clergy: Clergy | undefined): boolean =>
  !!(clergy && [Clergy.PriorR, Clergy.PriorG, Clergy.PriorB, Clergy.PriorW].includes(clergy))

export const isLayBrother = (clergy: Clergy | undefined): boolean => !!(clergy && !isPrior(clergy))

export const payCost =
  (cost: Cost) =>
  (player: Tableau | undefined): Tableau | undefined => {
    if (player === undefined) return undefined
    let dirty = false
    const newPlayer: Tableau = { ...player }
    const fields = Object.entries(cost)
    // TODO: do better
    for (let i = 0; i < fields.length; i++) {
      const [type, amount] = fields[i]
      if (amount) {
        dirty = true
        const newValue = (newPlayer[type as keyof Tableau] as number) - (amount ?? 0)
        if (newValue < 0 && type !== 'penny') return undefined
        newPlayer[type as keyof Cost] = newValue
      }
    }
    if (!dirty) return player

    while (newPlayer.penny < 0 && newPlayer.nickel > 0) {
      newPlayer.penny += 5
      newPlayer.nickel -= 1
    }
    while (newPlayer.penny < 0 && newPlayer.whiskey > 0) {
      newPlayer.penny += 2
      newPlayer.whiskey -= 1
    }
    while (newPlayer.penny < 0 && newPlayer.wine > 0) {
      newPlayer.wine -= 1
      newPlayer.penny += 1
    }
    if (newPlayer.penny < 0) return undefined

    return newPlayer
  }

export const getCost =
  (cost: Cost) =>
  (player: Tableau | undefined): Tableau | undefined =>
    player &&
    Object.entries(cost).reduce((player, [type, amount]) => {
      // TODO: write test to ensure this works with amount === undefined
      if (!amount) return player
      return {
        ...player,
        [type]: (player[type as keyof Tableau] as number) + amount,
      }
    }, player)

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

export const getWonder =
  (amount = 1) =>
  (player: Tableau | undefined): Tableau | undefined => {
    return (
      player && {
        ...player,
        wonders: player.wonders + amount,
      }
    )
  }

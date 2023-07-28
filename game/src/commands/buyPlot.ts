import {
  always,
  equals,
  filter,
  findIndex,
  head,
  map,
  pipe,
  range,
  reduce,
  reject,
  remove,
  toString,
  view,
} from 'ramda'
import { P, match } from 'ts-pattern'
import { costMoney } from '../board/resource'
import { activeLens, subtractCoins, withActivePlayer } from '../board/player'
import { GameStatePlaying, GameCommandBuyPlotParams, Tile, LandEnum, GameCommandEnum } from '../types'

const checkCanGetLandscape = (state?: GameStatePlaying): GameStatePlaying | undefined => {
  if (state === undefined) return undefined
  if (state.frame.currentPlayerIndex !== state.frame.activePlayerIndex) return undefined
  if (state.frame.canBuyLandscape) return state
  if (state.frame.bonusActions.includes(GameCommandEnum.BUY_PLOT)) return state
  return undefined
}

const checkForConnection = (y: number, side: 'COAST' | 'MOUNTAIN') =>
  withActivePlayer((player) => {
    const { landscape, landscapeOffset } = player
    if (
      match(side)
        .with(
          'COAST',
          () =>
            landscape[y + landscapeOffset - 1]?.[1][0] === undefined && // above
            landscape[y + landscapeOffset]?.[3][0] === undefined && // upper-right
            landscape[y + landscapeOffset + 1]?.[3][0] === undefined && // lower-right
            landscape[y + landscapeOffset + 2]?.[1][0] === undefined // below
        )
        .with(
          'MOUNTAIN',
          () =>
            landscape[y + landscapeOffset - 1]?.[7][0] === undefined && // above
            landscape[y + landscapeOffset]?.[6][0] === undefined && // upper-left
            landscape[y + landscapeOffset + 1]?.[6][0] === undefined && // lower-left
            landscape[y + landscapeOffset + 2]?.[7][0] === undefined // below
        )
        .exhaustive()
    )
      return undefined
    return player
  })

const checkForOverlap = (y: number, side: 'COAST' | 'MOUNTAIN') =>
  withActivePlayer((player) => {
    const { landscape, landscapeOffset } = player
    if (
      match(side)
        .with(
          'COAST',
          () =>
            landscape[y + landscapeOffset]?.[0][0] !== undefined ||
            landscape[y + landscapeOffset + 1]?.[1][0] !== undefined
        )
        .with(
          'MOUNTAIN',
          () =>
            landscape[y + landscapeOffset]?.[7][0] !== undefined ||
            landscape[y + landscapeOffset + 1]?.[7][0] !== undefined
        )
        .exhaustive()
    )
      return undefined
    return player
  })

const checkCanAfford = (state?: GameStatePlaying): GameStatePlaying | undefined => {
  if (state?.frame?.bonusActions?.includes(GameCommandEnum.BUY_PLOT)) return state
  const cost = state?.plotPurchasePrices[0] ?? 999
  return withActivePlayer((player) => {
    if (costMoney(player) < cost) return undefined
    return player
  })(state)
}

const payForPlot = (state?: GameStatePlaying): GameStatePlaying | undefined => {
  if (state === undefined) return undefined
  if (state.frame.bonusActions?.includes(GameCommandEnum.BUY_PLOT)) return state
  const cost = state.plotPurchasePrices[0]
  return withActivePlayer(subtractCoins(cost))(state)
}

const removePlotFromPool = (state?: GameStatePlaying): GameStatePlaying | undefined => {
  if (state === undefined) return undefined
  if (state.frame.bonusActions?.includes(GameCommandEnum.BUY_PLOT)) return state
  return {
    ...state,
    plotPurchasePrices: state.plotPurchasePrices.slice(1),
  }
}

const denyBuyingAnyMoreLandscape = (state?: GameStatePlaying): GameStatePlaying | undefined => {
  if (state === undefined) return undefined
  const atIndex = findIndex(equals(GameCommandEnum.BUY_PLOT), state.frame.bonusActions)
  return {
    ...state,
    frame: {
      ...state.frame,
      // if the command was found in bonusActions
      ...(atIndex !== -1
        ? {
            // leave canBuyLandscape as it was
            bonusActions: remove(atIndex, 1, state.frame.bonusActions),
          }
        : {
            // otherwise set canBuyLandscape to false
            canBuyLandscape: false,
          }),
    },
  }
}

const newPlot = (side: 'COAST' | 'MOUNTAIN'): Tile[][] =>
  match<'COAST' | 'MOUNTAIN', Tile[][]>(side)
    .with('COAST', () => [
      [[LandEnum.Water], [LandEnum.Coast]],
      [[LandEnum.Water], [LandEnum.Coast]],
    ])
    .with('MOUNTAIN', () => [
      [[LandEnum.Hillside], [LandEnum.Mountain]],
      [[LandEnum.Hillside], [LandEnum.BelowMountain]],
    ])
    .exhaustive()

const NEW_ROW: Tile[] = [[], [], [], [], [], [], [], [], []]
const expandLandscape = (y: number) =>
  withActivePlayer((player) => {
    const landscape = [...player.landscape]
    let { landscapeOffset } = player
    while (y + landscapeOffset < 0) {
      landscape.unshift(NEW_ROW)
      landscapeOffset++
    }
    while (y + landscapeOffset + 2 > landscape.length) {
      landscape.push(NEW_ROW)
    }

    return {
      ...player,
      landscape,
      landscapeOffset,
    }
  })

const addNewPlot = (y: number, side: 'COAST' | 'MOUNTAIN') =>
  withActivePlayer((player) => {
    const newTiles = newPlot(side)
    const rowsBefore = player.landscape.slice(0, y + player.landscapeOffset)
    const rowsAfter = player.landscape.slice(y + player.landscapeOffset + 2)

    const newRows = match<'COAST' | 'MOUNTAIN', Tile[][]>(side)
      .with('COAST', () => [
        [...newTiles[0], ...(player.landscape[y + player.landscapeOffset] ?? []).slice(2)],
        [...newTiles[1], ...(player.landscape[y + player.landscapeOffset + 1] ?? []).slice(2)],
      ])
      .with('MOUNTAIN', () => [
        [...(player.landscape[y + player.landscapeOffset] ?? []).slice(0, 7), ...newTiles[0]],
        [...(player.landscape[y + player.landscapeOffset + 1] ?? []).slice(0, 7), ...newTiles[1]],
      ])
      .exhaustive()

    const landscape = [...rowsBefore, ...newRows, ...rowsAfter]

    return {
      ...player,
      landscape,
    }
  })

export const buyPlot = ({ side, y }: GameCommandBuyPlotParams) =>
  pipe(
    //
    checkCanGetLandscape,
    checkForOverlap(y, side),
    checkForConnection(y, side),
    checkCanAfford,
    payForPlot,
    removePlotFromPool,
    denyBuyingAnyMoreLandscape,
    expandLandscape(y),
    addNewPlot(y, side)
  )

export const complete =
  (state: GameStatePlaying) =>
  (partial: string[]): string[] => {
    const player = view(activeLens(state), state)
    return match<string[], string[]>(partial)
      .with([], () => {
        if (state.frame.bonusActions.includes(GameCommandEnum.BUY_PLOT) && head(state.plotPurchasePrices))
          return [GameCommandEnum.BUY_PLOT]
        if (checkCanGetLandscape(state) === undefined) return []
        const playerWealth = costMoney(player)
        const nextPlotCost = head(state.plotPurchasePrices) ?? Infinity
        if (playerWealth < nextPlotCost) return []
        return [GameCommandEnum.BUY_PLOT]
      })
      .with([GameCommandEnum.BUY_PLOT], () =>
        map(
          toString,
          filter(
            (y: number) =>
              (!!checkForConnection(y, 'COAST')(state) && !!checkForOverlap(y, 'COAST')(state)) ||
              (!!checkForConnection(y, 'MOUNTAIN')(state) && !!checkForOverlap(y, 'MOUNTAIN')(state)),
            range(-2 - player.landscapeOffset, 1 + player.landscape.length - player.landscapeOffset)
          )
        )
      )
      .with([GameCommandEnum.BUY_PLOT, P._], ([, yRaw]): string[] => {
        const y = Number.parseInt(yRaw, 10)
        return reject<'MOUNTAIN' | 'COAST'>(
          (side): boolean => !checkForOverlap(y, side)(state) || !checkForConnection(y, side)(state)
        )(['COAST', 'MOUNTAIN'])
      })
      .with([GameCommandEnum.BUY_PLOT, P._, P._], always(['']))
      .otherwise(always([]))
  }

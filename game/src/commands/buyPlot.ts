import { pipe } from 'ramda'
import { match } from 'ts-pattern'
import { costMoney } from '../board/resource'
import { subtractCoins, withActivePlayer } from '../board/player'
import { GameStatePlaying, GameCommandBuyPlotParams, Tile, LandEnum, BuildingEnum } from '../types'

const checkCanBuyLandscape = (state?: GameStatePlaying): GameStatePlaying | undefined =>
  state?.canBuyLandscape ? state : undefined

const checkForConnection = (y: number, side: 'COAST' | 'MOUNTAIN') =>
  withActivePlayer((player) => {
    const { landscape, landscapeOffset } = player

    const cabove = landscape[y + landscapeOffset - 1]?.[1][0]
    const cuplef = landscape[y + landscapeOffset]?.[3][0]
    const clolef = landscape[y + landscapeOffset + 1]?.[3][0]
    const cbelow = landscape[y + landscapeOffset + 2]?.[1][0] // below
    const mabove = landscape[y + landscapeOffset - 1]?.[7][0]
    const muplef = landscape[y + landscapeOffset]?.[6][0]
    const mlolef = landscape[y + landscapeOffset + 1]?.[6][0]
    const mbelow = landscape[y + landscapeOffset + 2]?.[7][0] // below

    if (
      match(side)
        .with(
          'COAST',
          () =>
            landscape[y + landscapeOffset - 1]?.[1][0] === undefined && // above
            landscape[y + landscapeOffset]?.[3][0] === undefined && // upper-left
            landscape[y + landscapeOffset + 1]?.[3][0] === undefined && // lower-left
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

    const cabove = landscape[y + landscapeOffset]?.[0][0]
    const cuplef = landscape[y + landscapeOffset]?.[1][0]
    const clolef = landscape[y + landscapeOffset + 1]?.[0][0]
    const cbelow = landscape[y + landscapeOffset + 1]?.[1][0]
    const mabove = landscape[y + landscapeOffset]?.[7][0]
    const muplef = landscape[y + landscapeOffset]?.[8][0]
    const mlolef = landscape[y + landscapeOffset + 1]?.[7][0]
    const mbelow = landscape[y + landscapeOffset + 1]?.[8][0]
    if (
      match(side)
        .with(
          'COAST',
          () =>
            landscape[y + landscapeOffset]?.[0][0] !== undefined ||
            landscape[y + landscapeOffset]?.[1][0] !== undefined ||
            landscape[y + landscapeOffset + 1]?.[0][0] !== undefined ||
            landscape[y + landscapeOffset + 1]?.[1][0] !== undefined
        )
        .with(
          'MOUNTAIN',
          () =>
            landscape[y + landscapeOffset]?.[7][0] !== undefined ||
            landscape[y + landscapeOffset]?.[8][0] !== undefined ||
            landscape[y + landscapeOffset + 1]?.[7][0] !== undefined ||
            landscape[y + landscapeOffset + 1]?.[8][0] !== undefined
        )
        .exhaustive()
    )
      return undefined
    return player
  })

const checkCanAfford = (state?: GameStatePlaying): GameStatePlaying | undefined => {
  const cost = state?.plotPurchasePrices[0] ?? 999
  return withActivePlayer((player) => {
    if (costMoney(player) < cost) return undefined
    return player
  })(state)
}

const payForPlot = (state?: GameStatePlaying): GameStatePlaying | undefined => {
  if (state === undefined) return undefined
  const cost = state.plotPurchasePrices[0]
  return withActivePlayer(subtractCoins(cost))(state)
}

const removePlotFromPool = (state?: GameStatePlaying): GameStatePlaying | undefined => {
  if (state === undefined) return undefined
  return {
    ...state,
    plotPurchasePrices: state.plotPurchasePrices.slice(1),
  }
}

const denyBuyingAnyMoreLandscape = (state?: GameStatePlaying): GameStatePlaying | undefined => {
  if (state === undefined) return undefined
  return {
    ...state,
    canBuyLandscape: false,
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
    checkCanBuyLandscape,
    checkForOverlap(y, side),
    checkCanAfford,
    checkForConnection(y, side),
    payForPlot,
    removePlotFromPool,
    denyBuyingAnyMoreLandscape,
    expandLandscape(y),
    addNewPlot(y, side)
  )

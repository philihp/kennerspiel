import { pipe } from 'ramda'
import { match } from 'ts-pattern'
import { costMoney } from '../board/resource'
import { subtractCoins, withActivePlayer } from '../board/player'
import { GameStatePlaying, GameCommandBuyPlotParams, Tile, LandEnum, BuildingEnum } from '../types'

const checkCanBuyLandscape = (state?: GameStatePlaying): GameStatePlaying | undefined =>
  state?.canBuyLandscape ? state : undefined

const checkForConnection = (y: number) =>
  withActivePlayer((player) => {
    if (y + player.landscapeOffset < -1) return undefined
    return player
  })

const checkForOverlap = (y: number) =>
  withActivePlayer((player) => {
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
  match(side)
    .with('COAST', () => [
      //
      [[LandEnum.Water] as Tile, [LandEnum.Coast] as Tile],
      [[LandEnum.Water] as Tile, [LandEnum.Coast] as Tile],
    ])
    .with('MOUNTAIN', () => [
      //
      [[LandEnum.Hillside] as Tile, [LandEnum.Mountain] as Tile],
      [[LandEnum.Hillside] as Tile],
    ])
    .exhaustive()

const addTopRow = (y: number) =>
  withActivePlayer((player) => {
    const landscape = [...player.landscape]
    let { landscapeOffset } = player
    if (y + player.landscapeOffset < 0) {
      landscape.unshift([[], [], [], [], [], [], [], [], []])
      landscapeOffset++
    } else if (y + 1 + player.landscapeOffset >= landscape.length) {
      landscape.push([[], [], [], [], [], [], [], [], []])
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

    const row0 = [...newTiles[0], ...(player.landscape[y + player.landscapeOffset] ?? []).slice(2)]
    const row1 = [...newTiles[1], ...(player.landscape[y + player.landscapeOffset + 1] ?? []).slice(2)]

    const landscape = [...rowsBefore, row0, row1, ...rowsAfter]

    return {
      ...player,
      landscape,
    }
  })

export const buyPlot = ({ side, y }: GameCommandBuyPlotParams) =>
  pipe(
    //
    checkCanBuyLandscape,
    checkForOverlap(y),
    checkCanAfford,
    checkForConnection(y),
    payForPlot,
    removePlotFromPool,
    denyBuyingAnyMoreLandscape,
    addTopRow(y),
    addNewPlot(y, side)
  )

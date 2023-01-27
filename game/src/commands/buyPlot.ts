import { pipe } from 'ramda'
import { match } from 'ts-pattern'
import { costMoney } from '../board/resource'
import { subtractCoins, withActivePlayer } from '../board/player'
import { GameStatePlaying, GameCommandBuyPlotParams, Tile, LandEnum, BuildingEnum } from '../types'

const checkCanBuyLandscape = (state?: GameStatePlaying): GameStatePlaying | undefined =>
  state?.canBuyLandscape ? state : undefined

const checkForConnection = (y: number) =>
  withActivePlayer((player) => {
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

const addNewPlot = (y: number, side: 'COAST' | 'MOUNTAIN') =>
  withActivePlayer((player) => {
    const landscape = [...player.landscape]
    const { landscapeOffset } = player
    return {
      ...player,
      landscape,
      landscapeOffset,
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
    addNewPlot(y, side)
  )

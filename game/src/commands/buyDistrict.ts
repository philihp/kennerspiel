import { pipe } from 'ramda'
import { match } from 'ts-pattern'
import { costMoney } from '../board/resource'
import { subtractCoins, withActivePlayer } from '../board/player'
import { GameStatePlaying, GameCommandBuyDistrictParams, Tile, LandEnum, BuildingEnum } from '../types'

const checkCanBuyLandscape = (state?: GameStatePlaying): GameStatePlaying | undefined =>
  state?.canBuyLandscape ? state : undefined

const checkDistrictAvailable = (state?: GameStatePlaying): GameStatePlaying | undefined => {
  if (state?.districtPurchasePrices.length === 0) return undefined
  return state
}

const checkForConnection = (y: number) =>
  // new district must have an existing
  withActivePlayer((player) => {
    const { landscape } = player
    if (
      landscape[y]?.[-1] === undefined &&
      landscape[y]?.[5] === undefined &&
      landscape[y - 1]?.[0] === undefined &&
      landscape[y + 1]?.[0] === undefined
    )
      return undefined
    return player
  })

const checkForOverlap = (y: number) =>
  withActivePlayer((player) => {
    const { landscape } = player
    if (landscape[y]?.[0] !== undefined) return undefined
    return player
  })

const payForDistrict = (state?: GameStatePlaying): GameStatePlaying | undefined => {
  if (state === undefined) return undefined
  if (state.districtPurchasePrices.length === 0) return undefined
  return withActivePlayer((player) =>
    costMoney(player) >= state.districtPurchasePrices[0]
      ? subtractCoins(state.districtPurchasePrices[0])(player)
      : undefined
  )(state)
}

const removeDistrictFromPool = (state?: GameStatePlaying): GameStatePlaying | undefined => {
  if (state === undefined) return undefined
  return {
    ...state,
    districtPurchasePrices: state.districtPurchasePrices.slice(1),
  }
}

const denyBuyingAnyMoreLandscape = (state?: GameStatePlaying): GameStatePlaying | undefined => {
  if (state === undefined) return undefined
  return {
    ...state,
    canBuyLandscape: false,
  }
}

const newDistrict = (side: 'PLAINS' | 'HILLS'): Tile[] =>
  match(side)
    .with('HILLS', () => [
      [LandEnum.Plains, BuildingEnum.Peat] as Tile,
      [LandEnum.Plains, BuildingEnum.Forest] as Tile,
      [LandEnum.Plains, BuildingEnum.Forest] as Tile,
      [LandEnum.Hillside] as Tile,
      [LandEnum.Hillside] as Tile,
    ])
    .with('PLAINS', () => [
      [LandEnum.Plains, BuildingEnum.Forest] as Tile,
      [LandEnum.Plains] as Tile,
      [LandEnum.Plains] as Tile,
      [LandEnum.Plains] as Tile,
      [LandEnum.Hillside] as Tile,
    ])
    .exhaustive()

const addNewDistrict = (y: number, side: 'PLAINS' | 'HILLS') =>
  withActivePlayer((player) => {
    const landscape = [...player.landscape]
    let { landscapeOffset } = player
    if (y < 0) {
      landscape.unshift(newDistrict(side))
      landscapeOffset++
    } else {
      while (![...landscape.keys()].includes(y)) {
        landscape.push([])
      }
      landscape[y] = newDistrict(side)
    }
    return {
      ...player,
      landscape,
      landscapeOffset,
    }
  })

export const buyDistrict = ({ side, y }: GameCommandBuyDistrictParams) =>
  pipe(
    //
    checkCanBuyLandscape,
    checkDistrictAvailable,
    checkForOverlap(y),
    checkForConnection(y),
    payForDistrict,
    removeDistrictFromPool,
    denyBuyingAnyMoreLandscape,
    addNewDistrict(y, side)
  )

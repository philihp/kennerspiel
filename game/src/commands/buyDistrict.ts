import { pipe } from 'ramda'
import { match } from 'ts-pattern'
import { costMoney } from '../board/resource'
import { subtractCoins, withActivePlayer } from '../board/player'
import { GameStatePlaying, GameCommandBuyDistrictParams, Tile, LandEnum, BuildingEnum } from '../types'

const checkCanBuyLandscape = (state?: GameStatePlaying): GameStatePlaying | undefined => {
  if (state === undefined) return undefined
  if (state.canBuyLandscape === false) return undefined
  return state
}

const checkForConnection = (y: number) =>
  // new district must have an existing
  withActivePlayer((player) => {
    const { landscape, landscapeOffset } = player
    if (
      landscape[y + landscapeOffset]?.[-1] === undefined &&
      landscape[y + landscapeOffset]?.[5] === undefined &&
      landscape[y + landscapeOffset - 1]?.[0] === undefined &&
      landscape[y + landscapeOffset + 1]?.[0] === undefined
    )
      return undefined
    return player
  })

const checkForOverlap = (y: number) =>
  withActivePlayer((player) => {
    const { landscape, landscapeOffset } = player
    if (landscape[y + landscapeOffset]?.[3][0] !== undefined) return undefined
    return player
  })

const checkCanAfford = (state?: GameStatePlaying): GameStatePlaying | undefined => {
  const cost = state?.districtPurchasePrices[0]
  return withActivePlayer((player) => {
    if (cost === undefined) return undefined
    if (costMoney(player) < cost) return undefined
    return player
  })(state)
}

const payForDistrict = (state?: GameStatePlaying): GameStatePlaying | undefined => {
  if (state === undefined) return undefined
  return withActivePlayer(subtractCoins(state.districtPurchasePrices[0]))(state)
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

const NEW_ROW: Tile[] = [[], [], [], [], [], [], [], [], []]
const expandLandscape = (y: number) =>
  withActivePlayer((player) => {
    const landscape = [...player.landscape]
    let { landscapeOffset } = player
    if (y + player.landscapeOffset < 0) {
      landscape.unshift(NEW_ROW)
      landscapeOffset++
    } else if (y + player.landscapeOffset >= landscape.length) {
      landscape.push(NEW_ROW)
    }
    return {
      ...player,
      landscape,
      landscapeOffset,
    }
  })

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
    const newTiles = newDistrict(side)
    const rowsBefore = player.landscape.slice(0, y + player.landscapeOffset)
    const newRow = [
      ...player.landscape[y + player.landscapeOffset].slice(0, 2),
      ...newTiles,
      ...player.landscape[y + player.landscapeOffset].slice(7, 9),
    ]
    const rowsAfter = player.landscape.slice(y + player.landscapeOffset + 1)
    const landscape = [...rowsBefore, newRow, ...rowsAfter]
    return {
      ...player,
      landscape,
    }
  })

export const buyDistrict = ({ side, y }: GameCommandBuyDistrictParams) =>
  pipe(
    //
    checkCanBuyLandscape,
    checkForOverlap(y),
    checkCanAfford,
    checkForConnection(y),
    payForDistrict,
    removeDistrictFromPool,
    denyBuyingAnyMoreLandscape,
    expandLandscape(y),
    addNewDistrict(y, side)
  )

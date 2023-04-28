import {
  always,
  equals,
  filter,
  findIndex,
  head,
  map,
  nth,
  pipe,
  range,
  reject,
  remove,
  toString,
  unless,
  view,
} from 'ramda'
import { P, match } from 'ts-pattern'
import { costMoney } from '../board/resource'
import { activeLens, subtractCoins, withActivePlayer } from '../board/player'
import { GameStatePlaying, GameCommandBuyDistrictParams, Tile, LandEnum, BuildingEnum, GameCommandEnum } from '../types'

const checkCanGetLandscape = (state?: GameStatePlaying): GameStatePlaying | undefined => {
  if (state === undefined) return undefined
  if (state.frame.canBuyLandscape) return state
  if (state.frame.bonusActions.includes(GameCommandEnum.BUY_DISTRICT)) return state
  return undefined
}

const checkForConnection = (y: number) =>
  // new district must have an existing
  withActivePlayer((player) => {
    const { landscape, landscapeOffset } = player
    const north = landscape[y + landscapeOffset - 1]?.[4]?.[0]
    const east = landscape[y + landscapeOffset]?.[5]?.[0]
    const west = landscape[y + landscapeOffset]?.[1]?.[0]
    const south = landscape[y + landscapeOffset + 1]?.[4]?.[0]
    if (north || east || west || south) return player
    return undefined
  })

const checkForOverlap = (y: number) =>
  withActivePlayer((player) => {
    const { landscape, landscapeOffset } = player
    if (landscape[y + landscapeOffset]?.[3]?.[0] !== undefined) return undefined
    return player
  })

const checkCanAfford = (state?: GameStatePlaying): GameStatePlaying | undefined => {
  if (state?.frame.bonusActions?.includes(GameCommandEnum.BUY_DISTRICT)) return state
  const cost = state?.districtPurchasePrices[0]
  return withActivePlayer((player) => {
    if (cost === undefined) return undefined
    if (costMoney(player) < cost) return undefined
    return player
  })(state)
}

const payForDistrict = (state?: GameStatePlaying): GameStatePlaying | undefined => {
  if (state === undefined) return undefined
  if (state.frame.bonusActions?.includes(GameCommandEnum.BUY_DISTRICT)) return state
  const cost = state.districtPurchasePrices[0]
  return withActivePlayer(subtractCoins(cost))(state)
}

const removeDistrictFromPool = (state?: GameStatePlaying): GameStatePlaying | undefined => {
  if (state === undefined) return undefined
  if (state.frame.bonusActions?.includes(GameCommandEnum.BUY_DISTRICT)) return state
  return {
    ...state,
    districtPurchasePrices: state.districtPurchasePrices.slice(1),
  }
}

const denyBuyingAnyMoreLandscape = (state?: GameStatePlaying): GameStatePlaying | undefined => {
  if (state === undefined) return undefined
  const atIndex = findIndex(equals(GameCommandEnum.BUY_DISTRICT), state.frame.bonusActions)
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
    checkCanGetLandscape,
    checkForOverlap(y),
    checkForConnection(y),
    checkCanAfford,
    payForDistrict,
    removeDistrictFromPool,
    denyBuyingAnyMoreLandscape,
    expandLandscape(y),
    addNewDistrict(y, side)
  )

export const complete =
  (state: GameStatePlaying) =>
  (partial: string[]): string[] => {
    const player = view(activeLens(state), state)
    return match<string[], string[]>(partial)
      .with([], () => {
        if (state.frame.bonusActions.includes(GameCommandEnum.BUY_DISTRICT) && head(state.districtPurchasePrices))
          return [GameCommandEnum.BUY_DISTRICT]
        if (checkCanGetLandscape(state) === undefined) return []
        const playerWealth = costMoney(player)
        const nextDistrictCost = head(state.districtPurchasePrices) ?? Infinity
        if (playerWealth < nextDistrictCost) return []
        return [GameCommandEnum.BUY_DISTRICT]
      })
      .with([GameCommandEnum.BUY_DISTRICT], () =>
        map(
          toString,
          reject(
            (y: number) => !checkForConnection(y)(state) || !checkForOverlap(y)(state),
            range(-1 - player.landscapeOffset, 1 + player.landscape.length - player.landscapeOffset)
          )
        )
      )
      .with([GameCommandEnum.BUY_DISTRICT, P._], always(['PLAINS', 'HILLS']))
      .with([GameCommandEnum.BUY_DISTRICT, P._, P._], always(['']))
      .otherwise(always([]))
  }

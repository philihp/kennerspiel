import { addIndex, curry, filter, map, pipe, reduce, view } from 'ramda'
import { P, match } from 'ts-pattern'
import { addErectionAtLandscape, terrainForErection } from '../board/erections'
import { onlyViaBonusActions } from '../board/frame'
import { checkLandscapeFree, checkLandTypeMatches } from '../board/landscape'
import { activeLens, payCost, withActivePlayer } from '../board/player'
import { costEnergy, costFood, parseResourceParam, settlementCostOptions } from '../board/resource'
import { costForSettlement } from '../board/settlements'
import {
  Cost,
  GameCommandEnum,
  GameCommandSettleParams,
  GameStatePlaying,
  SettlementEnum,
  StateReducer,
  Tableau,
  Tile,
} from '../types'

const payForSettlement = (settlement: SettlementEnum, resources: Cost) =>
  withActivePlayer(
    pipe(
      //
      (player) => {
        const { food, energy } = costForSettlement(settlement)
        if (costEnergy(resources) < energy) return undefined
        if (costFood(resources) < food) return undefined
        return player
      },
      payCost(resources)
    )
  )

const removeSettlementFromUnbuilt = (settlement: SettlementEnum): StateReducer =>
  withActivePlayer((player) => {
    if (!player.settlements.includes(settlement)) return undefined
    return {
      ...player,
      settlements: filter((s) => s !== settlement, player.settlements),
    }
  })

const settleableLocationsCol = (settlement: SettlementEnum, rawCol: string, player: Tableau): string[] => {
  const col = Number.parseInt(rawCol, 10) + 2
  const colsAtRow = map((row: Tile[]) => row[col], player.landscape)
  return addIndex(reduce<Tile, string[]>)(
    (accum, tile, rowIndex) => {
      if (tile[0] && terrainForErection(settlement).includes(tile[0]) && !tile[1])
        accum.push(`${rowIndex - player.landscapeOffset}`)
      return accum
    },
    [] as string[],
    colsAtRow
  )
}

const settleableLocations = curry((settlement: SettlementEnum, player: Tableau): string[] =>
  addIndex(reduce<Tile[], string[]>)(
    (accum, row, rowIndex) =>
      addIndex(reduce<Tile, string[]>)(
        (innerAccum, tile, colIndex) => {
          if (tile[0] && terrainForErection(settlement).includes(tile[0]) && !tile[1])
            innerAccum.push(`${colIndex - 2} ${rowIndex - player.landscapeOffset}`)
          return innerAccum
        },
        accum,
        row
      ),
    [] as string[],
    player.landscape
  )
)

export const settle = ({ row, col, settlement, resources }: GameCommandSettleParams) => {
  const input = parseResourceParam(resources)
  return pipe(
    // any of these not defined here are probably shared with BUILD
    onlyViaBonusActions(GameCommandEnum.SETTLE),
    checkLandscapeFree(row, col),
    checkLandTypeMatches(row, col, settlement),
    payForSettlement(settlement, input),
    removeSettlementFromUnbuilt(settlement),
    addErectionAtLandscape(row, col, settlement)
  )
}

export const complete = curry((state: GameStatePlaying, partial: string[]): string[] => {
  const player = view(activeLens(state), state)
  return match<string[], string[]>(partial)
    .with([], () => {
      if (
        pipe(
          //
          onlyViaBonusActions(GameCommandEnum.SETTLE)
          // would be cool to check, recursively, if any of the possibilities to follow
          // this were also allowable, i.e. they complete into an array that is non-zero in length
          //
          // by not doing this, it's possible to go down a dead end path, and that might not be fun
          // for the user. but also that's really hard. so maybe not right now... i'll leave this as a
          // TODO
        )(state) !== undefined
      )
        return [GameCommandEnum.SETTLE]
      return []
    })
    .with([GameCommandEnum.SETTLE], () => {
      return filter((settlement) => {
        const playerFood = costFood(player)
        const playerEnergy = costEnergy(player)
        const { food: requiredFood, energy: requiredEnergy } = costForSettlement(settlement)
        return playerFood >= requiredFood && playerEnergy >= requiredEnergy
      }, view(activeLens(state), state).settlements)
    })
    .with([GameCommandEnum.SETTLE, P._], ([, settlement]) => settleableLocations(settlement as SettlementEnum, player))
    .with([GameCommandEnum.SETTLE, P._, P._], ([, settlement, col]) =>
      settleableLocationsCol(settlement as SettlementEnum, col, player)
    )
    .with([GameCommandEnum.SETTLE, P._, P._, P._], ([, settlement, _col, _row]) => {
      return settlementCostOptions(costForSettlement(settlement as SettlementEnum), player)
    })
    .with([GameCommandEnum.SETTLE, P._, P._, P._, P._], ([, settlement, col, row, resources]) => {
      const r = Number.parseInt(row, 10)
      const c = Number.parseInt(col, 10) - 2
      return ['']
    })
    .otherwise(() => [])
})

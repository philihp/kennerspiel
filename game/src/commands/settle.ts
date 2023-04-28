import { addIndex, curry, filter, map, pipe, reduce, view } from 'ramda'
import { P, match } from 'ts-pattern'
import { addErectionAtLandscape, terrainForErection } from '../board/erections'
import { onlyViaBonusActions } from '../board/frame'
import { checkLandscapeFree, checkLandTypeMatches, erectableLocations, erectableLocationsCol } from '../board/landscape'
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

export const complete =
  (state: GameStatePlaying) =>
  (partial: string[]): string[] => {
    const player = view(activeLens(state), state)
    return (
      match<string[], string[]>(partial)
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
        .with([GameCommandEnum.SETTLE, P._], ([, settlement]) =>
          // Return all the coords which match the terrain for this building...
          erectableLocations(settlement as SettlementEnum, player)
        )
        .with([GameCommandEnum.SETTLE, P._, P._], ([, settlement, col]) =>
          erectableLocationsCol(settlement as SettlementEnum, col, player)
        )
        .with([GameCommandEnum.SETTLE, P._, P._, P._], ([, settlement, _col, _row]) =>
          settlementCostOptions(costForSettlement(settlement as SettlementEnum), player)
        )
        // TODO: only show '' if the command is ultimately valid
        .with([GameCommandEnum.SETTLE, P._, P._, P._, P._], ([, settlement, col, row, resources]) => [''])
        .otherwise(() => [])
    )
  }

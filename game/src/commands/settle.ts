import { filter, pipe, view } from 'ramda'
import { P, match } from 'ts-pattern'
import { addErectionAtLandscape } from '../board/erections'
import { clearNeutralBuildingPhase, onlyViaBonusActions } from '../board/frame'
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
    checkLandscapeFree(row, col, settlement),
    checkLandTypeMatches(row, col, settlement),
    payForSettlement(settlement, input),
    removeSettlementFromUnbuilt(settlement),
    addErectionAtLandscape(row, col, settlement),
    clearNeutralBuildingPhase
  )
}

export const complete =
  (state: GameStatePlaying) =>
  (partial: string[]): string[] => {
    const player = view(activeLens(state), state)
    return (
      match<string[], string[]>(partial)
        .with([], () => {
          if (onlyViaBonusActions(GameCommandEnum.SETTLE)(state) === undefined) return []
          if (complete(state)([GameCommandEnum.SETTLE]).length === 0) return []
          return [GameCommandEnum.SETTLE]
        })
        .with([GameCommandEnum.SETTLE], () => {
          return filter(
            (settlement) => {
              const playerFood = costFood(player)
              const playerEnergy = costEnergy(player)
              const { food: requiredFood, energy: requiredEnergy } = costForSettlement(settlement)
              return playerFood >= requiredFood && playerEnergy >= requiredEnergy
            },
            view(activeLens(state), state).settlements
          )
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

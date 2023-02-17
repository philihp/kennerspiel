import { filter, pipe } from 'ramda'
import { addErectionAtLandscape } from '../board/erections'
import { onlyViaBonusActions } from '../board/frame'
import { checkLandscapeFree, checkLandTypeMatches } from '../board/landscape'
import { payCost, withActivePlayer } from '../board/player'
import { costEnergy, costFood, parseResourceParam } from '../board/resource'
import { costForSettlement } from '../board/settlements'
import { Cost, GameCommandEnum, GameCommandSettleParams, SettlementEnum, StateReducer } from '../types'

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

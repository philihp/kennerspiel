import { getCost, getPlayer, payCost, setPlayerCurried } from '../board/player'
import { costEnergy, costFood, parseResourceParam } from '../board/resource'
import { GameStatePlaying } from '../types'

export const stoneMerchant =
  (param = '') =>
  (state: GameStatePlaying | undefined): GameStatePlaying | undefined => {
    if (state === undefined) return undefined
    const inputs = parseResourceParam(param)
    const energy = costEnergy(inputs)
    const food = costFood(inputs)

    const player = getPlayer(state)
    const costPaid = payCost(inputs)(player)
    const gotStone = getCost({ stone: Math.floor(Math.min(energy, food / 2, 5)) })(costPaid)

    return setPlayerCurried(gotStone)(state)
  }

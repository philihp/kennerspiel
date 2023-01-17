import { getCost, getPlayer, payCost, setPlayer } from '../board/player'
import { parseResourceParam, totalGoods, differentGoods } from '../board/resource'
import { GameStatePlaying } from '../types'

export const market =
  (input = '') =>
  (state: GameStatePlaying | undefined): GameStatePlaying | undefined => {
    if (state === undefined) return undefined
    const inputs = parseResourceParam(input)
    if (totalGoods(inputs) !== 4) return undefined
    if (differentGoods(inputs) !== 4) return undefined
    const player = getPlayer(state)
    const paidCost = payCost(inputs)(player)
    if (paidCost === undefined) return undefined
    const gotOut = getCost({
      bread: 1,
      nickel: 1,
      penny: 2,
    })(paidCost)
    return setPlayer(state, gotOut)
  }

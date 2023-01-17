import { getCost, getPlayer, payCost, setPlayer } from '../board/player'
import { parseResourceParam, totalGoods, differentGoods, multiplyGoods, maskGoods } from '../board/resource'
import { Cost, GameStatePlaying } from '../types'

const ALLOWED_OUTPUT: (keyof Cost)[] = ['peat', 'clay', 'wood', 'sheep', 'grain', 'penny']

export const cloisterCourtyard =
  (input = '', output = '') =>
  (state: GameStatePlaying | undefined): GameStatePlaying | undefined => {
    if (state === undefined) return undefined
    const inputs = parseResourceParam(input)
    const outputs = parseResourceParam(output)
    if (totalGoods(inputs) !== 3) return undefined
    if (differentGoods(inputs) !== 3) return undefined
    if (totalGoods(maskGoods(ALLOWED_OUTPUT)(outputs)) !== 1 && differentGoods(outputs) !== 1) return undefined
    const player = getPlayer(state)
    const paidCost = payCost(inputs)(player)
    if (paidCost === undefined) return undefined
    const gotOut = getCost(multiplyGoods(6)(outputs))(paidCost)
    return setPlayer(state, gotOut)
  }

import { pipe } from 'ramda'
import { getCost, payCost, withActivePlayer } from '../board/player'
import { parseResourceParam, totalGoods, differentGoods, multiplyGoods, maskGoods } from '../board/resource'
import { Cost } from '../types'

const ALLOWED_OUTPUT: (keyof Cost)[] = ['peat', 'clay', 'wood', 'sheep', 'grain', 'penny']

export const cloisterCourtyard = (input = '', output = '') => {
  const inputs = parseResourceParam(input)
  const outputs = parseResourceParam(output)
  if (totalGoods(inputs) !== 3) return () => undefined
  if (differentGoods(inputs) !== 3) return () => undefined
  if (totalGoods(maskGoods(ALLOWED_OUTPUT)(outputs)) !== 1 && differentGoods(outputs) !== 1) return () => undefined
  return withActivePlayer(
    pipe(
      //
      payCost(inputs),
      getCost(multiplyGoods(6)(outputs))
    )
  )
}

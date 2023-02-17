import { pipe } from 'ramda'
import { getCost, withActivePlayer, payCost } from '../board/player'
import { costEnergy, costFood, parseResourceParam } from '../board/resource'
import { StateReducer } from '../types'

export const stoneMerchant = (param = ''): StateReducer => {
  const inputs = parseResourceParam(param)
  const payCostOfInputs = payCost(inputs)
  const getStoneInPower = getCost({ stone: Math.floor(Math.min(costEnergy(inputs), costFood(inputs) / 2, 5)) })
  return (state) =>
    state &&
    withActivePlayer(
      //
      pipe(
        //
        payCostOfInputs,
        getStoneInPower
      )
    )(state)
}

import { pipe } from 'ramda'
import { getCost, withActivePlayer, payCost } from '../board/player'
import { parseResourceParam, totalGoods, differentGoods } from '../board/resource'
import { GameStatePlaying } from '../types'

export const market = (input = '') => {
  const inputs = parseResourceParam(input)
  if (totalGoods(inputs) !== 4) return () => undefined
  if (differentGoods(inputs) !== 4) return () => undefined
  return (state: GameStatePlaying | undefined): GameStatePlaying | undefined =>
    state &&
    withActivePlayer(
      pipe(
        payCost(inputs),
        getCost({
          bread: 1,
          nickel: 1,
          penny: 2,
        })
      )
    )(state)
}

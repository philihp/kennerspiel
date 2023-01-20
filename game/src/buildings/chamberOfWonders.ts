import { pipe } from 'ramda'
import { payCost, withActivePlayer } from '../board/player'
import { differentGoods, parseResourceParam } from '../board/resource'
import { Cost, Tableau } from '../types'

const check13DifferentGoods =
  (input: Cost) =>
  (player: Tableau | undefined): Tableau | undefined =>
    differentGoods(input) === 13 ? player : undefined

const getWonder = (player: Tableau | undefined): Tableau | undefined =>
  // TODO
  player

export const chamberOfWonders = (param = '') => {
  const inputs = parseResourceParam(param)
  return withActivePlayer(
    pipe(
      //
      check13DifferentGoods(inputs),
      payCost(inputs),
      getWonder
    )
  )
}

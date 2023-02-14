import { pipe } from 'ramda'
import { getWonder, payCost, withActivePlayer } from '../board/player'
import { differentGoods, parseResourceParam } from '../board/resource'
import { removeWonder } from '../board/state'
import { Cost, GameStatePlaying, Tableau } from '../types'

const check13DifferentGoods =
  (input: Cost) =>
  (player: Tableau | undefined): Tableau | undefined => {
    const count = differentGoods(input)
    if (count !== 13) return undefined
    return player
  }

export const chamberOfWonders =
  (param = '') =>
  (state?: GameStatePlaying): GameStatePlaying | undefined => {
    const inputs = parseResourceParam(param)
    return pipe(
      withActivePlayer(
        pipe(
          //
          check13DifferentGoods(inputs),
          payCost(inputs),
          getWonder()
        )
      ),
      removeWonder
    )(state)
  }

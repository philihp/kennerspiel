import { pipe } from 'ramda'
import { payCost, withActivePlayer } from '../board/player'
import { differentGoods, parseResourceParam } from '../board/resource'
import { Cost, GameStatePlaying, Tableau } from '../types'

const check13DifferentGoods =
  (input: Cost) =>
  (player: Tableau | undefined): Tableau | undefined => {
    const count = differentGoods(input)
    if (count !== 13) return undefined
    return player
  }

const getWonder = (player: Tableau | undefined): Tableau | undefined => {
  return (
    player && {
      ...player,
      wonders: player.wonders + 1,
    }
  )
}

const removeWonder = (state?: GameStatePlaying): GameStatePlaying | undefined => {
  if (state === undefined) return state
  const { wonders } = state
  if (wonders === 0) return undefined
  return {
    ...state,
    wonders: wonders - 1,
  }
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
          getWonder
        )
      ),
      removeWonder
    )(state)
  }

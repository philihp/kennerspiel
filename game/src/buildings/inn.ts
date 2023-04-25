import {
  add,
  always,
  ascend,
  curry,
  descend,
  flatten,
  flip,
  identity,
  map,
  max,
  min,
  pipe,
  range,
  reverse,
  sort,
  uniq,
  unnest,
  view,
} from 'ramda'
import { P, match } from 'ts-pattern'
import { activeLens, getCost, payCost, withActivePlayer } from '../board/player'
import { costFood, foodCostOptions, parseResourceParam, stringRepeater } from '../board/resource'
import { GameStatePlaying, ResourceEnum } from '../types'

export const inn = (param = '') => {
  const inputs = parseResourceParam(param)
  const hasWine = (inputs.wine ?? 0) >= 1
  const food = Math.min(costFood(inputs) - (hasWine ? 1 : 0), 7)
  return withActivePlayer(
    pipe(
      //
      payCost(inputs),
      getCost({
        nickel: hasWine ? 1 : 0,
        penny: (hasWine ? 1 : 0) + food,
      })
    )
  )
}

export const complete = curry((partial: string[], state: GameStatePlaying): string[] =>
  match(partial)
    .with([], () => {
      const player = view(activeLens(state), state)
      return pipe(
        //
        map(flip(foodCostOptions)(player)),
        flatten,
        uniq<string>,
        map((s): string[] => {
          const { wine: countWine = 0 } = parseResourceParam(s)
          if (player.wine === countWine) {
            return [s]
          }
          return [`${s}${ResourceEnum.Wine}`, s]
        }),
        unnest,
        uniq
      )(reverse(range(0)(add(1)(min<number>(7)(costFood(player))))))
    })
    .with([P._], always(['']))
    .otherwise(always([]))
)

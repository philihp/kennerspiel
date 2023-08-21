import { always, cond, curry, identity, pipe, reduce, view } from 'ramda'
import { P, match } from 'ts-pattern'
import { getCost, withActivePlayer, payCost, activeLens } from '../board/player'
import { parseResourceParam, totalGoods, differentGoods, allResource, combinations } from '../board/resource'
import { GameStatePlaying, StateReducer } from '../types'

export const market = (input = ''): StateReducer => {
  const goods = parseResourceParam(input)
  return cond<[GameStatePlaying | undefined], GameStatePlaying | undefined>([
    [always(input === ''), identity],
    [
      always(totalGoods(goods) === 4 && differentGoods(goods) === 4),
      withActivePlayer(
        pipe(
          payCost(goods),
          getCost({
            bread: 1,
            nickel: 1,
            penny: 2,
          })
        )
      ),
    ],
  ])
}

export const complete = curry((partial: string[], state: GameStatePlaying): string[] =>
  match<string[], string[]>(partial)
    .with([], () => {
      const player = view(activeLens(state), state)
      return [
        ...combinations(
          4,
          reduce(
            (accum, [key, token]) => {
              if (player[key]) accum.push(token)
              return accum
            },
            [] as string[],
            allResource
          )
        ),
        '',
      ]
    })
    .with([P._], always(['']))
    .otherwise(always([]))
)

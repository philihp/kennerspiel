import { always, curry, identity, pipe, reduce, view } from 'ramda'
import { P, match } from 'ts-pattern'
import { activeLens, getCost, payCost, withActivePlayer } from '../board/player'
import { allResource, combinations, differentGoods, parseResourceParam } from '../board/resource'
import { GameStatePlaying, StateReducer } from '../types'

export const filialChurch = (param = ''): StateReducer => {
  const inputs = parseResourceParam(param)
  if (differentGoods(inputs) < 5) return identity
  return withActivePlayer(
    pipe(
      //
      payCost(inputs),
      getCost({ reliquary: 1 })
    )
  )
}

export const complete = curry((partial: string[], state: GameStatePlaying): string[] =>
  match<string[], string[]>(partial)
    .with([], () => {
      const player = view(activeLens(state), state)
      return [
        ...combinations(
          5,
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

import { add, always, ap, curry, map, min, pipe, range, reverse, unnest, view } from 'ramda'
import { P, match } from 'ts-pattern'
import { activeLens, getCost, payCost, withActivePlayer } from '../board/player'
import { parseResourceParam, resourceArray, stringRepeater } from '../board/resource'
import { GameStatePlaying, ResourceEnum } from '../types'

export const winery = (input = '') => {
  const { wine = 0, grape = 0 } = parseResourceParam(input)
  return withActivePlayer(
    pipe(
      //
      payCost({ grape }),
      getCost({ wine: grape }),
      payCost({ wine }),
      getCost({
        nickel: (wine ?? 0) > 0 ? 1 : 0,
        penny: (wine ?? 0) > 0 ? 2 : 0,
      })
    )
  )
}

export const complete = curry((partial: string[], state: GameStatePlaying): string[] =>
  match(partial)
    .with([], () => {
      const player = view(activeLens(state), state)
      const { grape = 0, wine = 0 } = player

      // step 1: possibilities for amounts of grape
      const grapeAmounts: number[] = reverse<number>(range(0, 1 + grape))

      // step 2: for each amount of flour to use up, multiply by ways of getting that energy
      const paymentAmounts = map(
        (grapeAmount: number): [number, string] => [
          //
          wine + grapeAmount,
          stringRepeater(ResourceEnum.Grape, grapeAmount),
        ],
        grapeAmounts
      )

      // step 3: for every pair of an amount of resulting wine, and a list of grape
      return unnest(
        map(
          ([sellableWine, resourceString]) =>
            pipe(
              //
              min<number>(1),
              add(1),
              range(0),
              reverse<number>,
              ap([stringRepeater('Wn')]),
              map((s) => resourceString + String(s))
            )(sellableWine),
          paymentAmounts
        )
      )
    })
    .with([P._], always(['']))
    .otherwise(always([]))
)

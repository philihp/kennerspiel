import { always, concat, curry, equals, filter, lift, map, not, pipe, range, view } from 'ramda'
import { P, match } from 'ts-pattern'
import { activeLens, getCost, payCost, withActivePlayer } from '../board/player'
import { parseResourceParam, stringRepeater } from '../board/resource'
import { GameStatePlaying } from '../types'

export const brewery = (param = '') => {
  const { malt = 0, grain = 0, beer = 0 } = parseResourceParam(param)
  const brewIterations = Math.min(malt, grain)
  const sellIterations = Math.min(beer, 1)
  return withActivePlayer(
    pipe(
      //
      payCost({ malt, grain }),
      getCost({ beer: brewIterations }),
      payCost({ beer: sellIterations }),
      getCost({ penny: 2 * sellIterations, nickel: sellIterations })
    )
  )
}

export const complete = curry((partial: string[], state: GameStatePlaying): string[] =>
  match(partial)
    .with([], () => {
      const { malt = 0, grain = 0, beer = 0 } = view(activeLens(state), state)

      // step 1: figure out the maximum number of iterations
      const maxBrewIterations = Math.min(malt, grain)
      const maxSellIterations = Math.min(Math.max(beer, maxBrewIterations), 1)

      // step 2: for each iteration, repeat the inputs
      const brewOptions: string[] = map(
        (n) => `${stringRepeater('Gn', n)}${stringRepeater('Ma', n)}`,
        range(0, 1 + maxBrewIterations)
      )
      const sellOptions: string[] = map((n) => stringRepeater('Be')(n), range(0, 1 + maxSellIterations))

      const removeBeer: (s: string) => boolean = (s) => {
        const noBeer = not(equals(beer, 0))
        const onlySell = not(equals(s, 'Be'))
        const res = noBeer || onlySell
        return res
      }
      const concatStr = (a: string, b: string) => concat(a, b)

      // step 3: then cartesian join them together, but also remove the entry for 1 beer without brewing
      // if the playerhas no beer available to sell
      return filter(removeBeer, lift(concatStr)(brewOptions, sellOptions))
    })
    .with([P._], always(['']))
    .otherwise(always([]))
)

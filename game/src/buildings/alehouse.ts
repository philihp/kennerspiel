import { always, curry, lift, pipe, view } from 'ramda'
import { P, match } from 'ts-pattern'
import { activeLens, getCost, payCost, withActivePlayer } from '../board/player'
import { concatStr, parseResourceParam, resourceArray } from '../board/resource'
import { GameStatePlaying, ResourceEnum } from '../types'

export const alehouse = (input = '') => {
  const { beer = 0, whiskey = 0 } = parseResourceParam(input)
  const coins = Math.min(1, beer) * 8 + Math.min(1, whiskey) * 7
  return withActivePlayer(
    pipe(
      //
      payCost({ beer, whiskey }),
      getCost({
        penny: coins % 5,
        nickel: Math.floor(coins / 5),
      })
    )
  )
}

export const complete = curry((partial: string[], state: GameStatePlaying): string[] =>
  match(partial)
    .with([], () => {
      const { beer = 0, whiskey = 0 } = view(activeLens(state), state)
      const beerArr = resourceArray(ResourceEnum.Beer, 1)(beer)
      const whisArr = resourceArray(ResourceEnum.Whiskey, 1)(whiskey)
      return lift(concatStr)(beerArr, whisArr)
    })
    .with([P._], always(['']))
    .otherwise(always([]))
)

import { pipe } from 'ramda'
import { getCost, payCost, withActivePlayer } from '../board/player'
import { parseResourceParam } from '../board/resource'

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

import { pipe } from 'ramda'
import { getCost, payCost, withActivePlayer } from '../board/player'
import { parseResourceParam } from '../board/resource'

export const shipyard = (param = '') => {
  const iterations = (parseResourceParam(param).wood ?? 0) / 2
  return withActivePlayer(
    pipe(
      //
      payCost({ wood: iterations * 2 }),
      getCost({ ornament: iterations, nickel: iterations })
    )
  )
}

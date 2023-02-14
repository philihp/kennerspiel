import { pipe } from 'ramda'
import { getWonder, payCost, withActivePlayer } from '../board/player'
import { parseResourceParam } from '../board/resource'
import { removeWonder } from '../board/state'

export const sacristy = (param = '') => {
  const input = parseResourceParam(param)
  const iterations = Math.min(
    1,
    Math.max(
      //
      input.book ?? 0,
      input.pottery ?? 0,
      input.ornament ?? 0,
      input.reliquary ?? 0
    )
  )
  return pipe(
    withActivePlayer(
      pipe(
        //
        payCost(input),
        getWonder(iterations)
      )
    ),
    removeWonder
  )
}

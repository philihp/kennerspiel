import { any, identity, pipe, sum } from 'ramda'
import { getCost, payCost, withActivePlayer } from '../board/player'
import { parseResourceParam } from '../board/resource'
import { StateReducer } from '../types'

export const druidsHouse = (input = '', output = ''): StateReducer => {
  const { book = 0 } = parseResourceParam(input)
  const { wood = 0, clay = 0, grain = 0, penny = 0, sheep = 0, peat = 0 } = parseResourceParam(output)
  if (!book) return identity
  const outputs = [wood, clay, grain, penny, sheep, peat]
  if (sum(outputs) !== 8 || any((n) => n === 5, outputs) === false || any((n) => n === 3, outputs) === false) {
    return () => undefined
  }
  return withActivePlayer(
    pipe(
      //
      payCost({ book }),
      getCost({ wood, clay, grain, penny, sheep, peat })
    )
  )
}

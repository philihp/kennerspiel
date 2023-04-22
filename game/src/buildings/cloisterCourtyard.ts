import { addIndex, always, curry, filter, join, keys, map, pipe, reduce, view } from 'ramda'
import { P, match } from 'ts-pattern'
import { activeLens, getCost, payCost, withActivePlayer } from '../board/player'
import {
  parseResourceParam,
  totalGoods,
  differentGoods,
  multiplyGoods,
  maskGoods,
  allResource,
  combinations,
  basicResources,
} from '../board/resource'
import { Cost, GameStatePlaying, ResourceEnum } from '../types'

const ALLOWED_OUTPUT: (keyof Cost)[] = ['peat', 'clay', 'wood', 'sheep', 'grain', 'penny']

export const cloisterCourtyard = (input = '', output = '') => {
  const inputs = parseResourceParam(input)
  const outputs = parseResourceParam(output)
  if (totalGoods(inputs) !== 3) return () => undefined
  if (differentGoods(inputs) !== 3) return () => undefined
  if (totalGoods(maskGoods(ALLOWED_OUTPUT)(outputs)) !== 1 && differentGoods(outputs) !== 1) return () => undefined
  return withActivePlayer(
    pipe(
      //
      payCost(inputs),
      getCost(multiplyGoods(6)(outputs))
    )
  )
}

export const complete = curry((partial: string[], state: GameStatePlaying): string[] =>
  match<string[], string[]>(partial)
    .with([], () => {
      const player = view(activeLens(state), state)
      return [
        '',
        ...combinations(
          3,
          reduce(
            (accum, [key, token]) => {
              if (player[key]) accum.push(token)
              return accum
            },
            [] as string[],
            allResource
          )
        ),
      ]
    })
    .with([P._], () => basicResources)
    .with([P._, P._], always(['']))
    .otherwise(always([]))
)

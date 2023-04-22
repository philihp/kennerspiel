import { addIndex, always, any, curry, filter, identity, map, max, pipe, range, reduce, sum, view } from 'ramda'
import { P, match } from 'ts-pattern'
import { activeLens, getCost, payCost, withActivePlayer } from '../board/player'
import { basicResources, parseResourceParam, stringRepeater, combinations } from '../board/resource'
import { GameStatePlaying, ResourceEnum, StateReducer } from '../types'

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

export const complete = curry((partial: string[], state: GameStatePlaying): string[] =>
  match(partial)
    .with([], () =>
      map<number, string>(
        // gross
        stringRepeater(ResourceEnum.Book),
        range(0, 1 + max(1, view(activeLens(state), state).book ?? 0))
      )
    )
    .with([P._], () =>
      addIndex(reduce<ResourceEnum, string[]>)(
        (accum: string[], fiveGood: ResourceEnum, ndx: number) => {
          accum.push(
            ...map(
              (threeGood): string => `${stringRepeater(fiveGood, 5)}${stringRepeater(threeGood, 3)}`,
              filter<ResourceEnum>((r) => r !== fiveGood)(basicResources)
            )
          )
          return accum
        },
        [] as string[],
        basicResources
      )
    )
    .with([P._, P._], always(['']))
    .otherwise(always([]))
)

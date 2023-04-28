import { always, curry, identity, pipe, reduce, view } from 'ramda'
import { P, match } from 'ts-pattern'
import { activeLens, getCost, payCost, withActivePlayer } from '../board/player'
import { costPoints, parseResourceParam, rewardCostOptions } from '../board/resource'
import { BuildingEnum, Cost, GameStatePlaying, StateReducer, TableauReducer, Tile } from '../types'
import { forestLocations, moorLocations } from '../board/landscape'

// TODO: refactor this with houseOfTheBrotherhood

const countForestsAndMoors: (landscape: readonly Tile[][]) => number = reduce(
  (accum: number, row: Tile[]) =>
    accum +
    reduce(
      (accum: number, [, erection]: Tile) =>
        erection && [BuildingEnum.Forest, BuildingEnum.Peat].includes(erection) ? accum + 1 : accum,
      0,
      row
    ),
  0
)

const checkPointsForMoorsAndForests =
  (output: Cost): TableauReducer =>
  (player) => {
    if (player === undefined) return undefined
    const forestsAndMoors = countForestsAndMoors(player.landscape)
    if (costPoints(output) > forestsAndMoors) return undefined
    return player
  }

export const festivalGround = (input = '', output = ''): StateReducer => {
  const inputBeer = parseResourceParam(input)
  const outputPoints = parseResourceParam(output)
  if (inputBeer.beer !== 1) return identity
  return withActivePlayer(
    pipe(
      //
      payCost(inputBeer),
      checkPointsForMoorsAndForests(outputPoints),
      getCost(outputPoints)
    )
  )
}

export const complete = curry((partial: string[], state: GameStatePlaying): string[] => {
  const player = view(activeLens(state), state)
  return match(partial)
    .with([], () => {
      if (player.beer) return ['Be', '']
      return ['']
    })
    .with([P._], () => rewardCostOptions(forestLocations(player).length + moorLocations(player).length))
    .with([P._, P._], always(['']))
    .otherwise(always([]))
})

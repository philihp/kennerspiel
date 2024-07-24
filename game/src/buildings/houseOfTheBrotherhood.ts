import { always, curry, flatten, identity, map, pipe, reduce, sum, view } from 'ramda'
import { P, match } from 'ts-pattern'
import { isCloisterBuilding } from '../board/buildings'
import { activeLens, getCost, payCost, withActivePlayer } from '../board/player'
import { costMoney, costPoints, parseResourceParam, rewardCostOptions, coinCostOptions } from '../board/resource'
import { GameCommandConfigParams, GameStatePlaying, Tile } from '../types'

const pointsPerCloister = (config: GameCommandConfigParams) =>
  match(config)
    .with({ players: 1 }, () => 1.0)
    .with({ players: 2, length: 'long' }, () => 1.5)
    .otherwise(() => 2.0)

// given a row of tiles, return all of the buildings where there is a building AND a clergy
const cloistersInRow = map(([_, building]: Tile) => (isCloisterBuilding(building) ? 1 : 0))

// given a list of rows, do the thing
const cloistersInLandscape = map((landRow: Tile[]) => cloistersInRow(landRow))

const entitledPointCount = (state: GameStatePlaying | undefined): number => {
  if (state === undefined) return -1
  const multiplier = pointsPerCloister(state.config)
  const cloisters = sum(flatten(cloistersInLandscape(state.players[state.frame.activePlayerIndex].landscape)))
  return multiplier * cloisters
}

// TODO: turn into R.when
const checkCloistersForPoints = (points: number) => (state: GameStatePlaying | undefined) => {
  if (entitledPointCount(state) < points) return undefined
  return state
}

export const houseOfTheBrotherhood = (param1 = '', param2 = '') => {
  const input = parseResourceParam(param1)
  const output = parseResourceParam(param2)
  const costOutput = costPoints(output)
  if (costMoney(input) < 5) return identity
  return pipe(
    //
    checkCloistersForPoints(costOutput),
    withActivePlayer(
      pipe(
        //
        payCost(input),
        getCost(output)
      )
    )
  )
}

export const complete = curry((partial: string[], state: GameStatePlaying): string[] => {
  const player = view(activeLens(state), state)
  return match(partial)
    .with([], () => [...coinCostOptions(5, player), ''])
    .with([P._], ([paidNickels]) => {
      const input = parseResourceParam(paidNickels)
      if (costMoney(input) < 5) return []
      return rewardCostOptions(entitledPointCount(state))
    })
    .with([P._, P._], always(['']))
    .otherwise(always([]))
})

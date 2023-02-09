import { flatten, identity, map, pipe, reduce, sum } from 'ramda'
import { match } from 'ts-pattern'
import { isCloisterBuilding } from '../board/buildings'
import { getCost, subtractCoins, withActivePlayer } from '../board/player'
import { costMoney, costPoints, parseResourceParam } from '../board/resource'
import { BuildingEnum, GameCommandConfigParams, GameStatePlaying, Tile } from '../types'

const pointsPerCloister = (config: GameCommandConfigParams) =>
  match(config)
    .with({ players: 1 }, () => 1.0)
    .with({ players: 2, length: 'long' }, () => 1.5)
    .otherwise(() => 2.0)

// given a row of tiles, return all of the buildings where there is a building AND a clergy
const cloistersInRow = map(([_, building]: Tile) => (isCloisterBuilding(building) ? 1 : 0))

// given a list of rows, do the thing
const cloistersInLandscape = map((landRow: Tile[]) => cloistersInRow(landRow as Tile[]))

const checkCloistersForPoints = (points: number) => (state: GameStatePlaying | undefined) => {
  if (state === undefined) return undefined
  const multiplier = pointsPerCloister(state.config)
  const cloisters = sum(flatten(cloistersInLandscape(state.players[state.frame.activePlayerIndex].landscape)))
  if (multiplier * cloisters < points) return undefined
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
        subtractCoins(5),
        getCost(output)
      )
    )
  )
}

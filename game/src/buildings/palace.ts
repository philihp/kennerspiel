import { pipe, reduce } from 'ramda'
import { setFrameToAllowFreeUsage } from '../board/frame'
import { payCost, withActivePlayer } from '../board/player'
import { parseResourceParam } from '../board/resource'
import { BuildingEnum, GameStatePlaying, NextUseClergy, StateReducer, Tableau, Tile } from '../types'

// given a row of tiles, return all of the buildings where there is a building AND a clergy
const occupiedBuildingsInRow = reduce(
  (rAccum, [_, building, clergy]: Tile) => (building && clergy ? [...rAccum, building] : rAccum),
  [] as BuildingEnum[]
)

// given a list of rows, do the thing
const occupiedBuildingsForLandscape = reduce(
  (rAccum, landRow: Tile[]) => [...rAccum, ...occupiedBuildingsInRow(landRow as Tile[])],
  [] as BuildingEnum[]
)

const occupiedBuildingsForPlayers = (players: Tableau[]) =>
  reduce(
    (pAccum, { landscape }) => [...pAccum, ...occupiedBuildingsForLandscape(landscape)],
    [] as BuildingEnum[],
    players
  )

const allOccupiedBuildingsUsable: StateReducer = (state) => {
  if (state === undefined) return state
  return setFrameToAllowFreeUsage(occupiedBuildingsForPlayers(state.players))(state)
}

export const palace = (input = '') => {
  const { wine = 0 } = parseResourceParam(input)
  if (wine === 0) return (state: GameStatePlaying | undefined) => state
  return pipe(
    //
    withActivePlayer(payCost({ wine })),
    allOccupiedBuildingsUsable
  )
}

import { pipe, reduce } from 'ramda'
import { findBuilding } from '../board/landscape'
import { getCost, withActivePlayer } from '../board/player'
import { BuildingEnum, StateReducer, NextUseClergy, Tile } from '../types'

const whichIndexHasBuilding =
  (building: BuildingEnum) =>
  (landscapes: Tile[][][]): [number, number, number] | undefined => {
    for (let i = 0; i < landscapes.length; i++) {
      const location = findBuilding(building)(landscapes[i])
      if (location) return [i, ...location]
    }
    return undefined
  }

const ADJACENT = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
]

export const setNeighboringCloisterToGarden: StateReducer = (state) => {
  if (state === undefined) return state
  const location = whichIndexHasBuilding(BuildingEnum.CloisterGarden)(state.players.map((p) => p.landscape))
  if (location === undefined) return state
  const [player, row, col] = location
  const checkLocations: [number, number, number][] = ADJACENT.map(([rowMod, colMod]) => [
    player,
    row + rowMod,
    col + colMod,
  ])

  const cloisterNeighbors = pipe(
    reduce((accum, curr: [number, number, number]) => {
      const [p, r, c] = curr
      const landStack = state.players[p].landscape?.[r]?.[c]
      if (landStack === undefined) return accum
      const [_, building, clergy] = landStack
      if (building === undefined) return accum
      if (clergy !== undefined) return accum
      accum.push(building)
      return accum
    }, [] as BuildingEnum[])
  )(checkLocations)
  return {
    ...state,
    frame: {
      ...state.frame,
      usableBuildings: cloisterNeighbors,
      nextUse: NextUseClergy.Free,
    },
  }
}

export const cloisterGarden = () =>
  pipe(
    //
    withActivePlayer(getCost({ grape: 1 })),
    setNeighboringCloisterToGarden
  )

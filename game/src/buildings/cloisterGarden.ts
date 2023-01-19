import { filter, pipe, reduce } from 'ramda'
import { isCloisterBuilding } from '../board/buildings'
import { findBuilding } from '../board/landscape'
import { withActivePlayer } from '../board/player'
import { BuildingEnum, GameStatePlaying, Tile } from '../types'

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

export const setNeighboringCloisterToGarden = (state: GameStatePlaying | undefined): GameStatePlaying | undefined => {
  if (state === undefined) return undefined
  const location = whichIndexHasBuilding(BuildingEnum.CloisterGarden)(state.players.map((p) => p.landscape))
  if (location === undefined) return undefined
  const [player, row, col] = location
  const checkLocations: [number, number, number][] = ADJACENT.map(([rowMod, colMod]) => [
    player,
    row + rowMod,
    col + colMod,
  ])

  const cloisterNeighbors = pipe(
    reduce((accum, curr: [number, number, number]) => {
      const [p, r, c] = curr
      const buildingHere = state.players[p].landscape?.[r]?.[c]?.[1]
      if (buildingHere === undefined) return accum
      accum.push(buildingHere)
      return accum
    }, [] as BuildingEnum[]),
    filter(isCloisterBuilding)
  )(checkLocations)
  return {
    ...state,
    usableBuildings: cloisterNeighbors,
  }
}

export const cloisterGarden = () =>
  pipe(
    withActivePlayer(
      (player) =>
        player && {
          ...player,
          grape: player.grape + 1,
        }
    ),
    setNeighboringCloisterToGarden
  )

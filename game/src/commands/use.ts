import { match, P } from 'ts-pattern'
import { getPlayer, isLayBrother, isPrior, setPlayer } from '../board/player'
import { farmyard } from '../buildings/farmyard'
import { BuildingEnum, GameStatePlaying, Tile } from '../types'

export const findBuilding = (landscape: Tile[][], building: BuildingEnum): { row?: number; col?: number } => {
  let row
  let col
  landscape.forEach((landRow, r) => {
    landRow.forEach(([_l, b, _c], c) => {
      if (building === b) {
        row = r
        col = c
      }
    })
  })
  return { row, col }
}

export const moveClergyToOwnBuilding = (
  state: GameStatePlaying | undefined,
  building: BuildingEnum,
  usePrior: boolean
): GameStatePlaying | undefined => {
  if (state === undefined) return undefined
  const player = getPlayer(state)
  const { row, col } = findBuilding(player.landscape, building)
  if (row === undefined || col === undefined) return undefined
  const layBrothers = player.clergy.filter(isLayBrother)
  const priors = player.clergy.filter(isPrior)
  if (usePrior && priors.length === 0) return undefined

  const nextClergy = usePrior ? priors[0] : layBrothers[0]
  const [land] = player.landscape[row][col]

  return setPlayer(state, {
    ...player,
    landscape: [
      ...player.landscape.slice(0, row),
      [
        ...player.landscape[row].slice(0, col),
        [land, building, nextClergy] as Tile,
        ...player.landscape[row].slice(col + 1),
      ],
      ...player.landscape.slice(row + 1),
    ],
    clergy: [...layBrothers.slice(usePrior ? 0 : 1), ...priors.slice(usePrior ? 1 : 0)],
  })
}

export const use = (state: GameStatePlaying, building: BuildingEnum, params: string[]): GameStatePlaying | undefined =>
  moveClergyToOwnBuilding(
    match<[BuildingEnum, string[]], GameStatePlaying | undefined>([building, params])
      .with(
        [
          P.union(BuildingEnum.FarmYardR, BuildingEnum.FarmYardG, BuildingEnum.FarmYardB, BuildingEnum.FarmYardW),
          [P.select()],
        ],
        (param) => farmyard(state, { param })
      )
      .otherwise(
        () => undefined
        // { throw new Error(`Invalid params [${params}] for building ${building}`) }
      ),

    building,
    false // TODO: we need a way of passing active player to the owner so they can choose
  )

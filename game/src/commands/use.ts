import { pipe } from 'ramda'
import { match, P } from 'ts-pattern'
import { getPlayer, isLayBrother, isPrior, setPlayer } from '../board/player'
import { bakery } from '../buildings/bakery'
import { clayMound } from '../buildings/clayMound'
import { cloisterCourtyard } from '../buildings/cloisterCourtyard'
import { cloisterGarden } from '../buildings/cloisterGarden'
import { cloisterOffice } from '../buildings/cloisterOffice'
import { farmyard } from '../buildings/farmyard'
import { fuelMerchant } from '../buildings/fuelMerchant'
import { grainStorage } from '../buildings/grainStorage'
import { market } from '../buildings/market'
import { peatCoalKiln } from '../buildings/peatCoalKiln'
import { stoneMerchant } from '../buildings/stoneMerchant'
import { windmill } from '../buildings/windmill'
import { BuildingEnum, GameStatePlaying, Tile } from '../types'

const checkBuildingUsable =
  (building: BuildingEnum) =>
  (state: GameStatePlaying | undefined): GameStatePlaying | undefined => {
    if (state === undefined) return undefined
    if (state.usableBuildings && !state.usableBuildings.includes(building)) return undefined
    return state
  }

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

export const moveClergyToOwnBuilding =
  (building: BuildingEnum) =>
  (state: GameStatePlaying | undefined): GameStatePlaying | undefined => {
    if (state === undefined) return undefined
    const player = getPlayer(state)
    const { row, col } = findBuilding(player.landscape, building)
    if (row === undefined || col === undefined) return undefined
    const [land] = player.landscape[row][col]

    const priors = player.clergy.filter(isPrior)
    if (state.nextUsePrior && priors.length === 0) return undefined
    const nextClergy = (state.nextUsePrior ? priors : player.clergy)[0]
    if (nextClergy === undefined) return undefined

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
      clergy: player.clergy.filter((c) => c !== nextClergy),
    })
  }

export const use = (building: BuildingEnum, params: string[]) =>
  pipe(
    checkBuildingUsable(building),
    moveClergyToOwnBuilding(building),
    match<[BuildingEnum, string[]], (state: GameStatePlaying | undefined) => GameStatePlaying | undefined>([
      building,
      params,
    ])
      .with(
        [
          P.union(BuildingEnum.FarmYardR, BuildingEnum.FarmYardG, BuildingEnum.FarmYardB, BuildingEnum.FarmYardW),
          [P.select()],
        ],
        farmyard
      )
      .with(
        [
          P.union(BuildingEnum.ClayMoundR, BuildingEnum.ClayMoundG, BuildingEnum.ClayMoundB, BuildingEnum.ClayMoundW),
          [P._],
        ],
        [
          P.union(BuildingEnum.ClayMoundR, BuildingEnum.ClayMoundG, BuildingEnum.ClayMoundB, BuildingEnum.ClayMoundW),
          [],
        ],
        ([_, params]) => clayMound(params[0])
      )
      .with(
        [
          P.union(
            BuildingEnum.CloisterOfficeR,
            BuildingEnum.CloisterOfficeG,
            BuildingEnum.CloisterOfficeB,
            BuildingEnum.CloisterOfficeW
          ),
          [P._],
        ],
        [
          P.union(
            BuildingEnum.CloisterOfficeR,
            BuildingEnum.CloisterOfficeG,
            BuildingEnum.CloisterOfficeB,
            BuildingEnum.CloisterOfficeW
          ),
          [],
        ],
        ([_, params]) => cloisterOffice(params[0])
      )
      .with([BuildingEnum.PeatCoalKiln, []], [BuildingEnum.PeatCoalKiln, [P._]], ([_, params]) =>
        peatCoalKiln(params[0])
      )
      .with([BuildingEnum.CloisterCourtyard, [P._, P._]], ([_, params]) => cloisterCourtyard(params[0], params[1]))
      .with([BuildingEnum.Bakery, [P._]], ([_, params]) => bakery(params[0]))
      .with([BuildingEnum.GrainStorage, []], grainStorage)
      .with([BuildingEnum.FuelMerchant, [P._]], ([_, params]) => fuelMerchant(params[0]))
      .with([BuildingEnum.Windmill, [P._]], ([_, params]) => windmill(params[0]))
      .with([BuildingEnum.Market, [P._]], ([_, params]) => market(params[0]))
      .with([BuildingEnum.CloisterGarden, []], cloisterGarden)
      .with([BuildingEnum.StoneMerchant, [P._]], ([_, params]) => stoneMerchant(params[0]))
      .otherwise(() => () => {
        throw new Error(`Invalid params [${params}] for building ${building}`)
      })
  )

import { match, P } from 'ts-pattern'
import { farmyard } from '../buildings/farmyard'
import { BuildingEnum, GameStatePlaying, ResourceEnum } from '../types'

export const use = (state: GameStatePlaying, building: BuildingEnum, params: string[]): GameStatePlaying | undefined =>
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
    )

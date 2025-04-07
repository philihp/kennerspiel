import { useInstanceContext } from '@/context/InstanceContext'
import { join } from 'ramda'
import { match, P } from 'ts-pattern'
import { TinyLandscape } from './sliders/tinyLandscape'
import { BuildingEnum, LandEnum } from 'hathora-et-labora-game/dist/types'

export const UnbuiltDistricts = () => {
  const { state } = useInstanceContext()
  if (state === undefined) return <></>
  const { districtPurchasePrices } = state

  return match(districtPurchasePrices)
    .with([], () => 'no districts left')
    .with([P.select('next', P.number), ...P.array(P.select('stack', P.number))], ({ next, stack }) => (
      <div>
        You may buy a District for {next} coins
        <TinyLandscape
          landscape={[
            [
              [LandEnum.Plains, BuildingEnum.Forest],
              [LandEnum.Plains],
              [LandEnum.Plains],
              [LandEnum.Plains],
              [LandEnum.Hillside],
            ],
          ]}
          rowMin={0}
          rowMax={0}
          showTerrain
        />
        or
        <TinyLandscape
          landscape={[
            [
              [LandEnum.Plains, BuildingEnum.Moor],
              [LandEnum.Plains, BuildingEnum.Forest],
              [LandEnum.Plains, BuildingEnum.Forest],
              [LandEnum.Hillside],
              [LandEnum.Hillside],
            ],
          ]}
          rowMin={0}
          rowMax={0}
          showTerrain
        />
        and then costs are {join(', ', stack)}
      </div>
    ))
    .otherwise(() => '')
}

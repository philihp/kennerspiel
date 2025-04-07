import { useInstanceContext } from '@/context/InstanceContext'
import { LandEnum } from 'hathora-et-labora-game/dist/types'
import { match, P } from 'ts-pattern'
import { TinyLandscape } from './sliders/tinyLandscape'
import { join } from 'ramda'

export const UnbuiltPlots = () => {
  const { state } = useInstanceContext()
  if (state === undefined) return <></>
  const { plotPurchasePrices } = state

  return match(plotPurchasePrices)
    .with([], () => 'no plots left')
    .with([P.select('next', P.number), ...P.array(P.select('stack', P.number))], ({ next, stack }) => (
      <div>
        You may buy a Plot for {next} coins
        <TinyLandscape
          key="coast"
          landscape={[
            [[LandEnum.Water], [LandEnum.Coast]],
            [[LandEnum.Water], [LandEnum.Coast]],
          ]}
          rowMin={0}
          rowMax={1}
        />
        or
        <TinyLandscape
          key="mountain"
          landscape={[
            [[LandEnum.Hillside], [LandEnum.Mountain]],
            [[LandEnum.Hillside], [LandEnum.BelowMountain]],
          ]}
          rowMin={0}
          rowMax={1}
        />
        and then after that {join(', ', stack)}
      </div>
    ))
    .otherwise(() => '')
}

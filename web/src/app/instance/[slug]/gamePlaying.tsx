'use client'

import { MoveList } from '@/components/moveList'
import { Actions } from '@/components/sliders/actions'
import { useInstanceContext } from '@/context/InstanceContext'

export const GamePlaying = () => {
  const { state, instance } = useInstanceContext()
  if (state === undefined) return <>Missing Game State</>

  const { rondel, config, players, buildings, plotPurchasePrices, districtPurchasePrices, wonders } = state
  const soloNeutralBuild = state?.config?.players === 1 && !!state?.frame?.neutralBuildingPhase

  return (
    <>
      {/* <Actions /> */}
      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr' }}>
        <MoveList />
        <pre>{JSON.stringify(state, undefined, 2)}</pre>
      </div>

      <hr />
      <i>Last Updated: </i>
      {instance.updated_at}
    </>
  )
}

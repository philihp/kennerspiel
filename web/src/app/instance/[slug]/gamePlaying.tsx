'use client'

import { Actions } from '@/components/sliders/actions'
import { useInstanceContext } from '@/context/InstanceContext'

export const GamePlaying = () => {
  const { gameState, instance } = useInstanceContext()
  if (gameState === undefined) return <>Missing Game State</>

  const { rondel, config, players, buildings, plotPurchasePrices, districtPurchasePrices, wonders } = gameState
  const soloNeutralBuild = gameState?.config?.players === 1 && !!gameState?.frame?.neutralBuildingPhase

  return (
    <>
      <h1>Game Playing</h1>
      <Actions />
      <pre>{JSON.stringify(gameState, undefined, 2)}</pre>

      <hr />
      <i>Last Updated: </i>
      {instance.updated_at}
    </>
  )
}

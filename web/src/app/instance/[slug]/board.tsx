'use client'

import { GameStatusEnum } from 'hathora-et-labora-game/dist/types'
import { GameSetup } from './gameSetup'
import { useInstanceContext } from '@/context/InstanceContext'

export const Board = () => {
  const { gameState } = useInstanceContext()

  if (gameState?.status === GameStatusEnum.SETUP)
    return (
      <>
        <GameSetup />
      </>
    )

  if (gameState?.status === GameStatusEnum.FINISHED) return <>game finished</>

  return (
    <>
      <pre>{JSON.stringify({ gameState }, undefined, 2)}</pre>
      <hr />
      {/* <pre>{JSON.stringify({ s2, c2 }, undefined, 2)}</pre> */}
      {/* <hr /> */}
    </>
  )
}

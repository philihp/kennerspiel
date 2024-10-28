'use client'

import { GameStatusEnum } from 'hathora-et-labora-game/dist/types'
import { GameSetup } from './gameSetup'
import { useInstanceContext } from '@/context/InstanceContext'
import { GamePlaying } from './gamePlaying'

export const Board = () => {
  const { stateSetup, state } = useInstanceContext()

  if (stateSetup)
    return (
      <>
        <GameSetup />
      </>
    )

  if (state?.status === GameStatusEnum.FINISHED) return <>game finished</>
  return (
    <>
      <GamePlaying />
    </>
  )
}

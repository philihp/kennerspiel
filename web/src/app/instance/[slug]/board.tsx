'use client'

import { GameStatusEnum } from 'hathora-et-labora-game/dist/types'
import { GameSetup } from './gameSetup'
import { useInstanceContext } from '@/context/InstanceContext'
import { GamePlaying } from './gamePlaying'

export const Board = () => {
  const { rawState } = useInstanceContext()

  switch (rawState?.status as GameStatusEnum) {
    case GameStatusEnum.SETUP:
      return (
        <>
          <GameSetup />
        </>
      )
    case GameStatusEnum.FINISHED:
      return <>game finished</>
    default:
      return (
        <>
          <GamePlaying />
        </>
      )
  }
}

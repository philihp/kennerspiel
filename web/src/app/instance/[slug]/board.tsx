'use client'

import { GameStatusEnum } from 'hathora-et-labora-game/dist/types'
import { GameSetup } from './gameSetup'
import { useInstanceContext } from '@/context/InstanceContext'
import { GamePlaying } from './gamePlaying'
import { GameFinished } from './gameFinished'
import { match } from 'ts-pattern'

export const Board = () => {
  const { rawState } = useInstanceContext()
  return match(rawState?.status)
    .with(GameStatusEnum.SETUP, () => <GameSetup />)
    .with(GameStatusEnum.PLAYING, () => <GamePlaying />)
    .with(GameStatusEnum.FINISHED, () => <GameFinished />)
    .otherwise(() => <div>Status: {JSON.stringify(rawState?.status)}</div>)
}

'use client'

import { GameStatusEnum } from 'hathora-et-labora-game/dist/types'
import { GameSetup } from './gameSetup'
import { useInstanceContext } from '@/context/InstanceContext'

export const Board = () => {
  const { commands: c0, state: s1 } = useInstanceContext()

  if (s1?.status === GameStatusEnum.SETUP)
    return <>
      <GameSetup />
    </>

  if (s1?.status === GameStatusEnum.FINISHED)
    return <>
      game finished
    </>

  return <>
    <pre>{JSON.stringify({ s1 }, undefined, 2)}</pre>
    <hr />
    {/* <pre>{JSON.stringify({ s2, c2 }, undefined, 2)}</pre> */}
    {/* <hr /> */}
  </>
}

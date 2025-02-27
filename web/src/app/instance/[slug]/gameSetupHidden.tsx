import { useInstanceContext } from '@/context/InstanceContext'
import { toggleHidden } from './actions'
import { useOptimistic, useState, useTransition } from 'react'
import { Tables } from '@/supabase.types'
import { usePathname, useRouter } from 'next/navigation'

export const GameSetupHidden = () => {
  const { instance, setInstance } = useInstanceContext()
  const path = usePathname()
  const router = useRouter()

  const hidden = !!instance.hidden

  const [optInstance, setOptInstance] = useOptimistic<Tables<'instance'>, boolean>(instance, (state, hidden) => ({
    ...state,
    hidden,
  }))
  const [_isPending, startTransition] = useTransition()

  const handleSetHidden = async (newState: boolean) => {
    startTransition(async () => {
      setOptInstance(newState)
      const finalState = await toggleHidden(instance.id, newState)
      finalState && setInstance(finalState)
    })
  }
  return (
    <>
      <hr />
      <input
        type="checkbox"
        name="hidden"
        id="hidden"
        checked={!!optInstance?.hidden}
        onChange={() => handleSetHidden(!hidden)}
      />{' '}
      <label htmlFor="hidden">Hidden</label>{' '}
      {!optInstance?.hidden && (
        <button type="button" onClick={() => handleSetHidden(true)}>
          Make Hidden
        </button>
      )}
      {!!optInstance?.hidden && (
        <button type="button" onClick={() => handleSetHidden(false)}>
          Make Public
        </button>
      )}
      <br />
      <p>
        Making an instance public will list it to all users. Share the link directly to invite users to a private
        instance.
      </p>
    </>
  )
}

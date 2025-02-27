import { useInstanceContext } from '@/context/InstanceContext'
import { toggleHidden } from './actions'
import { useOptimistic, useState, useTransition } from 'react'

export const GameSetupHidden = () => {
  const { instance } = useInstanceContext()

  const [hidden, setHidden] = useState(!!instance.hidden)

  const [optHidden, setOptHidden] = useOptimistic<boolean, boolean>(hidden, (state, newState) => {
    return newState
  })
  const [_isPending, startTransition] = useTransition()

  const handleSetHidden = async (newState: boolean) => {
    startTransition(async () => {
      setOptHidden(newState)
      const finalState = await toggleHidden(instance.id, newState)
      setHidden(finalState)
    })
  }
  return (
    <>
      <hr />
      {JSON.stringify(instance.hidden)}
      <input
        type="checkbox"
        name="hidden"
        id="hidden"
        checked={optHidden}
        onChange={() => handleSetHidden(!hidden)}
      />{' '}
      <label htmlFor="hidden">Hidden</label>{' '}
      {!optHidden && (
        <button type="button" onClick={() => handleSetHidden(true)}>
          Make Hidden
        </button>
      )}
      {!!optHidden && (
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

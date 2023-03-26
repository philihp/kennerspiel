import React from 'react'
import { useHathoraContext } from '../context/GameContext'

export const ControlCommit = () => {
  const { state, move } = useHathoraContext()
  if (state === undefined) return <div>Error: Unknown State</div>

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    move(`COMMIT`)
  }

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit">commit</button>
    </form>
  )
}

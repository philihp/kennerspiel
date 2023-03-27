import { any } from 'ramda'
import React, { useState } from 'react'
import { EngineState } from '../../../../api/types'
import { useHathoraContext } from '../context/GameContext'

const doesPlayerHavePrior = (state: EngineState): boolean => {
  if (state.players === undefined) return false
  if (state.frame?.activePlayerIndex === undefined) return false
  const player = state.players[state.frame?.activePlayerIndex]
  return any((c) => ['PRIR', 'PRIG', 'PRIB', 'PRIW'].includes(c), player.clergy)
}

export const ControlWithPrior = () => {
  const { state, move } = useHathoraContext()
  if (state === undefined) return <div>Error: Unknown State</div>

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    move(`WITH_PRIOR`)
  }

  const disabled = !doesPlayerHavePrior(state) || state.frame?.nextUse === 'only-prior'

  return (
    <form onSubmit={handleSubmit}>
      <button disabled={disabled} type="submit">
        with prior
      </button>
    </form>
  )
}

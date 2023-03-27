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

export const ControlWith = () => {
  const { state, move } = useHathoraContext()
  if (state === undefined) return <div>Error: Unknown State</div>

  const handleWithPrior = () => {
    move(`WITH_PRIOR`)
  }
  const handleWithLaybrother = () => {
    move(`WITH_LAYBROTHER`)
  }

  const priorEnable = doesPlayerHavePrior(state) && (state.frame?.nextUse === 'any' || !state.frame?.mainActionUsed)
  const laybrotherDisabled = state?.frame?.activePlayerIndex === state?.frame?.currentPlayerIndex

  return (
    <>
      <button disabled={!priorEnable} type="button" onClick={handleWithPrior}>
        with prior
      </button>
      <button disabled={laybrotherDisabled} type="button" onClick={handleWithLaybrother}>
        with laybrother
      </button>
    </>
  )
}

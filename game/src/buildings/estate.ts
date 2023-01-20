import { pipe } from 'ramda'
import { GameStatePlaying } from '../types'

const buildingStub = (state: GameStatePlaying | undefined): GameStatePlaying | undefined => {
  if (state === undefined) return undefined
  return state
}

export const estate = (param = '') =>
  pipe(
    //
    buildingStub,
    buildingStub,
    buildingStub
  )

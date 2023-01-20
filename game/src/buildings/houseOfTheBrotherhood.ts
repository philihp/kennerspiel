import { pipe } from 'ramda'
import { GameStatePlaying } from '../types'

const buildingStub = (state: GameStatePlaying | undefined): GameStatePlaying | undefined => {
  if (state === undefined) return undefined
  return state
}

export const houseOfTheBrotherhood = (param1 = '', param2 = '') =>
  pipe(
    //
    buildingStub,
    buildingStub,
    buildingStub
  )

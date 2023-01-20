import { pipe } from 'ramda'
import { GameStatePlaying } from '../types'

const buildingStub = (state: GameStatePlaying | undefined): GameStatePlaying | undefined => {
  if (state === undefined) return undefined
  return state
}

export const calefactory = (row1 = '', col1 = '', row2 = '', col2 = '') =>
  pipe(
    //
    buildingStub,
    buildingStub,
    buildingStub
  )

import { pipe } from 'ramda'
import {
  standardSesourceGatheringAction,
  standardSesourceGatheringCompletion,
  updateToken,
  withRondel,
} from '../board/rondel'
import { StateReducer, ResourceEnum } from '../types'
import { shortGameBonusProduction } from '../board/resource'

export const grapevine = (param = ''): StateReducer => {
  const withJoker = param.includes(ResourceEnum.Joker)
  return pipe(
    //
    standardSesourceGatheringAction('grape', withJoker),
    withRondel(updateToken('grape', withJoker)),
    shortGameBonusProduction({ grape: 1 })
  )
}

export const complete = standardSesourceGatheringCompletion('grape')

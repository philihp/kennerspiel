import { pipe } from 'ramda'
import {
  standardSesourceGatheringAction,
  standardSesourceGatheringCompletion,
  updateRondel,
  withRondel,
} from '../board/rondel'
import { StateReducer, ResourceEnum } from '../types'
import { shortGameBonusProduction } from '../board/resource'

const updateToken = (withJoker: boolean) => (withJoker ? updateRondel('joker') : updateRondel('grape'))

export const grapevine = (param = ''): StateReducer => {
  const withJoker = param.includes(ResourceEnum.Joker)
  return pipe(
    //
    standardSesourceGatheringAction('grape', withJoker),
    withRondel(updateToken(withJoker)),
    shortGameBonusProduction({ grape: 1 })
  )
}

export const complete = standardSesourceGatheringCompletion('grape')

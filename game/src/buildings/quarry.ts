import { pipe } from 'ramda'
import {
  standardSesourceGatheringAction,
  standardSesourceGatheringCompletion,
  updateToken,
  withRondel,
} from '../board/rondel'
import { ResourceEnum, StateReducer } from '../types'
import { shortGameBonusProduction } from '../board/resource'

export const quarry = (param = ''): StateReducer => {
  const withJoker = param.includes(ResourceEnum.Joker)
  return pipe(
    //
    standardSesourceGatheringAction('stone', withJoker),
    withRondel(updateToken('stone', withJoker)),
    shortGameBonusProduction({ stone: 1 })
  )
}

export const complete = standardSesourceGatheringCompletion('stone')

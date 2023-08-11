import { pipe } from 'ramda'
import {
  standardSesourceGatheringAction,
  standardSesourceGatheringCompletion,
  updateRondel,
  withRondel,
} from '../board/rondel'
import { ResourceEnum, StateReducer } from '../types'
import { shortGameBonusProduction } from '../board/resource'

const updateToken = (withJoker: boolean) => (withJoker ? updateRondel('joker') : updateRondel('stone'))

export const quarry = (param = ''): StateReducer => {
  const withJoker = param.includes(ResourceEnum.Joker)
  return pipe(
    //
    standardSesourceGatheringAction('stone', withJoker),
    withRondel(updateToken(withJoker)),
    shortGameBonusProduction({ stone: 1 })
  )
}

export const complete = standardSesourceGatheringCompletion('stone')

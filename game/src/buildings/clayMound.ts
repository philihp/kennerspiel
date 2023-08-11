import { pipe } from 'ramda'
import {
  withRondel,
  standardSesourceGatheringCompletion,
  standardSesourceGatheringAction,
  updateToken,
} from '../board/rondel'
import { ResourceEnum, StateReducer } from '../types'
import { shortGameBonusProduction } from '../board/resource'

export const clayMound = (param = ''): StateReducer => {
  const withJoker = param.includes(ResourceEnum.Joker)
  return pipe(
    //
    standardSesourceGatheringAction('clay', withJoker),
    withRondel(updateToken('clay', withJoker)),
    shortGameBonusProduction({ clay: 1 })
  )
}

export const complete = standardSesourceGatheringCompletion('clay')

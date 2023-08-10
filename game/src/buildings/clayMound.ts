import { pipe } from 'ramda'
import {
  updateRondel,
  withRondel,
  standardSesourceGatheringCompletion,
  standardSesourceGatheringAction,
} from '../board/rondel'
import { ResourceEnum, StateReducer } from '../types'
import { shortGameBonusProduction } from '../board/resource'

const updateToken = (withJoker: boolean) => (withJoker ? updateRondel('joker') : updateRondel('clay'))

export const clayMound = (param = ''): StateReducer => {
  const withJoker = param.includes(ResourceEnum.Joker)
  return pipe(
    //
    standardSesourceGatheringAction('clay', withJoker),
    withRondel(updateToken(withJoker)),
    shortGameBonusProduction({ clay: 1 })
  )
}

export const complete = standardSesourceGatheringCompletion('clay')

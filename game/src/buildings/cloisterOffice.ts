import { pipe } from 'ramda'
import {
  withRondel,
  standardSesourceGatheringCompletion,
  standardSesourceGatheringAction,
  updateToken,
} from '../board/rondel'
import { ResourceEnum } from '../types'
import { shortGameBonusProduction } from '../board/resource'

export const cloisterOffice = (param = '') => {
  const withJoker = param.includes(ResourceEnum.Joker)
  return pipe(
    //
    standardSesourceGatheringAction('coin', withJoker),
    withRondel(updateToken('coin', withJoker)),
    shortGameBonusProduction({ penny: 1 })
  )
}

export const complete = standardSesourceGatheringCompletion('coin')

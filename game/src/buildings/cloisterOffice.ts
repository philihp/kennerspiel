import { pipe } from 'ramda'
import {
  updateRondel,
  withRondel,
  standardSesourceGatheringCompletion,
  standardSesourceGatheringAction,
} from '../board/rondel'
import { ResourceEnum } from '../types'
import { shortGameBonusProduction } from '../board/resource'

const updateToken = (withJoker: boolean) => (withJoker ? updateRondel('joker') : updateRondel('coin'))

export const cloisterOffice = (param = '') => {
  const withJoker = param.includes(ResourceEnum.Joker)
  return pipe(
    //
    standardSesourceGatheringAction('coin', withJoker),
    withRondel(updateToken(withJoker)),
    shortGameBonusProduction({ penny: 1 })
  )
}

export const complete = standardSesourceGatheringCompletion('coin')

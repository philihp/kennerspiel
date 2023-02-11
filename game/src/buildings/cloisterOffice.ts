import { pipe } from 'ramda'
import { getCost, withActivePlayer } from '../board/player'
import { updateRondel, withRondel } from '../board/rondel'
import { take } from '../board/wheel'
import { GameStatePlaying, ResourceEnum } from '../types'

const updateToken = (withJoker: boolean) => (withJoker ? updateRondel('joker') : updateRondel('coin'))

const takePlayerCoin =
  (withJoker: boolean) =>
  (state: GameStatePlaying | undefined): GameStatePlaying | undefined => {
    if (state === undefined) return undefined
    const {
      config,
      rondel: { joker, coin, pointingBefore },
    } = state
    const amount = take(pointingBefore, (withJoker ? joker : coin) ?? pointingBefore, config)
    return withActivePlayer(getCost({ penny: amount }))(state)
  }

export const cloisterOffice = (param = '') => {
  const withJoker = param.includes(ResourceEnum.Joker)
  return pipe(
    //
    takePlayerCoin(withJoker),
    withRondel(updateToken(withJoker))
  )
}

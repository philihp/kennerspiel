import { pipe } from 'ramda'
import { getCost, withActivePlayer } from '../board/player'
import { updateRondel, withRondel } from '../board/rondel'
import { take } from '../board/wheel'
import { GameStatePlaying, ResourceEnum } from '../types'

const takePlayerClay =
  (withJoker: boolean) =>
  (state: GameStatePlaying | undefined): GameStatePlaying | undefined => {
    if (state === undefined) return state
    const {
      config,
      rondel: { joker, clay, pointingBefore },
    } = state
    const amount = take(pointingBefore, (withJoker ? joker : clay) ?? pointingBefore, config)
    return withActivePlayer(getCost({ clay: amount }))(state)
  }

const updateToken = (withJoker: boolean) => (withJoker ? updateRondel('joker') : updateRondel('clay'))

export const clayMound = (param = '') => {
  const withJoker = param.includes(ResourceEnum.Joker)
  return pipe(
    //
    takePlayerClay(withJoker),
    withRondel(updateToken(withJoker))
  )
}

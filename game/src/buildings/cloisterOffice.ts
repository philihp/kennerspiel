import { always, curry, pipe } from 'ramda'
import { match } from 'ts-pattern'
import { getCost, withActivePlayer } from '../board/player'
import { updateRondel, withRondel, take } from '../board/rondel'
import { GameStatePlaying, ResourceEnum, StateReducer } from '../types'

const updateToken = (withJoker: boolean) => (withJoker ? updateRondel('joker') : updateRondel('coin'))

const takePlayerCoin =
  (withJoker: boolean): StateReducer =>
  (state) => {
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

export const complete = curry((partial: string[], _state: GameStatePlaying): string[] =>
  match(partial)
    .with([], () => ['', 'Jo'])
    .with(['Jo'], () => [''])
    .otherwise(always([]))
)

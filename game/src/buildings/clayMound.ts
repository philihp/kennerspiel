import { always, curry, pipe } from 'ramda'
import { match } from 'ts-pattern'
import { getCost, withActivePlayer } from '../board/player'
import { updateRondel, withRondel, take } from '../board/rondel'
import { GameStatePlaying, ResourceEnum, StateReducer } from '../types'
import { shortGameBonusProduction } from '../board/resource'

const takePlayerClay =
  (withJoker: boolean): StateReducer =>
  (state) => {
    if (state === undefined) return state
    const {
      config,
      rondel: { joker, clay, pointingBefore },
    } = state
    const amount = take(pointingBefore, (withJoker ? joker : clay) ?? pointingBefore, config)
    return withActivePlayer(getCost({ clay: amount }))(state)
  }

const updateToken = (withJoker: boolean) => (withJoker ? updateRondel('joker') : updateRondel('clay'))

export const clayMound = (param = ''): StateReducer => {
  const withJoker = param.includes(ResourceEnum.Joker)
  return pipe(
    //
    takePlayerClay(withJoker),
    withRondel(updateToken(withJoker)),
    shortGameBonusProduction({ clay: 1 })
  )
}

export const complete = curry((partial: string[], _state: GameStatePlaying): string[] =>
  match(partial)
    .with([], () => ['', 'Jo'])
    .with(['Jo'], () => [''])
    .otherwise(always([]))
)

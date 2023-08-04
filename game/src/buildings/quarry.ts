import { always, curry, pipe } from 'ramda'
import { P, match } from 'ts-pattern'
import { withActivePlayer } from '../board/player'
import { take } from '../board/rondel'
import { GameStatePlaying, ResourceEnum, StateReducer } from '../types'
import { shortGameBonusProduction } from '../board/resource'

const advanceStoneOnRondel =
  (withJoker: boolean): StateReducer =>
  (state) =>
    state && {
      ...state,
      rondel: {
        ...state.rondel,
        joker: withJoker ? state.rondel.pointingBefore : state.rondel.joker,
        stone: !withJoker ? state.rondel.pointingBefore : state.rondel.stone,
      },
    }

const takePlayerStone =
  (withJoker: boolean): StateReducer =>
  (state) => {
    if (state === undefined) return undefined
    const {
      config,
      rondel: { joker, stone, pointingBefore },
    } = state
    return withActivePlayer(
      (player) =>
        player && {
          ...player,
          stone: player.stone + take(pointingBefore, (withJoker ? joker : stone) ?? pointingBefore, config),
        }
    )(state)
  }

export const quarry = (param = ''): StateReducer => {
  const withJoker = param.includes(ResourceEnum.Joker)
  return pipe(
    //
    takePlayerStone(withJoker),
    advanceStoneOnRondel(withJoker),
    shortGameBonusProduction({ stone: 1 })
  )
}

export const complete = curry((partial: string[], _state: GameStatePlaying): string[] =>
  match(partial)
    .with([], always(['', 'Jo']))
    .with([P._], always(['']))
    .otherwise(always([]))
)

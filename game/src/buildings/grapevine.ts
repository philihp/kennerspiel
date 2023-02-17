import { pipe } from 'ramda'
import { withActivePlayer } from '../board/player'
import { take } from '../board/rondel'
import { StateReducer, ResourceEnum } from '../types'

const advanceGrapeOnRondel =
  (withJoker: boolean): StateReducer =>
  (state) =>
    state && {
      ...state,
      rondel: {
        ...state.rondel,
        joker: withJoker ? state.rondel.pointingBefore : state.rondel.joker,
        grape: !withJoker ? state.rondel.pointingBefore : state.rondel.grape,
      },
    }

const takePlayerGrape =
  (withJoker: boolean): StateReducer =>
  (state) => {
    if (state === undefined) return undefined
    const {
      config,
      rondel: { joker, grape, pointingBefore },
    } = state
    return withActivePlayer(
      (player) =>
        player && {
          ...player,
          grape: player.grape + take(pointingBefore, (withJoker ? joker : grape) ?? pointingBefore, config),
        }
    )(state)
  }

export const grapevine = (param = ''): StateReducer => {
  const withJoker = param.includes(ResourceEnum.Joker)
  return pipe(
    //
    takePlayerGrape(withJoker),
    advanceGrapeOnRondel(withJoker)
  )
}

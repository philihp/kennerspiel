import { pipe } from 'ramda'
import { withActivePlayer } from '../board/player'
import { take } from '../board/wheel'
import { GameStatePlaying, ResourceEnum } from '../types'

const advanceClayOnRondel =
  (withJoker: boolean) =>
  (state: GameStatePlaying | undefined): GameStatePlaying | undefined =>
    state && {
      ...state,
      rondel: {
        ...state.rondel,
        joker: withJoker ? state.rondel.pointingBefore : state.rondel.joker,
        clay: !withJoker ? state.rondel.pointingBefore : state.rondel.clay,
      },
    }

const takePlayerClay =
  (withJoker: boolean) =>
  (state: GameStatePlaying | undefined): GameStatePlaying | undefined => {
    if (state === undefined) return undefined
    const {
      config,
      rondel: { joker, clay, pointingBefore },
    } = state
    return withActivePlayer(
      (player) =>
        player && {
          ...player,
          clay: player.clay + take(pointingBefore, (withJoker ? joker : clay) ?? pointingBefore, config),
        }
    )(state)
  }

export const clayMound = (param = '') => {
  const withJoker = param.includes(ResourceEnum.Joker)
  return (state: GameStatePlaying | undefined): GameStatePlaying | undefined => {
    if (state === undefined) return undefined
    return pipe(
      //
      takePlayerClay(withJoker),
      advanceClayOnRondel(withJoker)
    )(state)
  }
}

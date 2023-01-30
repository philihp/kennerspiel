import { pipe } from 'ramda'
import { withActivePlayer } from '../board/player'
import { take } from '../board/wheel'
import { GameStatePlaying, ResourceEnum } from '../types'

const advanceStoneOnRondel =
  (withJoker: boolean) =>
  (state: GameStatePlaying | undefined): GameStatePlaying | undefined =>
    state && {
      ...state,
      rondel: {
        ...state.rondel,
        joker: withJoker ? state.rondel.pointingBefore : state.rondel.joker,
        stone: !withJoker ? state.rondel.pointingBefore : state.rondel.stone,
      },
    }

const takePlayerStone =
  (withJoker: boolean) =>
  (state: GameStatePlaying | undefined): GameStatePlaying | undefined => {
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

export const quarry = (param = '') => {
  const withJoker = param.includes(ResourceEnum.Joker)
  return pipe(
    //
    takePlayerStone(withJoker),
    advanceStoneOnRondel(withJoker)
  )
}

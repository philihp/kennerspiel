import { pipe } from 'ramda'
import { withActivePlayer } from '../board/player'
import { take } from '../board/wheel'
import { GameStatePlaying, ResourceEnum } from '../types'

const advanceCoinOnRondel =
  (withJoker: boolean) =>
  (state: GameStatePlaying | undefined): GameStatePlaying | undefined =>
    state && {
      ...state,
      rondel: {
        ...state.rondel,
        joker: withJoker ? state.rondel.pointingBefore : state.rondel.joker,
        coin: !withJoker ? state.rondel.pointingBefore : state.rondel.coin,
      },
    }

const takePlayerCoin =
  (withJoker: boolean) =>
  (state: GameStatePlaying | undefined): GameStatePlaying | undefined => {
    if (state === undefined) return undefined
    const {
      config,
      rondel: { joker, coin, pointingBefore },
    } = state
    return withActivePlayer(
      (player) =>
        player && {
          ...player,
          penny: player.penny + take(pointingBefore, (withJoker ? joker : coin) ?? pointingBefore, config),
        }
    )(state)
  }

export const cloisterOffice = (param = '') => {
  const withJoker = param.includes(ResourceEnum.Joker)
  return (state: GameStatePlaying | undefined): GameStatePlaying | undefined => {
    if (state === undefined) return undefined
    return pipe(
      //
      takePlayerCoin(withJoker),
      advanceCoinOnRondel(withJoker)
    )(state)
  }
}

import { always, curry, pipe } from 'ramda'
import { P, match } from 'ts-pattern'
import { withActivePlayer } from '../board/player'
import { standardSesourceGatheringCompletion, take } from '../board/rondel'
import { StateReducer, ResourceEnum, GameStatePlaying } from '../types'
import { shortGameBonusProduction } from '../board/resource'

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
    advanceGrapeOnRondel(withJoker),
    shortGameBonusProduction({ grape: 1 })
  )
}

export const complete = standardSesourceGatheringCompletion

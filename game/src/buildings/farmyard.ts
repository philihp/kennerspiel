import { pipe } from 'ramda'
import { withActivePlayer } from '../board/player'
import { take } from '../board/wheel'
import { GameStatePlaying, ResourceEnum } from '../types'

const advanceJokerOnRondel =
  (withJoker: boolean) =>
  (state: GameStatePlaying | undefined): GameStatePlaying | undefined =>
    !withJoker
      ? state
      : state && {
          ...state,
          rondel: {
            ...state.rondel,
            joker: state.rondel.pointingBefore,
          },
        }

const advanceSheepOnRondel =
  (withSheep: boolean) =>
  (state: GameStatePlaying | undefined): GameStatePlaying | undefined =>
    !withSheep
      ? state
      : state && {
          ...state,
          rondel: {
            ...state.rondel,
            sheep: state.rondel.pointingBefore,
          },
        }

const advanceGrainOnRondel =
  (withGrain: boolean) =>
  (state: GameStatePlaying | undefined): GameStatePlaying | undefined =>
    !withGrain
      ? state
      : state && {
          ...state,
          rondel: {
            ...state.rondel,
            grain: state.rondel.pointingBefore,
          },
        }

const takePlayerSheep =
  (shouldTake: boolean, withJoker: boolean) =>
  (state: GameStatePlaying | undefined): GameStatePlaying | undefined => {
    if (state === undefined || !shouldTake) return state
    const {
      config,
      rondel: { joker, sheep, pointingBefore },
    } = state
    return withActivePlayer(
      (player) =>
        player && {
          ...player,
          sheep: player.sheep + take(pointingBefore, (withJoker ? joker : sheep) ?? pointingBefore, config),
        }
    )(state)
  }

const takePlayerGrain =
  (shouldTake: boolean, withJoker: boolean) =>
  (state: GameStatePlaying | undefined): GameStatePlaying | undefined => {
    if (state === undefined || !shouldTake) return state
    const {
      config,
      rondel: { joker, grain, pointingBefore },
    } = state
    return withActivePlayer(
      (player) =>
        player && {
          ...player,
          grain: player.grain + take(pointingBefore, (withJoker ? joker : grain) ?? pointingBefore, config),
        }
    )(state)
  }

export const farmyard = (param = '') => {
  const withJoker = param.includes(ResourceEnum.Joker)
  const withSheep = param.includes(ResourceEnum.Sheep)
  const withGrain = param.includes(ResourceEnum.Grain)
  return (state: GameStatePlaying | undefined): GameStatePlaying | undefined => {
    return pipe(
      //
      takePlayerSheep(withSheep, withJoker),
      takePlayerGrain(withGrain, withJoker),
      advanceJokerOnRondel(withJoker),
      advanceSheepOnRondel(!withJoker && withSheep),
      advanceGrainOnRondel(!withJoker && withGrain)
    )(state)
  }
}

import { pipe } from 'ramda'
import { match, P } from 'ts-pattern'
import { withActivePlayer } from '../board/player'
import { updateRondel, withRondel } from '../board/rondel'
import { take } from '../board/wheel'
import { GameStatePlaying, ResourceEnum } from '../types'

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

const updateToken = (withJoker: boolean, withSheep: boolean, withGrain: boolean) =>
  match([withJoker, withSheep, withGrain])
    .with([true, P.boolean, P.boolean], () => updateRondel('joker'))
    .with([false, true, false], () => updateRondel('sheep'))
    .with([false, false, true], () => updateRondel('grain'))
    .otherwise(() => () => undefined)

export const farmyard = (param = '') => {
  const withJoker = param.includes(ResourceEnum.Joker)
  const withSheep = param.includes(ResourceEnum.Sheep)
  const withGrain = param.includes(ResourceEnum.Grain)
  return pipe(
    takePlayerSheep(withSheep, withJoker),
    takePlayerGrain(withGrain, withJoker),
    withRondel(updateToken(withJoker, withSheep, withGrain))
  )
}

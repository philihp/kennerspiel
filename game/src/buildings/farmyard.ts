import { always, curry, pipe } from 'ramda'
import { match, P } from 'ts-pattern'
import { withActivePlayer } from '../board/player'
import { updateRondel, withRondel, take } from '../board/rondel'
import { GameStatePlaying, ResourceEnum, StateReducer } from '../types'
import { parseResourceParam } from '../board/resource'

const takePlayerSheep =
  (shouldTake: boolean, withJoker: boolean): StateReducer =>
  (state) => {
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
  (shouldTake: boolean, withJoker: boolean): StateReducer =>
  (state) => {
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

export const farmyard = (param = ''): StateReducer => {
  const withJoker = param.includes(ResourceEnum.Joker)
  const withSheep = param.includes(ResourceEnum.Sheep)
  const withGrain = param.includes(ResourceEnum.Grain)
  if (!withSheep && !withGrain) return () => undefined
  return pipe(
    takePlayerSheep(withSheep, withJoker),
    takePlayerGrain(withGrain, withJoker),
    withRondel(updateToken(withJoker, withSheep, withGrain))
  )
}

export const complete = curry((partial: string[], _state: GameStatePlaying): string[] =>
  match(partial)
    .with([], always(['Sh', 'Gn', 'JoSh', 'JoGn']))
    .with(
      P.when(([param]) => {
        const { sheep = 0, grain = 0 } = parseResourceParam(param)
        return +!grain ^ +!sheep // go ahead, try to make this better, there are tests
      }),
      always([''])
    )
    .otherwise(always([]))
)

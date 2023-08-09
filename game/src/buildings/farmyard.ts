import { always, cond, curry, pipe, when } from 'ramda'
import { match, P } from 'ts-pattern'
import { withActivePlayer } from '../board/player'
import { updateRondel, withRondel, take } from '../board/rondel'
import { GameStatePlaying, ResourceEnum, StateReducer } from '../types'
import { parseResourceParam, shortGameBonusProduction } from '../board/resource'

const takePlayerSheep =
  (withJoker: boolean): StateReducer =>
  (state) => {
    if (state === undefined) return state
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
  (withJoker: boolean): StateReducer =>
  (state) => {
    if (state === undefined) return state
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

export const farmyard = (param = ''): StateReducer => {
  const withJoker = param.includes(ResourceEnum.Joker)
  const withSheep = param.includes(ResourceEnum.Sheep)
  const withGrain = param.includes(ResourceEnum.Grain)
  if (!withSheep && !withGrain) return always(undefined)
  return pipe(
    when(
      always(withSheep),
      pipe(
        //
        takePlayerSheep(withJoker),
        shortGameBonusProduction({ sheep: 1 })
      )
    ),
    when(
      always(withGrain),
      pipe(
        //
        takePlayerGrain(withJoker),
        shortGameBonusProduction({ grain: 1 })
      )
    ),
    withRondel(
      cond([
        [always(withJoker), updateRondel('joker')],
        [always(withSheep), updateRondel('sheep')],
        [always(withGrain), updateRondel('grain')],
      ])
    )
  )
}

export const complete = curry((partial: string[], state: GameStatePlaying): string[] =>
  match(partial)
    .with([], always(state.rondel.joker !== undefined ? ['Sh', 'Gn', 'JoSh', 'JoGn'] : ['Sh', 'Gn']))
    .with(
      P.when(([param]) => {
        const { sheep = 0, grain = 0 } = parseResourceParam(param)
        return +!grain ^ +!sheep // go ahead, try to make this better, there are tests
      }),
      always([''])
    )
    .otherwise(always([]))
)

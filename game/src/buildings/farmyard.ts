import { always, cond, curry, pipe, when } from 'ramda'
import { match, P } from 'ts-pattern'
import { updateRondel, withRondel, standardSesourceGatheringAction } from '../board/rondel'
import { GameStatePlaying, ResourceEnum, Rondel, StateReducer } from '../types'
import { parseResourceParam, shortGameBonusProduction } from '../board/resource'

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
        standardSesourceGatheringAction('sheep', withJoker),
        shortGameBonusProduction({ sheep: 1 })
      )
    ),
    when(
      always(withGrain),
      pipe(
        //
        standardSesourceGatheringAction('grain', withJoker),
        shortGameBonusProduction({ grain: 1 })
      )
    ),
    withRondel(
      cond([
        [always(withJoker), updateRondel('joker')],
        [(r: Rondel) => withSheep && r.sheep === undefined, updateRondel('joker')],
        [(r: Rondel) => withGrain && r.grain === undefined, updateRondel('joker')],
        [always(withSheep), updateRondel('sheep')],
        [always(withGrain), updateRondel('grain')],
      ])
    )
  )
}

export const complete = curry((partial: string[], state: GameStatePlaying): string[] =>
  match(partial)
    .with([], () => {
      return [
        ...(state.rondel.sheep !== undefined ? ['Sh'] : []),
        ...(state.rondel.grain !== undefined ? ['Gn'] : []),
        ...(state.rondel.joker !== undefined ? ['JoSh', 'JoGn'] : []),
      ]
    })
    .with(
      P.when(([param]) => {
        const { sheep = 0, grain = 0 } = parseResourceParam(param)
        return +!grain ^ +!sheep // go ahead, try to make this better, there are tests
      }),
      always([''])
    )
    .otherwise(always([]))
)

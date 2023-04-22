import { always, curry, evolve, identity, pipe, view } from 'ramda'
import { P, match } from 'ts-pattern'
import { activeLens, getCost, payCost, withActivePlayer } from '../board/player'
import { costMoney, parseResourceParam } from '../board/resource'
import { Cost, GameStatePlaying, Tableau } from '../types'

const checkWorthOneCoin =
  (input: Cost) =>
  (player: Tableau | undefined): Tableau | undefined =>
    costMoney(input) >= 1 ? player : undefined

export const financedEstate = (param = '') => {
  if (param === '') return identity
  const inputs = parseResourceParam(param)
  return withActivePlayer(
    pipe(
      //
      checkWorthOneCoin(inputs),
      payCost(inputs),
      getCost({ book: 1, bread: 1, grape: 2, flour: 2 })
    )
  )
}

export const complete = curry((partial: string[], state: GameStatePlaying): string[] =>
  match(partial)
    .with([], () => {
      const outputs: string[] = []
      const attachIfTruthy = (token: string) => (n?: number) => n && outputs.push(token)
      // okay i guess
      evolve(
        {
          penny: attachIfTruthy('Pn'),
          nickel: attachIfTruthy('Ni'),
          wine: attachIfTruthy('Wn'),
          whiskey: attachIfTruthy('Wh'),
        },
        view(activeLens(state), state)
      )
      return [...outputs, '']
    })
    .with([P._], always(['']))
    .otherwise(always([]))
)

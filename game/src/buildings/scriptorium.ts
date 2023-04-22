import { always, curry, evolve, pipe, view } from 'ramda'
import { P, match } from 'ts-pattern'
import { activeLens, getCost, payCost, withActivePlayer } from '../board/player'
import { costMoney, parseResourceParam } from '../board/resource'
import { GameStatePlaying } from '../types'

export const scriptorium = (pennies = '') => {
  const input = parseResourceParam(pennies)
  const paid = Math.min(costMoney(input), 1)
  return withActivePlayer(
    pipe(
      payCost(input),
      getCost({
        book: paid,
        meat: paid,
        whiskey: paid,
      })
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

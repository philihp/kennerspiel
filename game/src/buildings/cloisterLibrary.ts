import { add, always, ap, concat, curry, map, min, pipe, range, reverse, unnest, view } from 'ramda'
import { P, match } from 'ts-pattern'
import { activeLens, getCost, payCost, withActivePlayer } from '../board/player'
import { costMoney, parseResourceParam, stringRepeater } from '../board/resource'
import { GameStatePlaying, ResourceEnum, StateReducer } from '../types'

export const cloisterLibrary = (inputs = ''): StateReducer => {
  const input = parseResourceParam(inputs)
  const { book = 0, ...inputWithoutBook } = input
  const newBooks = Math.min(costMoney(inputWithoutBook), 3)
  const soldBook = Math.min(book ?? 0, 1)
  return withActivePlayer(
    pipe(
      //
      payCost(inputWithoutBook),
      getCost({ book: newBooks }),
      payCost({ book: soldBook }),
      getCost({ meat: soldBook, wine: soldBook })
    )
  )
}

export const complete = curry((partial: string[], state: GameStatePlaying): string[] =>
  match(partial)
    .with([], () => {
      const player = view(activeLens(state), state)
      const { penny = 0, book = 0 } = player

      // step 1: figure out how many times we might send in penny, given max pennies
      const pennyAmounts: number[] = reverse(range(0, 1 + Math.min(3, penny)))

      // step 2: for each amount of penny, figure out how many books they would have
      const paymentAmounts = map<number, [number, string]>(
        (pennyAmount): [number, string] => [pennyAmount + book, stringRepeater(ResourceEnum.Penny, pennyAmount)],
        pennyAmounts
      )

      // then for each of those, sell 0 or 1 book if there are any
      const consumeBreadAmounts = unnest(
        map(
          ([sellableBooks, resourceString]) =>
            pipe(
              //
              min<number>(1),
              add(1),
              range(0),
              reverse<number>,
              map(stringRepeater(ResourceEnum.Book)),
              map((s) => resourceString + s)
            )(sellableBooks),
          paymentAmounts
        )
      )

      return consumeBreadAmounts
    })
    .with([P._], always(['']))
    .otherwise(always([]))
)

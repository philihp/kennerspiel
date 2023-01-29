import { pipe } from 'ramda'
import { subtractCoins, withActivePlayer } from '../board/player'
import { costMoney, parseResourceParam } from '../board/resource'
import { GameStatePlaying, Tableau } from '../types'

const convertPenniesToBooks = (iterations: number) => (player: Tableau | undefined) =>
  player && {
    ...player,
    book: player.book + iterations,
  }

const convertBooksToMeatWine = (iterations: number) => (player: Tableau | undefined) =>
  player && {
    ...player,
    book: player.book - iterations,
    meat: player.meat + iterations,
    wine: player.wine + iterations,
  }

export const cloisterLibrary = (pennies = '', books = '') => {
  const pen = parseResourceParam(pennies)
  const paid = Math.min(costMoney(pen), 3)
  const { book = 0 } = parseResourceParam(books)
  return withActivePlayer(
    pipe(
      //
      subtractCoins(paid),
      convertPenniesToBooks(paid),
      convertBooksToMeatWine(Math.min(book, 1))
    )
  )
}

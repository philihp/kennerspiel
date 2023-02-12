import { pipe } from 'ramda'
import { P, match } from 'ts-pattern'
import { getCost, payCost, withActivePlayer } from '../board/player'
import { parseResourceParam, multiplyGoods } from '../board/resource'
import { take } from '../board/rondel'
import { Cost, GameStatePlaying } from '../types'

const takePlayerJoker = (unitCost: Cost) => (state: GameStatePlaying | undefined) => {
  if (state === undefined) return undefined
  const {
    rondel: { pointingBefore, joker },
    config,
  } = state
  const takeValue = take(pointingBefore, joker ?? pointingBefore, config)
  return withActivePlayer(getCost(multiplyGoods(takeValue)(unitCost)))(state)
}

const advanceJokerOnRondel = (state: GameStatePlaying | undefined): GameStatePlaying | undefined =>
  state && {
    ...state,
    rondel: {
      ...state.rondel,
      joker: state.rondel.pointingBefore,
    },
  }

export const shippingCompany = (fuel = '', product = '') => {
  const input = parseResourceParam(fuel)
  const output = match(parseResourceParam(product))
    .with({ meat: P.when((n) => n > 0) }, () => ({ meat: 1 }))
    .with({ bread: P.when((n) => n > 0) }, () => ({ bread: 1 }))
    .with({ wine: P.when((n) => n > 0) }, () => ({ wine: 1 }))
    .otherwise(() => ({}))

  return pipe(
    //
    withActivePlayer(payCost(input)),
    takePlayerJoker(output),
    advanceJokerOnRondel
  )
}

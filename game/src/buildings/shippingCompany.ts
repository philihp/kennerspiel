import { identity, pipe } from 'ramda'
import { P, match } from 'ts-pattern'
import { payCost, withActivePlayer } from '../board/player'
import { costEnergy, parseResourceParam } from '../board/resource'
import { advanceJokerOnRondel, takePlayerJoker } from '../board/rondel'
import { StateReducer } from '../types'

export const shippingCompany = (fuel = '', product = ''): StateReducer => {
  const input = parseResourceParam(fuel)
  if (costEnergy(input) < 3) return identity
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

import { identity, pipe } from 'ramda'
import { match, P } from 'ts-pattern'
import { payCost, withActivePlayer } from '../board/player'
import { parseResourceParam } from '../board/resource'
import { advanceJokerOnRondel, takePlayerJoker } from '../board/rondel'
import { StateReducer } from '../types'

export const cooperage = (input = '', output = ''): StateReducer => {
  const { wood = 0 } = parseResourceParam(input)
  if (wood < 3) return identity
  const out = match(parseResourceParam(output))
    .with({ whiskey: P.when((n) => n > 0) }, () => ({ whiskey: 1 }))
    .with({ beer: P.when((n) => n > 0) }, () => ({ beer: 1 }))
    .otherwise(() => ({}))

  return pipe(
    //
    withActivePlayer(payCost({ wood })),
    takePlayerJoker(out),
    advanceJokerOnRondel
  )
}

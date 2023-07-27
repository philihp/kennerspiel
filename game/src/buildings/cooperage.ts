import { always, ap, concat, curry, identity, pipe, view } from 'ramda'
import { match, P } from 'ts-pattern'
import { activeLens, payCost, withActivePlayer } from '../board/player'
import { parseResourceParam } from '../board/resource'
import { advanceJokerOnRondel, takePlayerJoker } from '../board/rondel'
import { GameStatePlaying, ResourceEnum, StateReducer } from '../types'

export const cooperage = (input = '', output = ''): StateReducer => {
  const { wood = 0 } = parseResourceParam(input)
  if (wood < 3) return identity
  const out = match(parseResourceParam(output))
    .with({ whiskey: P.when((n) => n && n > 0) }, () => ({ whiskey: 1 }))
    .with({ beer: P.when((n) => n && n > 0) }, () => ({ beer: 1 }))
    .otherwise(() => ({}))

  return pipe(
    //
    withActivePlayer(payCost({ wood })),
    takePlayerJoker(out),
    advanceJokerOnRondel
  )
}

export const complete = curry((partial: string[], state: GameStatePlaying): string[] =>
  match(partial)
    .with([], () => {
      const { wood = 0 } = view(activeLens(state), state)
      if (wood <= 3) return ['']
      return [
        ...ap(
          [
            //
            concat(ResourceEnum.Beer),
            concat(ResourceEnum.Whiskey),
          ],
          ['WoWoWo']
        ),
        '',
      ]
    })
    .with([P._], always(['']))
    .otherwise(always([]))
)

import { always, curry, pipe } from 'ramda'
import { match } from 'ts-pattern'
import { allowFreeUsageToNeighborsOf, disableFurtherUsage } from '../board/frame'
import { getCost, withActivePlayer } from '../board/player'
import { BuildingEnum, GameStatePlaying, StateReducer } from '../types'

export const cottage = (): StateReducer =>
  pipe(
    withActivePlayer(getCost({ malt: 1 })),
    disableFurtherUsage(BuildingEnum.Cottage),
    allowFreeUsageToNeighborsOf(BuildingEnum.Cottage)
  )

export const complete = curry((partial: string[], _state: GameStatePlaying): string[] =>
  match(partial)
    .with([], always(['']))
    .otherwise(always([]))
)

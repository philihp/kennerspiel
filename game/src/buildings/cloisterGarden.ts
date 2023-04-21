import { always, curry, pipe } from 'ramda'
import { match } from 'ts-pattern'
import { allowFreeUsageToNeighborsOf, disableFurtherUsage } from '../board/frame'
import { getCost, withActivePlayer } from '../board/player'
import { BuildingEnum, GameStatePlaying, StateReducer } from '../types'

export const cloisterGarden = (): StateReducer =>
  pipe(
    withActivePlayer(getCost({ grape: 1 })),
    disableFurtherUsage(BuildingEnum.CloisterGarden),
    allowFreeUsageToNeighborsOf(BuildingEnum.CloisterGarden)
  )

export const complete = curry((partial: string[], _state: GameStatePlaying): string[] =>
  match(partial)
    .with([], always(['']))
    .otherwise(always([]))
)

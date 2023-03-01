import { pipe } from 'ramda'
import { allowFreeUsageToNeighborsOf, disableFurtherUsage } from '../board/frame'
import { getCost, withActivePlayer } from '../board/player'
import { BuildingEnum, StateReducer } from '../types'

export const cottage = (): StateReducer =>
  pipe(
    withActivePlayer(getCost({ malt: 1 })),
    disableFurtherUsage(BuildingEnum.Cottage),
    allowFreeUsageToNeighborsOf(BuildingEnum.Cottage)
  )

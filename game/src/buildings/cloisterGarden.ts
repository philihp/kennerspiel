import { pipe } from 'ramda'
import { allowFreeUsageToNeighborsOf, disableFurtherUsage } from '../board/frame'
import { getCost, withActivePlayer } from '../board/player'
import { BuildingEnum, StateReducer } from '../types'

export const cloisterGarden = (): StateReducer =>
  pipe(
    withActivePlayer(getCost({ grape: 1 })),
    disableFurtherUsage(BuildingEnum.CloisterGarden),
    allowFreeUsageToNeighborsOf(BuildingEnum.CloisterGarden)
  )

import { BuildingEnum, LandEnum, StateReducer, Tile } from '../../types'
import { makeLandscape } from '../landscape'
import { clergyForColor } from '../player'

export const addNeutralPlayer: StateReducer = (state) => {
  if (state === undefined) return state

  const { color } = state.players[1]
  const clergy = clergyForColor(state.config)(color)
  const [row0, row1] = makeLandscape(color)
  const landscape: Tile[][] = [
    [
      [],
      [],
      [LandEnum.Plains, BuildingEnum.BuildersMarket],
      [LandEnum.Plains],
      [LandEnum.Plains],
      [LandEnum.Plains],
      row0[6],
      [],
      [],
    ],
    [
      [], // basically its just an empty landscape, but use the right colors
      [],
      [LandEnum.Plains],
      [LandEnum.Plains],
      row1[4],
      [LandEnum.Plains],
      row1[6],
      [],
      [],
    ],
  ]

  return {
    ...state,
    players: [
      state.players[0],
      {
        ...state.players[1],
        color,
        clergy,
        landscape,
      },
    ],
  }
}

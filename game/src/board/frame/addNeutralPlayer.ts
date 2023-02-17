import { randRange } from 'fn-pcg'
import { BuildingEnum, LandEnum, PlayerColor, StateReducer, Tile } from '../../types'
import { makeLandscape } from '../landscape'

const neutralColor = (playerColor: PlayerColor, neutralColorIndex: number) =>
  [
    // pick a color that the player isn't using
    PlayerColor.Red,
    PlayerColor.Blue,
    PlayerColor.Green,
    PlayerColor.White,
  ].filter((c) => c !== playerColor)[neutralColorIndex]

export const addNeutralPlayer: StateReducer = (state) => {
  if (state === undefined) return state

  const [neutralColorIndex, randGen] = randRange(0, 3, state.randGen)
  const color = neutralColor(state.players[0].color, neutralColorIndex)
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
    randGen,
    players: [
      ...state.players,
      {
        ...state.players[0],
        color,
        landscape,
      },
    ],
  }
}

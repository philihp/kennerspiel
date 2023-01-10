import { randRange } from 'fn-pcg'
import { match } from 'ts-pattern'
import { BuildingEnum, GameCommandConfigParams, GameStatePlaying, LandEnum, PlayerColor, Tile } from '../types'

const PP: Tile = [LandEnum.Plains, BuildingEnum.Peat]
const PF: Tile = [LandEnum.Plains, BuildingEnum.Forest]
const P: Tile = [LandEnum.Plains]

const startBuilding = {
  [PlayerColor.Red]: [BuildingEnum.ClayMoundR, BuildingEnum.FarmYardR, BuildingEnum.CloisterOfficeR],
  [PlayerColor.Green]: [BuildingEnum.ClayMoundG, BuildingEnum.FarmYardG, BuildingEnum.CloisterOfficeG],
  [PlayerColor.Blue]: [BuildingEnum.ClayMoundB, BuildingEnum.FarmYardB, BuildingEnum.CloisterOfficeB],
  [PlayerColor.White]: [BuildingEnum.ClayMoundW, BuildingEnum.FarmYardW, BuildingEnum.CloisterOfficeW],
}

export const makeLandscape = (color: PlayerColor, isNeutral?: boolean): Tile[][] => {
  const cm: Tile = [LandEnum.Hillside, startBuilding[color][0]]
  const fy: Tile = [LandEnum.Plains, startBuilding[color][1]]
  const co: Tile = [LandEnum.Plains, startBuilding[color][2]]
  if (isNeutral) {
    return [
      [[LandEnum.Plains, BuildingEnum.BuildersMarket], P, P, P, cm],
      [P, P, fy, P, co],
    ]
  }
  return [
    [PP, PF, PF, P, cm],
    [PP, PF, fy, P, co],
  ]
}

const neutralColor = (playerColor: PlayerColor, neutralColorIndex: number) =>
  [
    // pick a color that the player isn't using
    PlayerColor.Red,
    PlayerColor.Blue,
    PlayerColor.Green,
    PlayerColor.White,
  ].filter((c) => c !== playerColor)[neutralColorIndex]

export const modeSetup =
  (config: GameCommandConfigParams) =>
  (state: GameStatePlaying): GameStatePlaying =>
    match(config)
      .with({ players: 1, country: 'france' }, () => {
        const [neutralColorIndex, randGen] = randRange(0, 3, state.randGen)
        const color = neutralColor(state.players[0].color, neutralColorIndex)
        return {
          ...state,
          randGen,
          players: [
            {
              ...state.players[0],
              wood: 0,
              clay: 0,
              peat: 0,
              penny: 0,
              grain: 0,
              sheep: 0,
            },
            {
              ...state.players[0],
              color,
              landscape: makeLandscape(color),
            },
          ],
        }
      })
      .otherwise(() => state)

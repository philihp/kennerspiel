import { BuildingEnum, Clergy, GameCommand, GameState, GameStatusEnum, LandEnum, Tableau, Tile } from '../types'

const PP: Tile = [LandEnum.Plains, BuildingEnum.Peat]
const PF: Tile = [LandEnum.Plains, BuildingEnum.Forest]
const P: Tile = [LandEnum.Plains]

const CM = [BuildingEnum.ClayMoundR, BuildingEnum.ClayMoundG, BuildingEnum.ClayMoundB, BuildingEnum.ClayMoundW]
const FY = [BuildingEnum.FarmYardR, BuildingEnum.FarmYardG, BuildingEnum.FarmYardB, BuildingEnum.FarmYardW]
const CO = [
  BuildingEnum.CloisterOfficeR,
  BuildingEnum.CloisterOfficeG,
  BuildingEnum.CloisterOfficeB,
  BuildingEnum.CloisterOfficeW,
]

const makeLandscape = (i: number) => {
  if (i < 0 || i > 3) return [[]]
  const cm: Tile = [LandEnum.Hillside, CM[i]]
  const fy: Tile = [LandEnum.Plains, FY[i]]
  const co: Tile = [LandEnum.Plains, CO[i]]
  return [
    [PP, PF, PF, P, cm],
    [PP, PF, fy, P, co],
  ]
}

export const start: GameCommand = (state: GameState) => {
  if (state.status !== GameStatusEnum.SETUP) return undefined
  if (state.rondel === undefined) return undefined
  if (state.config === undefined) return undefined
  if (state.config.players === undefined) return undefined

  const players = new Array<Tableau>(state.config.players)
    .fill({
      clergy: [Clergy.laybrother1, Clergy.laybrother2, Clergy.prior],
      landscape: [[]],
    })
    .map((player, i) => ({
      ...player,
      landscape: makeLandscape(i),
    }))

  return {
    ...state,
    status: GameStatusEnum.PLAYING,
    players,
    rondel: {
      ...state.rondel,
      wood: 0,
      clay: 0,
      coin: 0,
      joker: 0,
    },
  }
}

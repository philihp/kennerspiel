import fastShuffle from 'fast-shuffle'
import { newRandGen, randNext } from 'fn-pcg'
import {
  BuildingEnum,
  Clergy,
  GameCommandStartParams,
  GameState,
  GameStatusEnum,
  LandEnum,
  PlayerColor,
  Tableau,
  Tile,
} from '../types'

const PP: Tile = [LandEnum.Plains, BuildingEnum.Peat]
const PF: Tile = [LandEnum.Plains, BuildingEnum.Forest]
const P: Tile = [LandEnum.Plains]

const startBuilding = {
  [PlayerColor.Red]: [BuildingEnum.ClayMoundR, BuildingEnum.FarmYardR, BuildingEnum.CloisterOfficeR],
  [PlayerColor.Green]: [BuildingEnum.ClayMoundG, BuildingEnum.FarmYardG, BuildingEnum.CloisterOfficeG],
  [PlayerColor.Blue]: [BuildingEnum.ClayMoundB, BuildingEnum.FarmYardB, BuildingEnum.CloisterOfficeB],
  [PlayerColor.White]: [BuildingEnum.ClayMoundW, BuildingEnum.FarmYardW, BuildingEnum.CloisterOfficeW],
}

const makeLandscape = (color: PlayerColor) => {
  const cm: Tile = [LandEnum.Hillside, startBuilding[color][0]]
  const fy: Tile = [LandEnum.Plains, startBuilding[color][1]]
  const co: Tile = [LandEnum.Plains, startBuilding[color][2]]
  return [
    [PP, PF, PF, P, cm],
    [PP, PF, fy, P, co],
  ]
}

type StartParser = (params: string[]) => GameCommandStartParams

const BAD_PARSE: GameCommandStartParams = {
  seed: 0,
  colors: [],
}

const stringToColor: (s: string) => PlayerColor = (s) => {
  switch (s) {
    case 'RED':
      return PlayerColor.Red
    case 'GREEN':
      return PlayerColor.Green
    case 'BLUE':
      return PlayerColor.Blue
    case 'WHITE':
    default:
      return PlayerColor.White
  }
}

export const parse: StartParser = (params) => {
  if (params === undefined) return BAD_PARSE
  if (params.length <= 1 || params.length > 5) return BAD_PARSE
  const [seedParam, ...colorParams] = params
  const seed = Number.parseInt(seedParam, 10)
  if (seed === undefined || Number.isNaN(seed)) return BAD_PARSE
  const colors = colorParams.map(stringToColor)
  return {
    seed,
    colors,
  }
}

export const start = (state: GameState, { seed, colors }: GameCommandStartParams) => {
  if (state.status !== GameStatusEnum.SETUP) return undefined
  if (state.rondel === undefined) return undefined
  if (state.config === undefined) return undefined
  if (state.config.players === undefined) return undefined
  if (colors.length !== state.config.players) return undefined

  const [playerOrderSeed, randGen] = randNext(newRandGen(seed))
  const shuffledColors = fastShuffle(playerOrderSeed, colors)

  const players = new Array<Tableau>(state.config.players)
    .fill({
      clergy: [Clergy.laybrother1, Clergy.laybrother2, Clergy.prior],
      landscape: [[]],
      peat: 1,
      penny: 1,
      clay: 1,
      wood: 1,
      grain: 1,
      sheep: 1,
      stone: 0,
      flour: 0,
      grapes: 0,
      nickel: 0,
      hops: 0,
      coal: 0,
      book: 0,
      pottery: 0,
      whiskey: 0,
      straw: 0,
      meat: 0,
      ornament: 0,
      bread: 0,
      wine: 0,
      beer: 0,
      reliquary: 0,
    })
    .map((player, i) => ({
      ...player,
      landscape: makeLandscape(shuffledColors[i]),
    }))

  return {
    ...state,
    randGen,
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

import fastShuffle from 'fast-shuffle'
import { newRandGen, randNext, randRange } from 'fn-pcg'
import { clergyForColor } from '../board/player'
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

export const start = (state: GameState, { seed, colors }: GameCommandStartParams): GameState | undefined => {
  if (state.status !== GameStatusEnum.SETUP) return undefined
  if (state.rondel === undefined) return undefined
  if (state.config === undefined) return undefined
  if (state.config.players === undefined) return undefined
  if (colors.length !== state.config.players) return undefined

  const randGen0 = newRandGen(seed)
  const [playerOrderSeed, randGen1] = randNext(randGen0)
  const [startingPlayer, randGen2] = randRange(0, state.config.players, randGen1)
  const shuffledColors = fastShuffle(playerOrderSeed, colors)

  const players = new Array<Tableau>(state.config.players)
    .fill({
      color: PlayerColor.Red, // placeholder
      clergy: [],
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
      color: shuffledColors[i],
      landscape: makeLandscape(shuffledColors[i]),
      clergy: clergyForColor(shuffledColors[i]),
    }))

  return {
    ...state,
    randGen: randGen2,
    status: GameStatusEnum.PLAYING,
    players,
    rondel: {
      ...state.rondel,
      grain: 0,
      peat: 0,
      sheep: 0,
      clay: 0,
      coin: 0,
      wood: 0,
      grape: 0,
      stone: 0,
      joker: 0,
    },
    round: 1,
    moveInRound: 1,
    startingPlayer,
  }
}

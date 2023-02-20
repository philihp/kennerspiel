import fastShuffle from 'fast-shuffle'
import { newRandGen, randNext } from 'fn-pcg'
import { pipe } from 'ramda'
import { nextFrame } from '../board/frame'
import { districtPrices, makeLandscape, plotPrices } from '../board/landscape'
import { clergyForColor } from '../board/player'
import {
  GameCommandStartParams,
  GameStatePlaying,
  GameStateSetup,
  GameStatusEnum,
  NextUseClergy,
  PlayerColor,
  SettlementRound,
  Tableau,
} from '../types'

export const start = (
  state: GameStateSetup,
  { seed, colors }: GameCommandStartParams
): GameStatePlaying | undefined => {
  if (state.rondel === undefined) return undefined
  if (state.config === undefined) return undefined
  if (state.config.players === undefined) return undefined
  if (colors.length !== state.config.players) return undefined

  const randGen0 = newRandGen(seed)
  const [playerOrderSeed, randGen1] = randNext(randGen0)
  const shuffledColors = fastShuffle(playerOrderSeed, colors)

  const players = new Array<Tableau>(state.config.players)
    .fill({
      color: PlayerColor.Red, // placeholder
      clergy: [],
      landscape: [[]],
      landscapeOffset: 0,
      settlements: [],
      wonders: 0,
      peat: 0,
      penny: 0,
      clay: 0,
      wood: 0,
      grain: 0,
      sheep: 0,
      stone: 0,
      flour: 0,
      grape: 0,
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
      settlements: [],
    }))

  const newState: GameStatePlaying = {
    ...state,
    config: state.config,
    randGen: randGen1,
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
      joker: 0,
    },
    wonders: 8,
    frame: {
      next: 1,
      startingPlayer: 0,
      settlementRound: SettlementRound.S,
      currentPlayerIndex: 0,
      activePlayerIndex: 0,
      neutralBuildingPhase: false,
      bonusRoundPlacement: false,
      mainActionUsed: false,
      bonusActions: [],
      canBuyLandscape: true,
      unusableBuildings: [],
      usableBuildings: [],
      nextUse: NextUseClergy.Any,
    },
    buildings: [],
    plotPurchasePrices: plotPrices(state.config),
    districtPurchasePrices: districtPrices(state.config),
  }

  return pipe(
    //
    nextFrame
  )(newState)
}

import fastShuffle from 'fast-shuffle'
import { newRandGen, randNext, randRange } from 'fn-pcg'
import { pipe } from 'ramda'
import { roundBuildings } from '../board/buildings'
import { nextFrame } from '../board/frame'
import { districtPrices, plotPrices } from '../board/landscape'
import { makeLandscape, modeSetup } from '../board/modeSetup'
import { clergyForColor } from '../board/player'
import { roundSettlements } from '../board/settlements'
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
      peat: 1,
      penny: 1,
      clay: 1,
      wood: 1,
      grain: 1,
      sheep: 1,
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
      settlements: roundSettlements(player.color, SettlementRound.S),
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
      grape: 0,
      stone: 0,
      joker: 0,
    },
    wonders: 8,
    frame: {
      next: 1,
      startingPlayer: 0,
      settlementRound: SettlementRound.S,
      workContractCost: 1,
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
    buildings: roundBuildings(state.config, SettlementRound.S),
    plotPurchasePrices: plotPrices(state.config),
    districtPurchasePrices: districtPrices(state.config),
  }

  return pipe(
    modeSetup(state.config), // basically just single player stuff
    // preMove
    nextFrame
  )(newState)
}

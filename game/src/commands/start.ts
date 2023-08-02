import fastShuffle from 'fast-shuffle'
import { createPcg32, randomInt } from 'fn-pcg'
import { pipe, range } from 'ramda'
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
} from '../types'

// we could get more entropy with a second seed, but
// honestly this is fine for now.
const PCG_PERIOD = 42069

// this is a brute-forced seed given the above, which
// results in a noop shuffle for 2, 3, 4, or even 5 elements
const MAGIC_SEED = 2692

const neutralColor = (notThisColor: PlayerColor, neutralColorIndex: number) =>
  [
    // pick a color that the player isn't using
    PlayerColor.Red,
    PlayerColor.Blue,
    PlayerColor.Green,
    PlayerColor.White,
  ].filter((c) => c !== notThisColor)[neutralColorIndex]

export const start = (
  state: GameStateSetup,
  { seed, colors }: GameCommandStartParams
): GameStatePlaying | undefined => {
  if (state.rondel === undefined) return undefined
  if (state.config === undefined) return undefined
  if (colors.length < 1 || colors.length > 4) return undefined
  const seedUsed = seed ?? MAGIC_SEED

  let randGen = createPcg32({}, seedUsed, PCG_PERIOD)
  const [playerOrderSeed, randGen1] = randomInt(0, 2 ** 32 - 1, randGen)
  randGen = randGen1
  const shuffledColors = fastShuffle(playerOrderSeed, colors)

  const playerIndexes = range(0, state.config.players)
  const players = playerIndexes.map((i) => {
    return {
      landscapeOffset: 0,
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
      malt: 0,
      coal: 0,
      book: 0,
      ceramic: 0,
      whiskey: 0,
      straw: 0,
      meat: 0,
      ornament: 0,
      bread: 0,
      wine: 0,
      beer: 0,
      reliquary: 0,
      color: shuffledColors[i],
      landscape: makeLandscape(shuffledColors[i]),
      clergy: clergyForColor(state.config)(shuffledColors[i]),
      settlements: [],
    }
  })

  // feels weird to do this here, but i think it's more difficult to pass along the
  // neutral player's color IF we had it and generate it later from addNeutralPlayer
  if (state.config.players === 1) {
    if (seed === undefined) {
      players.push({
        ...players[0],
        color: shuffledColors[1],
        landscape: [[]],
        clergy: [],
      })
    } else {
      const [neutralColorIndex, randGen2] = randomInt(0, 3, randGen)
      randGen = randGen2
      const color = neutralColor(players[0].color, neutralColorIndex)
      players.push({
        ...players[0],
        color,
        landscape: [[]],
        clergy: [],
      })
    }
  }

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
      round: 1,
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

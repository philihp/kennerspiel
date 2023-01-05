import fastShuffle from 'fast-shuffle'
import { newRandGen, randNext, randRange } from 'fn-pcg'
import { roundBuildings } from '../board/buildings'
import { makeLandscape, modeSetup } from '../board/modeSetup'
import { clergyForColor } from '../board/player'
import { preMove } from '../board/preMove'
import { roundSettlements } from '../board/settlements'
import {
  GameCommandStartParams,
  GameStatePlaying,
  GameStateSetup,
  GameStatusEnum,
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
  const [startingPlayer, randGen2] = randRange(0, state.config.players, randGen1)
  const shuffledColors = fastShuffle(playerOrderSeed, colors)

  const players = new Array<Tableau>(state.config.players)
    .fill({
      color: PlayerColor.Red, // placeholder
      clergy: [],
      landscape: [[]],
      settlements: [],
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
      settlements: roundSettlements(player.color, SettlementRound.S),
    }))

  const newState: GameStatePlaying = {
    ...state,
    config: state.config,
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
    buildings: roundBuildings(state.config, SettlementRound.S),
    activePlayerIndex: 0,
    actionList: [],
    settling: false,
    extraRound: false,
    settlementRound: SettlementRound.S,
    plotPurchasePrices: [],
    districtPurchasePrices: [],
    neutralBuildingPhase: false,
  }

  return preMove(modeSetup(state.config)(newState))
}

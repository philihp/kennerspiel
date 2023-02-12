import { FrameFlow, GameCommandEnum, NextUseClergy, SettlementRound } from '../../types'
import { getCost, withEachPlayer } from '../player'
import { introduceGrapeToken, introduceStoneToken } from '../rondel'
import { allPriorsComeBack } from './allPriorsComeBack'
import { gameEnd } from './gameEnd'
import { introduceBuildings } from './introduceBuildings'
import { returnClergyIfPlaced } from './returnClergyIfPlaced'
import { rotateRondel } from './rotateRondel'

// TODO: only 2 clergymen

export const nextFrame3Short: FrameFlow = {
  // Round 1
  1: {
    startingPlayer: 0,
    currentPlayerIndex: 0,
    settlementRound: SettlementRound.S,
    upkeep: [rotateRondel, withEachPlayer(getCost({ grain: 1, sheep: 1 })), introduceBuildings],
    next: 2,
  },
  2: {
    currentPlayerIndex: 1,
    next: 3,
  },
  3: {
    currentPlayerIndex: 2,
    next: 4,
  },
  4: {
    currentPlayerIndex: 0,
    next: 5,
  },

  // Round 2
  6: {
    startingPlayer: 1,
    currentPlayerIndex: 1,
    upkeep: [rotateRondel, returnClergyIfPlaced, withEachPlayer(getCost({ grain: 1, clay: 1 }))],
    next: 7,
  },
  7: {
    currentPlayerIndex: 2,
    next: 8,
  },
  8: {
    currentPlayerIndex: 0,
    next: 9,
  },
  9: {
    currentPlayerIndex: 1,
    next: 10,
  },

  // Settlement A
  10: {
    startingPlayer: 2,
    currentPlayerIndex: 2,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    settlementRound: SettlementRound.A,
    next: 11,
  },
  11: {
    currentPlayerIndex: 0,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    next: 12,
  },
  12: {
    currentPlayerIndex: 1,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    next: 13,
  },

  // Round 3
  13: {
    startingPlayer: 2,
    currentPlayerIndex: 2,
    upkeep: [rotateRondel, returnClergyIfPlaced, withEachPlayer(getCost({ grain: 1, wood: 1 })), introduceBuildings],
    next: 14,
  },
  14: {
    currentPlayerIndex: 0,
    next: 15,
  },
  15: {
    currentPlayerIndex: 1,
    next: 16,
  },
  16: {
    currentPlayerIndex: 2,
    next: 17,
  },

  // Round 4
  17: {
    startingPlayer: 0,
    currentPlayerIndex: 0,
    upkeep: [rotateRondel, returnClergyIfPlaced, withEachPlayer(getCost({ grain: 1, stone: 1 })), introduceGrapeToken],
    next: 18,
  },
  18: {
    currentPlayerIndex: 1,
    next: 19,
  },
  19: {
    currentPlayerIndex: 2,
    next: 20,
  },
  20: {
    currentPlayerIndex: 0,
    next: 21,
  },

  // Settlement B
  21: {
    startingPlayer: 1,
    currentPlayerIndex: 1,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    settlementRound: SettlementRound.B,
    next: 22,
  },
  22: {
    currentPlayerIndex: 2,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    next: 23,
  },
  23: {
    currentPlayerIndex: 0,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    next: 24,
  },

  // Round 5
  24: {
    startingPlayer: 1,
    currentPlayerIndex: 1,
    upkeep: [rotateRondel, returnClergyIfPlaced, withEachPlayer(getCost({ peat: 1, stone: 1 })), introduceBuildings],
    next: 25,
  },
  25: {
    currentPlayerIndex: 2,
    next: 26,
  },
  26: {
    currentPlayerIndex: 0,
    next: 27,
  },
  27: {
    currentPlayerIndex: 1,
    next: 28,
  },

  // Round 6
  28: {
    startingPlayer: 2,
    currentPlayerIndex: 2,
    upkeep: [rotateRondel, returnClergyIfPlaced, withEachPlayer(getCost({ clay: 1, stone: 1 })), introduceStoneToken],
    next: 29,
  },
  29: {
    currentPlayerIndex: 0,
    next: 30,
  },
  30: {
    currentPlayerIndex: 1,
    next: 31,
  },
  31: {
    currentPlayerIndex: 2,
    next: 32,
  },

  // Settlement C
  32: {
    startingPlayer: 0,
    currentPlayerIndex: 0,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    settlementRound: SettlementRound.C,
    next: 33,
  },
  33: {
    currentPlayerIndex: 1,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    next: 34,
  },
  34: {
    currentPlayerIndex: 2,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    next: 35,
  },

  // Round 7
  35: {
    currentPlayerIndex: 0,
    upkeep: [rotateRondel, returnClergyIfPlaced, withEachPlayer(getCost({ wood: 1, stone: 1 })), introduceBuildings],
    next: 36,
  },
  36: {
    currentPlayerIndex: 1,
    next: 37,
  },
  37: {
    currentPlayerIndex: 2,
    next: 38,
  },
  38: {
    currentPlayerIndex: 0,
    next: 39,
  },

  // Round 8
  39: {
    startingPlayer: 1,
    currentPlayerIndex: 1,
    upkeep: [rotateRondel, returnClergyIfPlaced, withEachPlayer(getCost({ stone: 1, nickel: 1 }))],
    next: 40,
  },
  40: {
    currentPlayerIndex: 2,
    next: 41,
  },
  41: {
    currentPlayerIndex: 0,
    next: 42,
  },
  42: {
    currentPlayerIndex: 1,
    next: 43,
  },

  // Settlement D
  43: {
    startingPlayer: 2,
    currentPlayerIndex: 2,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    settlementRound: SettlementRound.D,
    next: 44,
  },
  44: {
    currentPlayerIndex: 0,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    next: 45,
  },
  45: {
    currentPlayerIndex: 1,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    next: 46,
  },

  // Round 9
  46: {
    currentPlayerIndex: 2,
    upkeep: [rotateRondel, returnClergyIfPlaced, withEachPlayer(getCost({ stone: 1, meat: 1 })), introduceBuildings],
    next: 47,
  },
  47: {
    currentPlayerIndex: 0,
    next: 48,
  },
  48: {
    currentPlayerIndex: 1,
    next: 49,
  },
  49: {
    currentPlayerIndex: 2,
    next: 50,
  },

  // Round 10
  50: {
    startingPlayer: 0,
    currentPlayerIndex: 0,
    upkeep: [rotateRondel, returnClergyIfPlaced, withEachPlayer(getCost({ book: 1, grain: 1 }))],
    next: 51,
  },
  51: {
    currentPlayerIndex: 1,
    next: 52,
  },
  52: {
    currentPlayerIndex: 2,
    next: 53,
  },
  53: {
    currentPlayerIndex: 0,
    next: 54,
  },

  // Round 11
  54: {
    startingPlayer: 1,
    currentPlayerIndex: 1,
    upkeep: [rotateRondel, returnClergyIfPlaced, withEachPlayer(getCost({ pottery: 1, clay: 1 }))],
    next: 55,
  },
  55: {
    currentPlayerIndex: 2,
    next: 56,
  },
  56: {
    currentPlayerIndex: 0,
    next: 57,
  },
  57: {
    currentPlayerIndex: 1,
    next: 58,
  },

  // Round 12
  58: {
    startingPlayer: 2,
    currentPlayerIndex: 2,
    upkeep: [rotateRondel, returnClergyIfPlaced, withEachPlayer(getCost({ ornament: 1, wood: 1 }))],
    next: 59,
  },
  59: {
    currentPlayerIndex: 0,
    next: 60,
  },
  60: {
    currentPlayerIndex: 1,
    next: 61,
  },
  61: {
    currentPlayerIndex: 2,
    next: 62,
  },

  62: {
    startingPlayer: 0,
    currentPlayerIndex: 0,
    bonusRoundPlacement: true,
    nextUse: NextUseClergy.OnlyPrior,
    upkeep: [allPriorsComeBack, rotateRondel, returnClergyIfPlaced],
    next: 63,
  },
  63: {
    currentPlayerIndex: 1,
    bonusRoundPlacement: true,
    nextUse: NextUseClergy.OnlyPrior,
    next: 64,
  },
  64: {
    currentPlayerIndex: 2,
    bonusRoundPlacement: true,
    nextUse: NextUseClergy.OnlyPrior,
    next: 65,
  },

  // Settlement E
  65: {
    currentPlayerIndex: 0,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    settlementRound: SettlementRound.E,
    next: 66,
  },
  66: {
    currentPlayerIndex: 1,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    next: 67,
  },
  67: {
    currentPlayerIndex: 2,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    next: 68,
  },

  68: {
    upkeep: [gameEnd],
    next: 68,
  },
}

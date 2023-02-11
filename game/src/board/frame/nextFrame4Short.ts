import { FrameFlow, GameCommandEnum, NextUseClergy, SettlementRound } from '../../types'
import { getCost, withEachPlayer } from '../player'
import { introduceGrapeToken, introduceStoneToken } from '../rondel'
import { allPriorsComeBack } from './allPriorsComeBack'
import { gameEnd } from './gameEnd'
import { introduceBuildings } from './introduceBuildings'
import { returnClergyIfPlaced } from './returnClergyIfPlaced'
import { rotateRondel } from './rotateRondel'

// TODO: only 2 clergymen

export const nextFrame4Short: FrameFlow = {
  // Round 1
  1: {
    startingPlayer: 0,
    currentPlayerIndex: 0,
    upkeep: [rotateRondel, withEachPlayer(getCost({ grain: 1, sheep: 1 })), introduceBuildings(SettlementRound.S)],
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
    currentPlayerIndex: 3,
    next: 5,
  },
  5: {
    currentPlayerIndex: 0,
    next: 6,
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
    currentPlayerIndex: 3,
    next: 9,
  },
  9: {
    currentPlayerIndex: 0,
    next: 10,
  },
  10: {
    currentPlayerIndex: 1,
    next: 11,
  },

  // Settlement A
  11: {
    startingPlayer: 2,
    currentPlayerIndex: 2,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    settlementRound: SettlementRound.A,
    next: 12,
  },
  12: {
    currentPlayerIndex: 3,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    next: 13,
  },
  13: {
    currentPlayerIndex: 0,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    next: 14,
  },
  14: {
    currentPlayerIndex: 1,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    next: 15,
  },

  // Round 3
  15: {
    startingPlayer: 2,
    currentPlayerIndex: 2,
    upkeep: [
      rotateRondel,
      returnClergyIfPlaced,
      withEachPlayer(getCost({ grain: 1, wood: 1 })),
      introduceBuildings(SettlementRound.A),
    ],
    next: 16,
  },
  16: {
    currentPlayerIndex: 3,
    next: 17,
  },
  17: {
    currentPlayerIndex: 0,
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

  // Round 4
  20: {
    startingPlayer: 3,
    currentPlayerIndex: 3,
    upkeep: [rotateRondel, returnClergyIfPlaced, withEachPlayer(getCost({ grain: 1, stone: 1 })), introduceGrapeToken],
    next: 21,
  },
  21: {
    currentPlayerIndex: 0,
    next: 22,
  },
  22: {
    currentPlayerIndex: 1,
    next: 23,
  },
  23: {
    currentPlayerIndex: 2,
    next: 24,
  },
  24: {
    currentPlayerIndex: 3,
    next: 25,
  },

  // Settlement B
  25: {
    startingPlayer: 0,
    currentPlayerIndex: 0,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    settlementRound: SettlementRound.B,
    next: 26,
  },
  26: {
    currentPlayerIndex: 1,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    next: 27,
  },
  27: {
    currentPlayerIndex: 2,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    next: 28,
  },
  28: {
    currentPlayerIndex: 3,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    next: 29,
  },

  // Round 5
  29: {
    currentPlayerIndex: 0,
    upkeep: [
      rotateRondel,
      returnClergyIfPlaced,
      withEachPlayer(getCost({ peat: 1, stone: 1 })),
      introduceBuildings(SettlementRound.B),
    ],
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
  32: {
    currentPlayerIndex: 3,
    next: 33,
  },
  33: {
    currentPlayerIndex: 0,
    next: 34,
  },

  // Round 6
  34: {
    startingPlayer: 1,
    currentPlayerIndex: 1,
    upkeep: [rotateRondel, returnClergyIfPlaced, withEachPlayer(getCost({ clay: 1, stone: 1 })), introduceStoneToken],
    next: 35,
  },
  35: {
    currentPlayerIndex: 2,
    next: 36,
  },
  36: {
    currentPlayerIndex: 3,
    next: 37,
  },
  37: {
    currentPlayerIndex: 0,
    next: 38,
  },
  38: {
    currentPlayerIndex: 1,
    next: 39,
  },

  // Settlement C
  39: {
    startingPlayer: 2,
    currentPlayerIndex: 2,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    settlementRound: SettlementRound.C,
    next: 40,
  },
  40: {
    currentPlayerIndex: 3,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    next: 41,
  },
  41: {
    currentPlayerIndex: 0,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    next: 42,
  },
  42: {
    currentPlayerIndex: 1,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    next: 43,
  },

  // Round 7
  43: {
    currentPlayerIndex: 2,
    upkeep: [
      rotateRondel,
      returnClergyIfPlaced,
      withEachPlayer(getCost({ wood: 1, stone: 1 })),
      introduceBuildings(SettlementRound.C),
    ],
    next: 44,
  },
  44: {
    currentPlayerIndex: 3,
    next: 45,
  },
  45: {
    currentPlayerIndex: 0,
    next: 46,
  },
  46: {
    currentPlayerIndex: 1,
    next: 47,
  },
  47: {
    currentPlayerIndex: 2,
    next: 48,
  },

  // Round 8
  48: {
    startingPlayer: 3,
    currentPlayerIndex: 3,
    upkeep: [rotateRondel, returnClergyIfPlaced, withEachPlayer(getCost({ stone: 1, nickel: 1 }))],
    next: 49,
  },
  49: {
    currentPlayerIndex: 0,
    next: 50,
  },
  50: {
    currentPlayerIndex: 1,
    next: 51,
  },
  51: {
    currentPlayerIndex: 2,
    next: 52,
  },
  52: {
    currentPlayerIndex: 3,
    next: 53,
  },

  // Settlement D
  53: {
    startingPlayer: 0,
    currentPlayerIndex: 0,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    settlementRound: SettlementRound.D,
    next: 54,
  },
  54: {
    currentPlayerIndex: 1,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    next: 5,
  },
  55: {
    currentPlayerIndex: 2,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    next: 56,
  },
  56: {
    currentPlayerIndex: 3,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    next: 57,
  },

  // Round 9
  57: {
    currentPlayerIndex: 0,
    upkeep: [
      rotateRondel,
      returnClergyIfPlaced,
      withEachPlayer(getCost({ stone: 1, meat: 1 })),
      introduceBuildings(SettlementRound.D),
    ],
    next: 58,
  },
  58: {
    currentPlayerIndex: 1,
    next: 59,
  },
  59: {
    currentPlayerIndex: 2,
    next: 60,
  },
  60: {
    currentPlayerIndex: 3,
    next: 61,
  },
  61: {
    currentPlayerIndex: 0,
    next: 62,
  },

  // Round 10
  62: {
    startingPlayer: 1,
    currentPlayerIndex: 1,
    upkeep: [rotateRondel, returnClergyIfPlaced, withEachPlayer(getCost({ book: 1, grain: 1 }))],
    next: 63,
  },
  63: {
    currentPlayerIndex: 2,
    next: 64,
  },
  64: {
    currentPlayerIndex: 3,
    next: 65,
  },
  65: {
    currentPlayerIndex: 0,
    next: 66,
  },
  66: {
    currentPlayerIndex: 1,
    next: 67,
  },

  // Round 11
  67: {
    currentPlayerIndex: 2,
    upkeep: [rotateRondel, returnClergyIfPlaced, withEachPlayer(getCost({ pottery: 1, clay: 1 }))],
    next: 68,
  },
  68: {
    currentPlayerIndex: 3,
    next: 69,
  },
  69: {
    currentPlayerIndex: 0,
    next: 70,
  },
  70: {
    currentPlayerIndex: 1,
    next: 71,
  },
  71: {
    currentPlayerIndex: 2,
    next: 72,
  },

  // Round 12
  72: {
    startingPlayer: 3,
    currentPlayerIndex: 3,
    upkeep: [rotateRondel, returnClergyIfPlaced, withEachPlayer(getCost({ ornament: 1, wood: 1 }))],
    next: 73,
  },
  73: {
    currentPlayerIndex: 0,
    next: 74,
  },
  74: {
    currentPlayerIndex: 1,
    next: 75,
  },
  75: {
    currentPlayerIndex: 2,
    next: 76,
  },
  76: {
    currentPlayerIndex: 3,
    next: 77,
  },

  77: {
    startingPlayer: 0,
    currentPlayerIndex: 0,
    bonusRoundPlacement: true,
    nextUse: NextUseClergy.OnlyPrior,
    upkeep: [allPriorsComeBack, rotateRondel, returnClergyIfPlaced],
    next: 78,
  },
  78: {
    currentPlayerIndex: 1,
    bonusRoundPlacement: true,
    nextUse: NextUseClergy.OnlyPrior,
    next: 79,
  },
  79: {
    currentPlayerIndex: 2,
    bonusRoundPlacement: true,
    nextUse: NextUseClergy.OnlyPrior,
    next: 80,
  },
  80: {
    currentPlayerIndex: 3,
    bonusRoundPlacement: true,
    nextUse: NextUseClergy.OnlyPrior,
    next: 81,
  },

  // Settlement E
  81: {
    currentPlayerIndex: 0,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    settlementRound: SettlementRound.E,
    next: 82,
  },
  82: {
    currentPlayerIndex: 1,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    next: 83,
  },
  83: {
    currentPlayerIndex: 2,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    next: 84,
  },
  84: {
    currentPlayerIndex: 3,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    next: 85,
  },

  85: {
    upkeep: [gameEnd],
    next: 85,
  },
}

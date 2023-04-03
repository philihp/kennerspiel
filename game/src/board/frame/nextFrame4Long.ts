import { FrameFlow, GameCommandEnum, NextUseClergy, SettlementRound } from '../../types'
import { introduceBuildings } from '../buildings'
import { introduceGrapeToken, introduceStoneToken } from '../rondel'
import { allPriorsComeBack } from './allPriorsComeBack'
import { gameEnd } from '../state'
import { returnClergyIfPlaced } from './returnClergyIfPlaced'
import { rotateRondel } from './rotateRondel'
import { standardResources } from './standardResources'
import { introduceSettlements } from '../settlements'

export const nextFrame4Long: FrameFlow = {
  1: {
    round: 1,
    startingPlayer: 0,
    currentPlayerIndex: 0,
    settlementRound: SettlementRound.S,
    upkeep: [rotateRondel, introduceBuildings, introduceSettlements, standardResources],
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

  6: {
    round: 2,
    startingPlayer: 1,
    currentPlayerIndex: 1,
    upkeep: [rotateRondel, returnClergyIfPlaced],
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

  11: {
    round: 3,
    startingPlayer: 2,
    currentPlayerIndex: 2,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 12,
  },
  12: {
    currentPlayerIndex: 3,
    next: 13,
  },
  13: {
    currentPlayerIndex: 0,
    next: 14,
  },
  14: {
    currentPlayerIndex: 1,
    next: 16,
  },
  16: {
    currentPlayerIndex: 2,
    next: 17,
  },

  17: {
    round: 4,
    startingPlayer: 3,
    currentPlayerIndex: 3,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 18,
  },
  18: {
    currentPlayerIndex: 0,
    next: 19,
  },
  19: {
    currentPlayerIndex: 1,
    next: 20,
  },
  20: {
    currentPlayerIndex: 2,
    next: 21,
  },
  21: {
    currentPlayerIndex: 3,
    next: 22,
  },

  22: {
    round: 5,
    startingPlayer: 0,
    currentPlayerIndex: 0,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 23,
  },
  23: {
    currentPlayerIndex: 1,
    next: 24,
  },
  24: {
    currentPlayerIndex: 2,
    next: 25,
  },
  25: {
    currentPlayerIndex: 3,
    next: 26,
  },
  26: {
    currentPlayerIndex: 0,
    next: 27,
  },

  27: {
    round: 6,
    startingPlayer: 1,
    currentPlayerIndex: 1,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 28,
  },
  28: {
    currentPlayerIndex: 2,
    next: 29,
  },
  29: {
    currentPlayerIndex: 3,
    next: 30,
  },
  30: {
    currentPlayerIndex: 0,
    next: 31,
  },
  31: {
    currentPlayerIndex: 1,
    next: 32,
  },

  // Settlement A
  32: {
    startingPlayer: 2,
    currentPlayerIndex: 2,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    settlementRound: SettlementRound.A,
    next: 33,
  },
  33: {
    currentPlayerIndex: 3,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    next: 34,
  },
  34: {
    currentPlayerIndex: 0,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    next: 35,
  },
  35: {
    currentPlayerIndex: 1,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    next: 37, // note this skips because error
  },

  37: {
    round: 7,
    currentPlayerIndex: 2,
    upkeep: [introduceBuildings, introduceSettlements, rotateRondel, returnClergyIfPlaced],
    next: 38,
  },
  38: {
    currentPlayerIndex: 3,
    next: 39,
  },
  39: {
    currentPlayerIndex: 0,
    next: 40,
  },
  40: {
    currentPlayerIndex: 1,
    next: 41,
  },
  41: {
    currentPlayerIndex: 2,
    next: 42,
  },

  42: {
    round: 8,
    startingPlayer: 3,
    currentPlayerIndex: 3,
    upkeep: [introduceGrapeToken, rotateRondel, returnClergyIfPlaced],
    next: 43,
  },
  43: {
    currentPlayerIndex: 0,
    next: 44,
  },
  44: {
    currentPlayerIndex: 1,
    next: 45,
  },
  45: {
    currentPlayerIndex: 2,
    next: 46,
  },
  46: {
    currentPlayerIndex: 3,
    next: 47,
  },

  47: {
    round: 9,
    startingPlayer: 0,
    currentPlayerIndex: 0,
    upkeep: [rotateRondel, returnClergyIfPlaced],
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
  50: {
    currentPlayerIndex: 3,
    next: 51,
  },
  51: {
    currentPlayerIndex: 0,
    next: 52,
  },

  // Settlement B
  52: {
    startingPlayer: 1,
    currentPlayerIndex: 1,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    settlementRound: SettlementRound.B,
    next: 53,
  },
  53: {
    currentPlayerIndex: 2,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    next: 54,
  },
  54: {
    currentPlayerIndex: 3,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    next: 55,
  },
  55: {
    currentPlayerIndex: 0,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    next: 56,
  },

  56: {
    round: 10,
    currentPlayerIndex: 1,
    upkeep: [introduceBuildings, introduceSettlements, rotateRondel, returnClergyIfPlaced],
    next: 57,
  },
  57: {
    currentPlayerIndex: 2,
    next: 58,
  },
  58: {
    currentPlayerIndex: 3,
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
    round: 11,
    currentPlayerIndex: 2,
    startingPlayer: 2,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 62,
  },
  62: {
    currentPlayerIndex: 3,
    next: 63,
  },
  63: {
    currentPlayerIndex: 0,
    next: 64,
  },
  64: {
    currentPlayerIndex: 1,
    next: 65,
  },
  65: {
    currentPlayerIndex: 2,
    next: 66,
  },

  66: {
    round: 12,
    startingPlayer: 3,
    currentPlayerIndex: 3,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 67,
  },
  67: {
    currentPlayerIndex: 0,
    next: 68,
  },
  68: {
    currentPlayerIndex: 1,
    next: 69,
  },
  69: {
    currentPlayerIndex: 2,
    next: 70,
  },
  70: {
    currentPlayerIndex: 3,
    next: 71,
  },

  71: {
    round: 13,
    startingPlayer: 0,
    currentPlayerIndex: 0,
    upkeep: [introduceStoneToken, rotateRondel, returnClergyIfPlaced],
    next: 72,
  },
  72: {
    currentPlayerIndex: 1,
    next: 73,
  },
  73: {
    currentPlayerIndex: 2,
    next: 74,
  },
  74: {
    currentPlayerIndex: 3,
    next: 75,
  },
  75: {
    currentPlayerIndex: 0,
    next: 76,
  },

  76: {
    round: 14,
    startingPlayer: 1,
    currentPlayerIndex: 1,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 77,
  },
  77: {
    currentPlayerIndex: 2,
    next: 78,
  },
  78: {
    currentPlayerIndex: 3,
    next: 79,
  },
  79: {
    currentPlayerIndex: 0,
    next: 80,
  },
  80: {
    currentPlayerIndex: 1,
    next: 81,
  },

  81: {
    round: 15,
    startingPlayer: 2,
    currentPlayerIndex: 2,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 82,
  },
  82: {
    currentPlayerIndex: 3,
    next: 83,
  },
  83: {
    currentPlayerIndex: 0,
    next: 84,
  },
  84: {
    currentPlayerIndex: 1,
    next: 85,
  },
  85: {
    currentPlayerIndex: 2,
    next: 86,
  },

  // Settlement C
  86: {
    startingPlayer: 3,
    currentPlayerIndex: 3,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    settlementRound: SettlementRound.C,
    next: 87,
  },
  87: {
    currentPlayerIndex: 0,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    next: 88,
  },
  88: {
    currentPlayerIndex: 1,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    next: 89,
  },
  89: {
    currentPlayerIndex: 2,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    next: 90,
  },

  90: {
    round: 16,
    currentPlayerIndex: 3,
    upkeep: [introduceBuildings, introduceSettlements, rotateRondel, returnClergyIfPlaced],
    next: 91,
  },
  91: {
    currentPlayerIndex: 0,
    next: 92,
  },
  92: {
    currentPlayerIndex: 1,
    next: 93,
  },
  93: {
    currentPlayerIndex: 2,
    next: 94,
  },
  94: {
    currentPlayerIndex: 3,
    next: 95,
  },

  95: {
    round: 17,
    startingPlayer: 0,
    currentPlayerIndex: 0,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 96,
  },
  96: {
    currentPlayerIndex: 1,
    next: 97,
  },
  97: {
    currentPlayerIndex: 2,
    next: 98,
  },
  98: {
    currentPlayerIndex: 3,
    next: 99,
  },
  99: {
    currentPlayerIndex: 0,
    next: 100,
  },

  100: {
    round: 18,
    startingPlayer: 1,
    currentPlayerIndex: 1,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 101,
  },
  101: {
    currentPlayerIndex: 2,
    next: 102,
  },
  102: {
    currentPlayerIndex: 3,
    next: 103,
  },
  103: {
    currentPlayerIndex: 0,
    next: 104,
  },
  104: {
    currentPlayerIndex: 1,
    next: 105,
  },

  // Settlement D
  105: {
    startingPlayer: 2,
    currentPlayerIndex: 2,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    settlementRound: SettlementRound.D,
    next: 106,
  },
  106: {
    currentPlayerIndex: 3,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    next: 107,
  },
  107: {
    currentPlayerIndex: 0,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    next: 108,
  },
  108: {
    currentPlayerIndex: 1,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    next: 109,
  },

  109: {
    round: 19,
    currentPlayerIndex: 2,
    upkeep: [introduceBuildings, introduceSettlements, rotateRondel, returnClergyIfPlaced],
    next: 110,
  },
  110: {
    currentPlayerIndex: 3,
    next: 111,
  },
  111: {
    currentPlayerIndex: 0,
    next: 112,
  },
  112: {
    currentPlayerIndex: 1,
    next: 113,
  },
  113: {
    currentPlayerIndex: 2,
    next: 114,
  },

  114: {
    round: 20,
    startingPlayer: 3,
    currentPlayerIndex: 3,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 115,
  },
  115: {
    currentPlayerIndex: 0,
    next: 116,
  },
  116: {
    currentPlayerIndex: 1,
    next: 117,
  },
  117: {
    currentPlayerIndex: 2,
    next: 118,
  },
  118: {
    currentPlayerIndex: 3,
    next: 119,
  },

  119: {
    round: 21,
    startingPlayer: 0,
    currentPlayerIndex: 0,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 120,
  },
  120: {
    currentPlayerIndex: 1,
    next: 121,
  },
  121: {
    currentPlayerIndex: 2,
    next: 122,
  },
  122: {
    currentPlayerIndex: 3,
    next: 123,
  },
  123: {
    currentPlayerIndex: 0,
    next: 124,
  },

  124: {
    round: 22,
    startingPlayer: 1,
    currentPlayerIndex: 1,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 125,
  },
  125: {
    currentPlayerIndex: 2,
    next: 126,
  },
  126: {
    currentPlayerIndex: 3,
    next: 127,
  },
  127: {
    currentPlayerIndex: 0,
    next: 128,
  },
  128: {
    currentPlayerIndex: 1,
    next: 129,
  },

  129: {
    round: 23,
    startingPlayer: 2,
    currentPlayerIndex: 2,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 130,
  },
  130: {
    currentPlayerIndex: 3,
    next: 131,
  },
  131: {
    currentPlayerIndex: 0,
    next: 132,
  },
  132: {
    currentPlayerIndex: 1,
    next: 133,
  },
  133: {
    currentPlayerIndex: 2,
    next: 134,
  },

  134: {
    round: 24,
    startingPlayer: 3,
    currentPlayerIndex: 3,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 135,
  },
  135: {
    currentPlayerIndex: 0,
    next: 136,
  },
  136: {
    currentPlayerIndex: 1,
    next: 137,
  },
  137: {
    currentPlayerIndex: 2,
    next: 138,
  },
  138: {
    currentPlayerIndex: 3,
    next: 139,
  },

  139: {
    startingPlayer: 0,
    currentPlayerIndex: 0,
    bonusRoundPlacement: true,
    nextUse: NextUseClergy.OnlyPrior,
    upkeep: [allPriorsComeBack, rotateRondel, returnClergyIfPlaced],
    next: 140,
  },
  140: {
    currentPlayerIndex: 1,
    bonusRoundPlacement: true,
    nextUse: NextUseClergy.OnlyPrior,
    next: 141,
  },
  141: {
    currentPlayerIndex: 2,
    bonusRoundPlacement: true,
    nextUse: NextUseClergy.OnlyPrior,
    next: 142,
  },
  142: {
    currentPlayerIndex: 3,
    bonusRoundPlacement: true,
    nextUse: NextUseClergy.OnlyPrior,
    next: 143,
  },

  // Settlement E
  143: {
    currentPlayerIndex: 0,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    settlementRound: SettlementRound.E,
    next: 144,
  },
  144: {
    currentPlayerIndex: 1,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    next: 145,
  },
  145: {
    currentPlayerIndex: 2,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    next: 146,
  },
  146: {
    currentPlayerIndex: 3,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    next: 147,
  },

  147: {
    upkeep: [gameEnd],
    next: 147,
  },
}

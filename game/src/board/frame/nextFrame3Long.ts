import { Frame, GameCommandEnum, NextUseClergy, SettlementRound, StateReducer } from '../../types'
import { introduceBuildings } from '../buildings'
import { introduceGrapeToken, introduceStoneToken } from '../rondel'
import { introduceSettlements } from '../settlements'
import { gameEnd } from '../state'
import { allPriorsComeBack } from './allPriorsComeBack'
import { returnClergyIfPlaced } from './returnClergyIfPlaced'
import { rotateRondel } from './rotateRondel'
import { standardResources } from './standardResources'

export const nextFrame3Long: Record<
  number,
  {
    upkeep?: StateReducer[]
    next: number
  } & Partial<Frame>
> = {
  // Round 1
  1: {
    startingPlayer: 0,
    currentPlayerIndex: 0,
    settlementRound: SettlementRound.S,
    upkeep: [rotateRondel, introduceBuildings, introduceSettlements, standardResources, returnClergyIfPlaced],
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
  5: {
    startingPlayer: 1,
    currentPlayerIndex: 1,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 6,
  },
  6: {
    currentPlayerIndex: 2,
    next: 7,
  },
  7: {
    currentPlayerIndex: 0,
    next: 8,
  },
  8: {
    currentPlayerIndex: 1,
    next: 9,
  },
  // Round 3
  9: {
    startingPlayer: 2,
    currentPlayerIndex: 2,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 10,
  },
  10: {
    currentPlayerIndex: 0,
    next: 11,
  },
  11: {
    currentPlayerIndex: 1,
    next: 12,
  },
  12: {
    currentPlayerIndex: 2,
    next: 13,
  },
  // Round 4
  13: {
    startingPlayer: 0,
    currentPlayerIndex: 0,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 14,
  },
  14: {
    currentPlayerIndex: 1,
    next: 15,
  },
  15: {
    currentPlayerIndex: 2,
    next: 16,
  },
  16: {
    currentPlayerIndex: 0,
    next: 17,
  },
  // Round 5
  17: {
    startingPlayer: 1,
    currentPlayerIndex: 1,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 18,
  },
  18: {
    currentPlayerIndex: 2,
    next: 19,
  },
  19: {
    currentPlayerIndex: 0,
    next: 20,
  },
  20: {
    currentPlayerIndex: 1,
    next: 21,
  },
  // Settlement A
  21: {
    startingPlayer: 2,
    currentPlayerIndex: 2,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    settlementRound: SettlementRound.A,
    next: 22,
  },
  22: {
    currentPlayerIndex: 0,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    next: 23,
  },
  23: {
    currentPlayerIndex: 1,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    next: 24,
  },
  // Round 6
  24: {
    currentPlayerIndex: 2,
    upkeep: [introduceBuildings, introduceSettlements, rotateRondel, returnClergyIfPlaced],
    next: 25,
  },
  25: {
    currentPlayerIndex: 0,
    next: 26,
  },
  26: {
    currentPlayerIndex: 1,
    next: 27,
  },
  27: {
    currentPlayerIndex: 2,
    next: 28,
  },
  // Round 7
  28: {
    startingPlayer: 0,
    currentPlayerIndex: 0,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 29,
  },
  29: {
    currentPlayerIndex: 1,
    next: 30,
  },
  30: {
    currentPlayerIndex: 2,
    next: 31,
  },
  31: {
    currentPlayerIndex: 0,
    next: 32,
  },
  // Round 8
  32: {
    startingPlayer: 1,
    currentPlayerIndex: 1,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 33,
  },
  33: {
    currentPlayerIndex: 2,
    next: 34,
  },
  34: {
    currentPlayerIndex: 0,
    next: 35,
  },
  35: {
    currentPlayerIndex: 1,
    next: 36,
  },
  // Round 9
  36: {
    startingPlayer: 2,
    currentPlayerIndex: 2,
    upkeep: [introduceGrapeToken, rotateRondel, returnClergyIfPlaced],
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
  39: {
    currentPlayerIndex: 2,
    next: 40,
  },
  // Round 10
  40: {
    startingPlayer: 0,
    currentPlayerIndex: 0,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 41,
  },
  41: {
    currentPlayerIndex: 1,
    next: 42,
  },
  42: {
    currentPlayerIndex: 2,
    next: 43,
  },
  43: {
    currentPlayerIndex: 0,
    next: 44,
  },
  // Settlement B
  44: {
    startingPlayer: 1,
    currentPlayerIndex: 1,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    settlementRound: SettlementRound.B,
    next: 45,
  },
  45: {
    currentPlayerIndex: 2,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    next: 46,
  },
  46: {
    currentPlayerIndex: 0,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    next: 47,
  },
  // Round 11
  47: {
    currentPlayerIndex: 1,
    upkeep: [introduceBuildings, introduceSettlements, rotateRondel, returnClergyIfPlaced],
    next: 48,
  },
  48: {
    currentPlayerIndex: 2,
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
  // Round 12
  51: {
    startingPlayer: 2,
    currentPlayerIndex: 2,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 52,
  },
  52: {
    currentPlayerIndex: 0,
    next: 53,
  },
  53: {
    currentPlayerIndex: 1,
    next: 54,
  },
  54: {
    currentPlayerIndex: 2,
    next: 55,
  },
  // Round 13
  55: {
    startingPlayer: 0,
    currentPlayerIndex: 0,
    upkeep: [introduceStoneToken, rotateRondel, returnClergyIfPlaced],
    next: 56,
  },
  56: {
    currentPlayerIndex: 1,
    next: 57,
  },
  57: {
    currentPlayerIndex: 2,
    next: 58,
  },
  58: {
    currentPlayerIndex: 0,
    next: 59,
  },
  // Round 14
  59: {
    startingPlayer: 1,
    currentPlayerIndex: 1,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 60,
  },
  60: {
    currentPlayerIndex: 2,
    next: 61,
  },
  61: {
    currentPlayerIndex: 0,
    next: 62,
  },
  62: {
    currentPlayerIndex: 1,
    next: 63,
  },
  // Settlement C
  63: {
    startingPlayer: 2,
    currentPlayerIndex: 2,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    settlementRound: SettlementRound.C,
    next: 64,
  },
  64: {
    currentPlayerIndex: 0,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    next: 65,
  },
  65: {
    currentPlayerIndex: 1,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    next: 66,
  },
  // Round 15
  66: {
    currentPlayerIndex: 2,
    upkeep: [introduceBuildings, introduceSettlements, rotateRondel, returnClergyIfPlaced],
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
  // Round 16
  70: {
    startingPlayer: 0,
    currentPlayerIndex: 0,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 71,
  },
  71: {
    currentPlayerIndex: 1,
    next: 72,
  },
  72: {
    currentPlayerIndex: 2,
    next: 73,
  },
  73: {
    currentPlayerIndex: 0,
    next: 74,
  },
  // Round 17
  74: {
    startingPlayer: 1,
    currentPlayerIndex: 1,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 75,
  },
  75: {
    currentPlayerIndex: 2,
    next: 76,
  },
  76: {
    currentPlayerIndex: 0,
    next: 77,
  },
  77: {
    currentPlayerIndex: 1,
    next: 78,
  },
  // Round 18
  78: {
    startingPlayer: 2,
    currentPlayerIndex: 2,
    upkeep: [rotateRondel, returnClergyIfPlaced],
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
    currentPlayerIndex: 2,
    next: 82,
  },
  // Round 19
  82: {
    startingPlayer: 0,
    currentPlayerIndex: 0,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 83,
  },
  83: {
    currentPlayerIndex: 1,
    next: 84,
  },
  84: {
    currentPlayerIndex: 2,
    next: 85,
  },
  85: {
    currentPlayerIndex: 0,
    next: 86,
  },
  // Settlement D
  86: {
    startingPlayer: 1,
    currentPlayerIndex: 1,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    settlementRound: SettlementRound.D,
    next: 87,
  },
  87: {
    currentPlayerIndex: 2,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    next: 88,
  },
  88: {
    currentPlayerIndex: 0,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    next: 89,
  },
  // Round 20
  89: {
    currentPlayerIndex: 1,
    upkeep: [introduceBuildings, introduceSettlements, rotateRondel, returnClergyIfPlaced],
    next: 90,
  },
  90: {
    currentPlayerIndex: 2,
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
  // Round 21
  93: {
    startingPlayer: 2,
    currentPlayerIndex: 2,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 94,
  },
  94: {
    currentPlayerIndex: 0,
    next: 95,
  },
  95: {
    currentPlayerIndex: 1,
    next: 96,
  },
  96: {
    currentPlayerIndex: 2,
    next: 97,
  },
  // Round 22
  97: {
    startingPlayer: 0,
    currentPlayerIndex: 0,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 98,
  },
  98: {
    currentPlayerIndex: 1,
    next: 99,
  },
  99: {
    currentPlayerIndex: 2,
    next: 100,
  },
  100: {
    currentPlayerIndex: 0,
    next: 101,
  },
  // Round 23
  101: {
    startingPlayer: 1,
    currentPlayerIndex: 1,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 102,
  },
  102: {
    currentPlayerIndex: 2,
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
  // Round 24
  105: {
    startingPlayer: 2,
    currentPlayerIndex: 2,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 106,
  },
  106: {
    currentPlayerIndex: 0,
    next: 107,
  },
  107: {
    currentPlayerIndex: 1,
    next: 108,
  },
  108: {
    currentPlayerIndex: 2,
    next: 109,
  },
  109: {
    startingPlayer: 0,
    currentPlayerIndex: 0,
    bonusRoundPlacement: true,
    nextUse: NextUseClergy.OnlyPrior,
    upkeep: [allPriorsComeBack, rotateRondel, returnClergyIfPlaced],
    next: 110,
  },
  110: {
    currentPlayerIndex: 1,
    bonusRoundPlacement: true,
    nextUse: NextUseClergy.OnlyPrior,
    next: 111,
  },
  111: {
    currentPlayerIndex: 2,
    bonusRoundPlacement: true,
    nextUse: NextUseClergy.OnlyPrior,
    next: 112,
  },
  // Settlement E
  112: {
    startingPlayer: 0,
    currentPlayerIndex: 0,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    settlementRound: SettlementRound.E,
    next: 113,
  },
  113: {
    currentPlayerIndex: 1,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    next: 114,
  },
  114: {
    currentPlayerIndex: 2,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    next: 115,
  },
  115: {
    upkeep: [gameEnd],
    next: 115,
  },
}

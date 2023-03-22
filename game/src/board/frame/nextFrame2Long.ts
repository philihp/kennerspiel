import { FrameFlow, GameCommandEnum, SettlementRound } from '../../types'
import { introduceBuildings } from '../buildings'
import { introduceGrapeToken, introduceStoneToken } from '../rondel'
import { introduceSettlements } from '../settlements'
import { gameEnd } from '../state'
import { returnClergyIfPlaced } from './returnClergyIfPlaced'
import { rotateRondel } from './rotateRondel'
import { checkFinalPhase } from './checkFinalPhase'
import { standardResources } from './standardResources'

// 2p long game...
// each round:
// rotate wheel
// starting player has two actions
// other player has one action
// game enters final phase when:
// - D buildings go out AND
// - there are no more than 3 buildings left in display
// finish current round

// each round, starting player gets 2 actions followed by other player getting 1
// each player can build at most 1 landscape every round
// ending when after settlement D, when there are <= 3 buildings in display finish current round

export const nextFrame2Long: FrameFlow = {
  // Round 1
  1: {
    startingPlayer: 0,
    currentPlayerIndex: 0,
    settlementRound: SettlementRound.S,
    upkeep: [rotateRondel, introduceBuildings, introduceSettlements, standardResources, returnClergyIfPlaced],
    next: 2,
  },
  2: {
    currentPlayerIndex: 0,
    next: 3,
  },
  3: {
    currentPlayerIndex: 1,
    next: 4,
  },

  // Round 2
  4: {
    startingPlayer: 1,
    currentPlayerIndex: 1,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 5,
  },
  5: {
    currentPlayerIndex: 1,
    next: 6,
  },
  6: {
    currentPlayerIndex: 0,
    next: 7,
  },

  // Round 3
  7: {
    startingPlayer: 0,
    currentPlayerIndex: 0,
    upkeep: [rotateRondel, returnClergyIfPlaced],
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

  // Round 4
  10: {
    startingPlayer: 1,
    currentPlayerIndex: 1,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 11,
  },
  11: {
    currentPlayerIndex: 1,
    next: 12,
  },
  12: {
    currentPlayerIndex: 0,
    next: 13,
  },

  // Round 5
  13: {
    startingPlayer: 0,
    currentPlayerIndex: 0,
    upkeep: [rotateRondel, returnClergyIfPlaced],
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

  // Round 6
  16: {
    startingPlayer: 1,
    currentPlayerIndex: 1,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 17,
  },
  17: {
    currentPlayerIndex: 1,
    next: 18,
  },
  18: {
    currentPlayerIndex: 0,
    next: 19,
  },

  // SETTLE A
  19: {
    startingPlayer: 0,
    currentPlayerIndex: 0,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    settlementRound: SettlementRound.A,
    next: 20,
  },
  20: {
    currentPlayerIndex: 1,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    next: 21,
  },

  // Round 7
  21: {
    currentPlayerIndex: 0,
    upkeep: [introduceBuildings, introduceSettlements, rotateRondel, returnClergyIfPlaced],
    next: 22,
  },
  22: {
    currentPlayerIndex: 0,
    next: 23,
  },
  23: {
    currentPlayerIndex: 1,
    next: 24,
  },

  // Round 8
  24: {
    startingPlayer: 1,
    currentPlayerIndex: 1,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 25,
  },
  25: {
    currentPlayerIndex: 1,
    next: 26,
  },
  26: {
    currentPlayerIndex: 0,
    next: 27,
  },

  // Round 9
  27: {
    startingPlayer: 0,
    currentPlayerIndex: 0,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 28,
  },
  28: {
    currentPlayerIndex: 0,
    next: 29,
  },
  29: {
    currentPlayerIndex: 1,
    next: 30,
  },

  // Round 10
  30: {
    startingPlayer: 1,
    currentPlayerIndex: 1,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 31,
  },
  31: {
    currentPlayerIndex: 1,
    next: 32,
  },
  32: {
    currentPlayerIndex: 0,
    next: 33,
  },

  // Round 11
  33: {
    startingPlayer: 0,
    currentPlayerIndex: 0,
    upkeep: [rotateRondel, returnClergyIfPlaced, introduceGrapeToken],
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

  // Round 12
  36: {
    startingPlayer: 1,
    currentPlayerIndex: 1,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 37,
  },
  37: {
    currentPlayerIndex: 1,
    next: 38,
  },
  38: {
    currentPlayerIndex: 0,
    next: 39,
  },

  // Round 13
  39: {
    startingPlayer: 0,
    currentPlayerIndex: 0,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 40,
  },
  40: {
    currentPlayerIndex: 0,
    next: 41,
  },
  41: {
    currentPlayerIndex: 1,
    next: 42,
  },

  // Settlement B
  42: {
    startingPlayer: 1,
    currentPlayerIndex: 1,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    settlementRound: SettlementRound.B,
    next: 43,
  },
  43: {
    currentPlayerIndex: 0,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    next: 44,
  },

  // Round 14
  44: {
    currentPlayerIndex: 1,
    upkeep: [introduceBuildings, introduceSettlements, rotateRondel, returnClergyIfPlaced],
    next: 45,
  },
  45: {
    currentPlayerIndex: 1,
    next: 46,
  },
  46: {
    currentPlayerIndex: 0,
    next: 47,
  },

  // Round 15
  47: {
    startingPlayer: 0,
    currentPlayerIndex: 0,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 48,
  },
  48: {
    currentPlayerIndex: 0,
    next: 49,
  },
  49: {
    currentPlayerIndex: 1,
    next: 50,
  },

  // Round 16
  50: {
    startingPlayer: 1,
    currentPlayerIndex: 1,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 51,
  },
  51: {
    currentPlayerIndex: 1,
    next: 52,
  },
  52: {
    currentPlayerIndex: 0,
    next: 53,
  },

  // Round 17
  53: {
    startingPlayer: 0,
    currentPlayerIndex: 0,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 54,
  },
  54: {
    currentPlayerIndex: 0,
    next: 55,
  },
  55: {
    currentPlayerIndex: 1,
    next: 56,
  },

  // Round 18
  56: {
    startingPlayer: 1,
    currentPlayerIndex: 1,
    upkeep: [rotateRondel, returnClergyIfPlaced, introduceStoneToken],
    next: 57,
  },
  57: {
    currentPlayerIndex: 1,
    next: 58,
  },
  58: {
    currentPlayerIndex: 0,
    next: 59,
  },

  // Round 19
  59: {
    startingPlayer: 0,
    currentPlayerIndex: 0,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 60,
  },
  60: {
    currentPlayerIndex: 0,
    next: 61,
  },
  61: {
    currentPlayerIndex: 1,
    next: 62,
  },

  // Round 20
  62: {
    startingPlayer: 1,
    currentPlayerIndex: 1,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 63,
  },
  63: {
    currentPlayerIndex: 1,
    next: 64,
  },
  64: {
    currentPlayerIndex: 0,
    next: 65,
  },

  // Settlement C
  65: {
    startingPlayer: 0,
    currentPlayerIndex: 0,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    settlementRound: SettlementRound.C,
    next: 66,
  },
  66: {
    currentPlayerIndex: 1,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    next: 67,
  },

  // Round 21
  67: {
    currentPlayerIndex: 0,
    upkeep: [introduceBuildings, introduceSettlements, rotateRondel, returnClergyIfPlaced],
    next: 68,
  },
  68: {
    currentPlayerIndex: 0,
    next: 69,
  },
  69: {
    currentPlayerIndex: 1,
    next: 70,
  },

  // Round 22
  70: {
    startingPlayer: 1,
    currentPlayerIndex: 1,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 71,
  },
  71: {
    currentPlayerIndex: 1,
    next: 72,
  },
  72: {
    currentPlayerIndex: 0,
    next: 73,
  },

  // Round 23
  73: {
    startingPlayer: 0,
    currentPlayerIndex: 0,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 74,
  },
  74: {
    currentPlayerIndex: 0,
    next: 75,
  },
  75: {
    currentPlayerIndex: 1,
    next: 76,
  },

  // Round 24
  76: {
    startingPlayer: 1,
    currentPlayerIndex: 1,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 77,
  },
  77: {
    currentPlayerIndex: 1,
    next: 78,
  },
  78: {
    currentPlayerIndex: 0,
    next: 79,
  },

  // Round 25
  79: {
    startingPlayer: 0,
    currentPlayerIndex: 0,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 80,
  },
  80: {
    currentPlayerIndex: 0,
    next: 81,
  },
  81: {
    currentPlayerIndex: 1,
    next: 82,
  },

  // Round 26
  82: {
    startingPlayer: 1,
    currentPlayerIndex: 1,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 83,
  },
  83: {
    currentPlayerIndex: 1,
    next: 84,
  },
  84: {
    currentPlayerIndex: 0,
    next: 85,
  },

  // Round 27
  85: {
    startingPlayer: 0,
    currentPlayerIndex: 0,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 86,
  },
  86: {
    currentPlayerIndex: 0,
    next: 87,
  },
  87: {
    currentPlayerIndex: 1,
    next: 88,
  },

  // Settlement D
  88: {
    startingPlayer: 1,
    currentPlayerIndex: 1,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    settlementRound: SettlementRound.D,
    next: 89,
  },
  89: {
    currentPlayerIndex: 0,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    next: 90,
  },

  // Round 28
  // This is identical to step 200, except we don't want to keep introducing
  // the buildings. Hypothetically we could check for end-game here, but there's
  // no way there is <= 1 unbuilt building.
  90: {
    currentPlayerIndex: 1,
    upkeep: [introduceBuildings, introduceSettlements, rotateRondel, returnClergyIfPlaced],
    next: 91,
  },
  91: {
    currentPlayerIndex: 1,
    next: 92,
  },
  92: {
    currentPlayerIndex: 0,
    next: 97,
  },

  97: {
    startingPlayer: 0,
    currentPlayerIndex: 0,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 98,
  },
  98: {
    currentPlayerIndex: 0,
    next: 99,
  },
  99: {
    currentPlayerIndex: 1,
    upkeep: [checkFinalPhase(100)],
    next: 103,
  },
  100: {
    upkeep: [gameEnd],
    next: 100,
  },
  101: {
    currentPlayerIndex: 0,
    upkeep: [checkFinalPhase(100)],
    next: 97,
  },
  102: {
    currentPlayerIndex: 1,
    next: 101,
  },
  103: {
    startingPlayer: 1,
    currentPlayerIndex: 1,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 102,
  },
}

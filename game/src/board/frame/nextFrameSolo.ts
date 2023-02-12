import { FrameFlow, GameCommandEnum, SettlementRound } from '../../types'
import { gameEnd } from './gameEnd'
import { introduceBuildings } from './introduceBuildings'
import { returnClergyIfPlaced } from './returnClergyIfPlaced'
import { rotateRondelWithExpire } from './rotateRondel'

// TODO: joker comes out in A space

// Each round:
// Return all clergymen if all placed
// - Rotate wheel
// => If it's a settlement (A-D)...
// --> Neutral player builds all remaining buildings (overbuild allowed)
// --> Optionally if neutral prior free, place the prior, pay work contract, and take that action
// --> Return all clergymen if all placed
// --> Player does a settlement
// - Player gets 2 actions
// => IF it's settlement E...
// --> Neutral player builds all remaining buildings (overbuild allowed)
// --> Optionally if neutral prior free, place the prior, pay work contract, and take that action
// --> Return all clergymen if all placed
// --> Player does a settlement

export const nextFrameSolo: FrameFlow = {
  // Round 1
  1: {
    startingPlayer: 0,
    currentPlayerIndex: 0,
    settlementRound: SettlementRound.S,
    upkeep: [rotateRondelWithExpire, returnClergyIfPlaced, introduceBuildings],
    next: 2,
  },
  2: { next: 3 },

  // Round 2
  3: {
    upkeep: [rotateRondelWithExpire, returnClergyIfPlaced],
    next: 4,
  },
  4: {
    next: 5,
  },

  // Round 3
  5: {
    upkeep: [rotateRondelWithExpire, returnClergyIfPlaced],
    next: 6,
  },
  6: {
    next: 7,
  },

  // Round 4
  7: {
    upkeep: [rotateRondelWithExpire, returnClergyIfPlaced],
    next: 8,
  },
  8: {
    next: 9,
  },

  // Round 5
  9: {
    upkeep: [rotateRondelWithExpire, returnClergyIfPlaced],
    next: 10,
  },
  10: {
    next: 11,
  },

  // Round 6
  11: {
    upkeep: [rotateRondelWithExpire, returnClergyIfPlaced],
    next: 12,
  },
  12: {
    next: 13,
  },

  // Round 7
  13: {
    upkeep: [rotateRondelWithExpire, returnClergyIfPlaced],
    next: 14,
  },
  14: {
    next: 15,
  },

  // Round 8
  15: {
    upkeep: [rotateRondelWithExpire, returnClergyIfPlaced],
    next: 16,
  },
  16: {
    next: 17,
  },

  // Round 9
  17: {
    upkeep: [rotateRondelWithExpire, returnClergyIfPlaced],
    next: 18,
  },
  18: {
    next: 19,
  },

  // Round 10
  19: {
    upkeep: [rotateRondelWithExpire, returnClergyIfPlaced],
    next: 20,
  },
  20: {
    next: 21,
  },

  // Round 11
  21: {
    upkeep: [rotateRondelWithExpire, returnClergyIfPlaced],
    next: 22,
  },
  22: {
    next: 23,
  },

  // Settlement A
  23: {
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    settlementRound: SettlementRound.A,
    next: 24,
  },

  // Round 12
  24: {
    upkeep: [rotateRondelWithExpire, returnClergyIfPlaced, introduceBuildings],
    next: 25,
  },
  25: {
    next: 26,
  },

  // Round 13
  26: {
    upkeep: [rotateRondelWithExpire, returnClergyIfPlaced],
    next: 27,
  },
  27: {
    next: 28,
  },

  // Round 14
  28: {
    upkeep: [rotateRondelWithExpire, returnClergyIfPlaced],
    next: 29,
  },
  29: {
    next: 30,
  },

  // Round 15
  30: {
    upkeep: [rotateRondelWithExpire, returnClergyIfPlaced],
    next: 31,
  },
  31: {
    next: 32,
  },

  // Settlement B
  32: {
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    settlementRound: SettlementRound.B,
    next: 33,
  },

  // Round 16
  33: {
    upkeep: [rotateRondelWithExpire, returnClergyIfPlaced, introduceBuildings],
    next: 34,
  },
  34: {
    next: 35,
  },

  // Round 17
  35: {
    upkeep: [rotateRondelWithExpire, returnClergyIfPlaced],
    next: 36,
  },
  36: {
    next: 37,
  },

  // Round 18
  37: {
    upkeep: [rotateRondelWithExpire, returnClergyIfPlaced],
    next: 38,
  },
  38: {
    next: 39,
  },

  // Round 19
  39: {
    upkeep: [rotateRondelWithExpire, returnClergyIfPlaced],
    next: 40,
  },
  40: {
    next: 41,
  },

  // Round 20
  41: {
    upkeep: [rotateRondelWithExpire, returnClergyIfPlaced],
    next: 42,
  },
  42: {
    next: 43,
  },

  // Round 21
  43: {
    upkeep: [rotateRondelWithExpire, returnClergyIfPlaced],
    next: 44,
  },
  44: {
    next: 45,
  },

  // Settlement C
  45: {
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    settlementRound: SettlementRound.C,
    next: 46,
  },

  // Round 22
  46: {
    upkeep: [rotateRondelWithExpire, returnClergyIfPlaced, introduceBuildings],
    next: 47,
  },
  47: {
    next: 48,
  },

  // Round 23
  48: {
    upkeep: [rotateRondelWithExpire, returnClergyIfPlaced],
    next: 49,
  },
  49: {
    next: 50,
  },

  // Round 24
  50: {
    upkeep: [rotateRondelWithExpire, returnClergyIfPlaced],
    next: 51,
  },
  51: {
    next: 52,
  },

  // Round 24
  52: {
    upkeep: [rotateRondelWithExpire, returnClergyIfPlaced],
    next: 53,
  },
  53: {
    next: 54,
  },

  // Settlement D
  54: {
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    settlementRound: SettlementRound.D,
    next: 55,
  },

  // Round 25
  55: {
    upkeep: [rotateRondelWithExpire, returnClergyIfPlaced, introduceBuildings],
    next: 56,
  },
  56: {
    next: 57,
  },

  // Round 26
  57: {
    upkeep: [rotateRondelWithExpire, returnClergyIfPlaced],
    next: 58,
  },
  58: {
    next: 59,
  },

  // Round 27
  59: {
    upkeep: [rotateRondelWithExpire, returnClergyIfPlaced],
    next: 60,
  },
  60: {
    next: 61,
  },

  // Round 28
  61: {
    upkeep: [rotateRondelWithExpire, returnClergyIfPlaced],
    next: 62,
  },
  62: {
    next: 63,
  },

  // Round 29
  63: {
    upkeep: [rotateRondelWithExpire, returnClergyIfPlaced],
    next: 64,
  },
  64: {
    next: 65,
  },

  // Round 30
  65: {
    upkeep: [rotateRondelWithExpire, returnClergyIfPlaced],
    next: 66,
  },
  66: {
    next: 67,
  },

  67: {
    upkeep: [gameEnd],
    next: 67,
  },
}

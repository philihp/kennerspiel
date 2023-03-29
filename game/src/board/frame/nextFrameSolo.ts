import { FrameFlow, GameCommandEnum, SettlementRound } from '../../types'
import { introduceBuildings } from '../buildings'
import { addNeutralPlayer } from './addNeutralPlayer'
import { gameEnd } from '../state'
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
  1: {
    round: 1,
    startingPlayer: 0,
    currentPlayerIndex: 0,
    settlementRound: SettlementRound.S,
    upkeep: [rotateRondelWithExpire, returnClergyIfPlaced, introduceBuildings, addNeutralPlayer],
    next: 2,
  },
  2: { next: 3 },

  3: {
    round: 2,
    upkeep: [rotateRondelWithExpire, returnClergyIfPlaced],
    next: 4,
  },
  4: {
    next: 5,
  },

  5: {
    round: 3,
    upkeep: [rotateRondelWithExpire, returnClergyIfPlaced],
    next: 6,
  },
  6: {
    next: 7,
  },

  7: {
    round: 4,
    upkeep: [rotateRondelWithExpire, returnClergyIfPlaced],
    next: 8,
  },
  8: {
    next: 9,
  },

  9: {
    round: 5,
    upkeep: [rotateRondelWithExpire, returnClergyIfPlaced],
    next: 10,
  },
  10: {
    next: 11,
  },

  11: {
    round: 6,
    upkeep: [rotateRondelWithExpire, returnClergyIfPlaced],
    next: 12,
  },
  12: {
    next: 13,
  },

  13: {
    round: 7,
    upkeep: [rotateRondelWithExpire, returnClergyIfPlaced],
    next: 14,
  },
  14: {
    next: 15,
  },

  15: {
    round: 8,
    upkeep: [rotateRondelWithExpire, returnClergyIfPlaced],
    next: 16,
  },
  16: {
    next: 17,
  },

  17: {
    round: 9,
    upkeep: [rotateRondelWithExpire, returnClergyIfPlaced],
    next: 18,
  },
  18: {
    next: 19,
  },

  19: {
    round: 10,
    upkeep: [rotateRondelWithExpire, returnClergyIfPlaced],
    next: 20,
  },
  20: {
    next: 21,
  },

  21: {
    round: 11,
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

  24: {
    round: 12,
    upkeep: [rotateRondelWithExpire, returnClergyIfPlaced, introduceBuildings],
    next: 25,
  },
  25: {
    next: 26,
  },

  26: {
    round: 13,
    upkeep: [rotateRondelWithExpire, returnClergyIfPlaced],
    next: 27,
  },
  27: {
    next: 28,
  },

  28: {
    round: 14,
    upkeep: [rotateRondelWithExpire, returnClergyIfPlaced],
    next: 29,
  },
  29: {
    next: 30,
  },

  30: {
    round: 15,
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

  33: {
    round: 16,
    upkeep: [rotateRondelWithExpire, returnClergyIfPlaced, introduceBuildings],
    next: 34,
  },
  34: {
    next: 35,
  },

  35: {
    round: 17,
    upkeep: [rotateRondelWithExpire, returnClergyIfPlaced],
    next: 36,
  },
  36: {
    next: 37,
  },

  37: {
    round: 18,
    upkeep: [rotateRondelWithExpire, returnClergyIfPlaced],
    next: 38,
  },
  38: {
    next: 39,
  },

  39: {
    round: 19,
    upkeep: [rotateRondelWithExpire, returnClergyIfPlaced],
    next: 40,
  },
  40: {
    next: 41,
  },

  41: {
    round: 20,
    upkeep: [rotateRondelWithExpire, returnClergyIfPlaced],
    next: 42,
  },
  42: {
    next: 43,
  },

  43: {
    round: 21,
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

  46: {
    round: 22,
    upkeep: [rotateRondelWithExpire, returnClergyIfPlaced, introduceBuildings],
    next: 47,
  },
  47: {
    next: 48,
  },

  48: {
    round: 23,
    upkeep: [rotateRondelWithExpire, returnClergyIfPlaced],
    next: 49,
  },
  49: {
    next: 50,
  },

  50: {
    round: 24,
    upkeep: [rotateRondelWithExpire, returnClergyIfPlaced],
    next: 51,
  },
  51: {
    next: 52,
  },

  52: {
    round: 24,
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

  55: {
    round: 25,
    upkeep: [rotateRondelWithExpire, returnClergyIfPlaced, introduceBuildings],
    next: 56,
  },
  56: {
    next: 57,
  },

  57: {
    round: 26,
    upkeep: [rotateRondelWithExpire, returnClergyIfPlaced],
    next: 58,
  },
  58: {
    next: 59,
  },

  59: {
    round: 27,
    upkeep: [rotateRondelWithExpire, returnClergyIfPlaced],
    next: 60,
  },
  60: {
    next: 61,
  },

  61: {
    round: 28,
    upkeep: [rotateRondelWithExpire, returnClergyIfPlaced],
    next: 62,
  },
  62: {
    next: 63,
  },

  63: {
    round: 29,
    upkeep: [rotateRondelWithExpire, returnClergyIfPlaced],
    next: 64,
  },
  64: {
    next: 65,
  },

  65: {
    round: 30,
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

import { Frame, FrameFlow, GameCommandEnum, SettlementRound, StateReducer } from '../../types'
import { introduceBuildings } from '../buildings'
import { introduceGrapeToken, introduceStoneToken } from '../rondel'
import { introduceSettlements } from '../settlements'
import { gameEnd } from '../state'
import { returnClergyIfPlaced } from './returnClergyIfPlaced'
import { rotateRondel } from './rotateRondel'
import { checkFinalPhase } from './checkFinalPhase'
import { standardResources } from './standardResources'

// 2p short game...
// alternate turns:
// - push wheel
// --- grapes at round 11 (france)
// --- stone at round 18
// - return clergymen (both players)
// - potentially settlement round
// - take two actions
// - buy a landscape once per "turn" and once per settlement
// no bonus round
// no fixed end; final phase when:
// - D buildings go out AND
// - there is at most 1 building left in display
// play current turn through to the end
// then rotate the production wheel
// other player gets 1 final action

// Two players take turns.
// - Rotate the wheel
// --- If it's a settlement, then do settlement
// --- Reset has player bought landscape
// --- Do a settlement
// - Reset has player obught a settlement
// - Active player gets 2 actions
// Clergy return for both players at the end of each turn
// ending when after settlement D, when there are <= 1 buildings in display. Finish current turn and other player gets 1 final action.

export const nextFrame2Short: FrameFlow = {
  // Round 1
  1: {
    startingPlayer: 0,
    currentPlayerIndex: 0,
    settlementRound: SettlementRound.S,
    upkeep: [rotateRondel, introduceBuildings, introduceSettlements, standardResources, returnClergyIfPlaced],
    next: 2,
  },
  2: {
    next: 3,
  },

  // Round 2
  3: {
    startingPlayer: 1,
    currentPlayerIndex: 1,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 4,
  },
  4: {
    next: 5,
  },

  // Round 3
  5: {
    startingPlayer: 0,
    currentPlayerIndex: 0,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 6,
  },
  6: {
    next: 7,
  },

  // Round 4
  7: {
    startingPlayer: 1,
    currentPlayerIndex: 1,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 8,
  },
  8: {
    next: 9,
  },

  // Round 5
  9: {
    startingPlayer: 0,
    currentPlayerIndex: 0,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 10,
  },
  10: {
    next: 11,
  },

  // Round 6
  11: {
    startingPlayer: 1,
    currentPlayerIndex: 1,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 12,
  },
  12: {
    next: 13,
  },

  // Settlement A
  13: {
    startingPlayer: 0,
    currentPlayerIndex: 0,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    settlementRound: SettlementRound.A,
    next: 14,
  },
  14: {
    currentPlayerIndex: 1,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    next: 15,
  },

  // Round 7
  15: {
    currentPlayerIndex: 0,
    upkeep: [introduceBuildings, introduceSettlements, rotateRondel, returnClergyIfPlaced],
    next: 16,
  },
  16: {
    next: 17,
  },

  // Round 8
  17: {
    startingPlayer: 1,
    currentPlayerIndex: 1,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 18,
  },
  18: {
    next: 19,
  },

  // Round 9
  19: {
    startingPlayer: 0,
    currentPlayerIndex: 0,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 20,
  },
  20: {
    next: 21,
  },

  // Round 10
  25: {
    startingPlayer: 1,
    currentPlayerIndex: 1,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 26,
  },
  26: {
    next: 27,
  },

  // Round 11
  27: {
    startingPlayer: 0,
    currentPlayerIndex: 0,
    upkeep: [rotateRondel, returnClergyIfPlaced, introduceGrapeToken],
    next: 28,
  },
  28: {
    next: 29,
  },

  // Round 12
  29: {
    startingPlayer: 1,
    currentPlayerIndex: 1,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 30,
  },
  30: {
    next: 31,
  },

  // Round 13
  31: {
    startingPlayer: 0,
    currentPlayerIndex: 0,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 32,
  },
  32: {
    next: 33,
  },

  // Settlement B
  33: {
    startingPlayer: 1,
    currentPlayerIndex: 1,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    settlementRound: SettlementRound.B,
    next: 34,
  },
  34: {
    currentPlayerIndex: 0,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    next: 35,
  },

  // Round 14
  35: {
    currentPlayerIndex: 1,
    upkeep: [introduceBuildings, introduceSettlements, rotateRondel, returnClergyIfPlaced],
    next: 36,
  },
  36: {
    next: 37,
  },

  // Round 15
  37: {
    startingPlayer: 0,
    currentPlayerIndex: 0,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 38,
  },
  38: {
    next: 39,
  },

  // Round 16
  39: {
    startingPlayer: 1,
    currentPlayerIndex: 1,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 40,
  },
  40: {
    next: 41,
  },

  // Round 17
  41: {
    startingPlayer: 0,
    currentPlayerIndex: 0,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 42,
  },
  42: {
    next: 43,
  },

  // Round 18
  43: {
    startingPlayer: 1,
    currentPlayerIndex: 1,
    upkeep: [rotateRondel, returnClergyIfPlaced, introduceStoneToken],
    next: 44,
  },
  44: {
    next: 45,
  },

  // Round 19
  45: {
    startingPlayer: 0,
    currentPlayerIndex: 0,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 46,
  },
  46: {
    next: 47,
  },

  // Round 20
  47: {
    startingPlayer: 1,
    currentPlayerIndex: 1,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 48,
  },
  48: {
    next: 49,
  },

  // Settlement C
  49: {
    startingPlayer: 0,
    currentPlayerIndex: 0,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    settlementRound: SettlementRound.C,
    next: 50,
  },
  50: {
    currentPlayerIndex: 1,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    next: 51,
  },

  // Round 21
  51: {
    currentPlayerIndex: 0,
    upkeep: [introduceBuildings, introduceSettlements, rotateRondel, returnClergyIfPlaced],
    next: 52,
  },
  52: {
    next: 53,
  },

  // Round 22
  53: {
    startingPlayer: 1,
    currentPlayerIndex: 1,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 54,
  },
  54: {
    next: 55,
  },

  // Round 23
  55: {
    startingPlayer: 0,
    currentPlayerIndex: 0,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 56,
  },
  56: {
    next: 57,
  },

  // Round 24
  57: {
    startingPlayer: 1,
    currentPlayerIndex: 1,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 58,
  },
  58: {
    next: 59,
  },

  // Round 25
  59: {
    startingPlayer: 0,
    currentPlayerIndex: 0,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 60,
  },
  60: {
    next: 61,
  },

  // Round 26
  61: {
    startingPlayer: 1,
    currentPlayerIndex: 1,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 62,
  },
  62: {
    next: 63,
  },

  // Round 27
  63: {
    startingPlayer: 0,
    currentPlayerIndex: 0,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 64,
  },
  64: {
    next: 65,
  },

  // Settlement D
  65: {
    startingPlayer: 1,
    currentPlayerIndex: 1,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    settlementRound: SettlementRound.D,
    next: 66,
  },
  66: {
    currentPlayerIndex: 0,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    next: 67,
  },

  // Round 28
  67: {
    currentPlayerIndex: 1,
    upkeep: [introduceBuildings, introduceSettlements, rotateRondel, returnClergyIfPlaced],
    next: 68,
  },
  68: {
    next: 100,
  },

  100: {
    startingPlayer: 0,
    currentPlayerIndex: 0,
    next: 101,
    upkeep: [rotateRondel, returnClergyIfPlaced, checkFinalPhase(999)],
  },
  101: {
    currentPlayerIndex: 0,
    next: 200,
  },
  200: {
    startingPlayer: 1,
    currentPlayerIndex: 1,
    next: 201,
    upkeep: [rotateRondel, returnClergyIfPlaced, checkFinalPhase(999)],
  },
  201: {
    currentPlayerIndex: 1,
    next: 100,
  },
  999: {
    next: 999,
    upkeep: [gameEnd],
  },
}

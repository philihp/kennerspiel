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
    currentPlayerIndex: 0,
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
    currentPlayerIndex: 1,
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
    currentPlayerIndex: 0,
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
    currentPlayerIndex: 1,
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
    currentPlayerIndex: 0,
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
    currentPlayerIndex: 1,
    next: 13,
  },

  // Round 7
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

  // Round 8
  15: {
    startingPlayer: 1,
    currentPlayerIndex: 1,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 16,
  },
  16: {
    currentPlayerIndex: 1,
    next: 17,
  },

  // Round 9
  17: {
    startingPlayer: 0,
    currentPlayerIndex: 0,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 18,
  },
  18: {
    currentPlayerIndex: 0,
    next: 19,
  },

  // Round 10
  19: {
    startingPlayer: 1,
    currentPlayerIndex: 1,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 20,
  },
  20: {
    currentPlayerIndex: 1,
    next: 21,
  },

  // Settlement A
  // TODO: confirm that settlement A is before round 11, not after
  21: {
    startingPlayer: 0,
    currentPlayerIndex: 0,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    settlementRound: SettlementRound.A,
    next: 22,
  },
  22: {
    currentPlayerIndex: 1,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    next: 23,
  },

  // Round 11
  23: {
    currentPlayerIndex: 0,
    upkeep: [introduceBuildings, introduceSettlements, rotateRondel, returnClergyIfPlaced, introduceGrapeToken],
    next: 24,
  },
  24: {
    currentPlayerIndex: 0,
    next: 25,
  },

  // Round 12
  25: {
    startingPlayer: 1,
    currentPlayerIndex: 1,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 26,
  },
  26: {
    currentPlayerIndex: 1,
    next: 27,
  },

  // Round 13
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

  // Round 14
  29: {
    startingPlayer: 1,
    currentPlayerIndex: 1,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 30,
  },
  30: {
    currentPlayerIndex: 1,
    next: 31,
  },

  // Settlement B
  // TODO: confirm that settlement B is before round 15, not after
  31: {
    startingPlayer: 0,
    currentPlayerIndex: 0,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    settlementRound: SettlementRound.B,
    next: 32,
  },
  32: {
    currentPlayerIndex: 1,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    next: 33,
  },

  // Round 15
  33: {
    currentPlayerIndex: 0,
    upkeep: [introduceBuildings, introduceSettlements, rotateRondel, returnClergyIfPlaced],
    next: 34,
  },
  34: {
    currentPlayerIndex: 0,
    next: 35,
  },

  // Round 16
  35: {
    startingPlayer: 1,
    currentPlayerIndex: 1,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 36,
  },
  36: {
    currentPlayerIndex: 1,
    next: 37,
  },

  // Round 17
  37: {
    startingPlayer: 0,
    currentPlayerIndex: 0,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 38,
  },
  38: {
    currentPlayerIndex: 0,
    next: 39,
  },

  // Round 18
  39: {
    startingPlayer: 1,
    currentPlayerIndex: 1,
    upkeep: [rotateRondel, returnClergyIfPlaced, introduceStoneToken],
    next: 40,
  },
  40: {
    currentPlayerIndex: 1,
    next: 41,
  },

  // Round 19
  41: {
    startingPlayer: 0,
    currentPlayerIndex: 0,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 42,
  },
  42: {
    currentPlayerIndex: 0,
    next: 43,
  },

  // Round 20
  43: {
    startingPlayer: 1,
    currentPlayerIndex: 1,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 44,
  },
  44: {
    currentPlayerIndex: 1,
    next: 45,
  },

  // Settlement C
  // TODO: confirm that settlement C is before round 21, not after
  45: {
    startingPlayer: 0,
    currentPlayerIndex: 0,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    settlementRound: SettlementRound.C,
    next: 46,
  },
  46: {
    currentPlayerIndex: 1,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    next: 47,
  },

  // Round 21
  47: {
    currentPlayerIndex: 0,
    upkeep: [introduceBuildings, introduceSettlements, rotateRondel, returnClergyIfPlaced],
    next: 48,
  },
  48: {
    currentPlayerIndex: 0,
    next: 49,
  },

  // Round 22
  49: {
    startingPlayer: 1,
    currentPlayerIndex: 1,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 50,
  },
  50: {
    currentPlayerIndex: 1,
    next: 51,
  },

  // Round 23
  51: {
    startingPlayer: 0,
    currentPlayerIndex: 0,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 52,
  },
  52: {
    currentPlayerIndex: 0,
    next: 53,
  },

  // Round 24
  53: {
    startingPlayer: 1,
    currentPlayerIndex: 1,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 54,
  },
  54: {
    currentPlayerIndex: 1,
    next: 55,
  },

  // Settlement D
  // TODO: confirm that settlement D is before round 25, not after
  55: {
    startingPlayer: 0,
    currentPlayerIndex: 0,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    settlementRound: SettlementRound.D,
    next: 56,
  },
  56: {
    currentPlayerIndex: 1,
    mainActionUsed: true,
    bonusActions: [GameCommandEnum.SETTLE],
    next: 57,
  },

  // Round 25
  // This is identical to step 200, except we don't want to keep introducing
  // the buildings. Hypothetically we could check for end-game here, but there's
  // no way there is <= 1 unbuilt building.
  57: {
    currentPlayerIndex: 0,
    startingPlayer: 0,
    upkeep: [introduceBuildings, introduceSettlements, rotateRondel, returnClergyIfPlaced],
    next: 58,
  },
  58: {
    currentPlayerIndex: 0,
    next: 100,
  },

  //   58-.
  //      |
  //      v
  // .-> 100 -> 101
  //  \          |
  //   \         v
  //    \        ?--> 102
  //     +---<---|     |--> 999 (end)
  //    /        ?--> 202
  //   /         ^
  //  /          |
  // '-> 200 -> 201

  100: {
    startingPlayer: 1,
    currentPlayerIndex: 1,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 101,
  },
  101: {
    currentPlayerIndex: 1,
    next: 200,
    upkeep: [checkFinalPhase(102)],
  },
  102: {
    currentPlayerIndex: 0,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 999,
  },
  999: {
    upkeep: [gameEnd],
    next: 999,
  },
  202: {
    currentPlayerIndex: 1,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 999,
  },
  201: {
    currentPlayerIndex: 0,
    next: 200,
    upkeep: [checkFinalPhase(202)],
  },
  200: {
    startingPlayer: 0,
    currentPlayerIndex: 0,
    upkeep: [rotateRondel, returnClergyIfPlaced],
    next: 201,
  },
}

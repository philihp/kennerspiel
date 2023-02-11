import { pipe, tap } from 'ramda'
import { match, P } from 'ts-pattern'
import { Frame, FrameFlow, GameStatePlaying, NextUseClergy, PlayerColor, StateReducer, Tableau } from '../types'
import { nextFrame4Long } from './frame/nextFrame4Long'
import { nextFrame3Long } from './frame/nextFrame3Long'

export const withFrame =
  (func: (frame: Frame | undefined) => Frame | undefined) =>
  (state: GameStatePlaying | undefined): GameStatePlaying | undefined => {
    if (state === undefined) return state
    const frame = func(state.frame)
    if (frame === undefined) return undefined
    return {
      ...state,
      frame,
    }
  }

const standardProgression =
  (withFlow: FrameFlow): StateReducer =>
  (state) => {
    const nextFrameIndex = state?.frame.next
    if (nextFrameIndex === undefined) return undefined
    const { upkeep = [], ...frameUpdates } = withFlow[nextFrameIndex] ?? {}
    return pipe(
      // first, with all of the properties on the new frame, overlay them on the current frame
      withFrame((frame) => {
        const newFrame = {
          ...frame,
          activePlayerIndex: frameUpdates.currentPlayerIndex,
          mainActionUsed: false,
          bonusActions: [],
          canBuyLandscape: true,
          unusableBuildings: [],
          usableBuildings: [],
          nextUse: NextUseClergy.Any,
          ...frameUpdates,
        } as Frame
        return newFrame
      }),
      // and then if there are any upkeep reducer functions on the frame, run them
      (state) => upkeep.reduce((accum: GameStatePlaying | undefined, f) => f(accum), state)
    )(state)
  }

// 12 rounds plus a bonus round
// Settlement at start of rounds 3, 5, 7, 9
// Grapes enters in round 4
// Stone enters in round 6
// Start of round... each player gets...
// 01 sheep grain
// 02 clay grain
// 03 wood grain
// 04 stone grain
// 05 stone peat
// 06 stone clay
// 07 stone wood
// 08 stone nickel
// 09 stone meat
// 10 book grain
// 11 pottery clay
// 12 ornament wood
// 13 bonus round, same in longer game
const nextFrameShortStandard: StateReducer = (state) => {
  return state
}

// each round, starting player gets 2 actions followed by other player getting 1
// each player can build at most 1 landscape every round
// ending when after settlement D, when there are <= 3 buildings in display finish current round
const nextFrameLongTwoPlayer: StateReducer = (state) => {
  return state
}

// Two players take turns.
// - Rotate the wheel
// --- If it's a settlement, then do settlement
// --- Reset has player bought landscape
// --- Do a settlement
// - Reset has player obught a settlement
// - Active player gets 2 actions
// Clergy return for both players at the end of each turn
// ending when after settlement D, when there are <= 1 buildings in display. Finish current turn and other player gets 1 final action.
const nextFrameShortTwoPlayer: StateReducer = (state) => {
  return state
}

// Grapes never enters rondel
// Stone never enters rondel
// Tokens pushed past 10 are removed
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
const nextFrameSolitaire: StateReducer = (state) => {
  return state
}

export const nextFrame: StateReducer = (state) =>
  match(state)
    .with({ config: { players: 3, length: 'long' } }, standardProgression(nextFrame3Long))
    .with({ config: { players: 4, length: 'long' } }, standardProgression(nextFrame4Long))
    .with({ config: { players: P.union(3, 4), length: 'short' } }, nextFrameShortStandard)
    .with({ config: { players: 2, length: 'long' } }, nextFrameLongTwoPlayer)
    .with({ config: { players: 2, length: 'short' } }, nextFrameShortTwoPlayer)
    .with({ config: { players: 1 } }, nextFrameSolitaire)
    .otherwise(() => undefined)

// ===================================================
// notes that i thought i had lost...

// for each player, return clergy if all are placed
// rotate production wheel
// - anything at max 10 gets pushed with it
// - optionally add the grapes (round 8, france) onto zero space
// - optionally add the stone (round 13) onto zero space
// if arm crosses a house, do settlement phase
// - move the building marker
// - starting with starting player,
// - each player may build 1 settlement
// - each player may buy at most 1 landscape
// - then distribute new settlements
// - then add new phase's buildings
// if the arm crosses settlement E, it's now extra round
// - each player takes prior back
// - each player can either build or place prior onto any built building of their choice
// otherwise start the round
// - each player gets one action
// - starting player then gets one action
// - end of round, starting player passes to next player who starts next round

// short has only 1 prior and 1 lay brother
// short has only 12 rounds
// short has different set of buildings
// short production produces an additional for everyone

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

// 2p long game...
// each round:
// rotate wheel
// starting player has two actions
// other player has one action
// game enters final phase when:
// - D buildings go out AND
// - there are no more than 3 buildings left in display
// finish current round

// 1p game...
// joker comes out in A space
// each round:
// rotate wheel (items that go past 10 get removed)
// at start of each turn, also check to see if the neutral player gets people back

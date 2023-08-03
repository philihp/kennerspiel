import { assoc, equals, findIndex, lensProp, map, pipe, reduce, remove, set } from 'ramda'
import { match } from 'ts-pattern'
import { nextFrame4Long } from './frame/nextFrame4Long'
import { nextFrame3Long } from './frame/nextFrame3Long'
import { nextFrameSolo } from './frame/nextFrameSolo'
import { nextFrame3Short } from './frame/nextFrame3Short'
import { nextFrame4Short } from './frame/nextFrame4Short'
import { nextFrame2Long } from './frame/nextFrame2Long'
import { nextFrame2Short } from './frame/nextFrame2Short'
import {
  BuildingEnum,
  Frame,
  FrameFlow,
  GameCommandConfigParams,
  GameCommandEnum,
  GameStatePlaying,
  NextUseClergy,
  StateReducer,
  Tile,
} from '../types'
import { LANDSCAPES, findBuildingWithoutOffset, getAdjacentOffsets, occupiedBuildingsForPlayers } from './landscape'
import { isSettlement } from './buildings'

export const withFrame =
  (func: (frame: Frame) => Frame | undefined): StateReducer =>
  (state) => {
    if (state === undefined) return state
    const frame = func(state.frame)
    if (frame === undefined) return undefined
    return {
      ...state,
      frame,
    }
  }

export const addBonusAction = (command: GameCommandEnum) =>
  withFrame((frame) => ({
    ...frame,
    bonusActions: [...frame.bonusActions, command],
  }))

const runProgression =
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
          activePlayerIndex: frameUpdates.currentPlayerIndex ?? frame?.activePlayerIndex,
          mainActionUsed: false,
          bonusActions: [],
          canBuyLandscape: true,
          unusableBuildings: [],
          usableBuildings: [],
          nextUse: NextUseClergy.Any,
          neutralBuildingPhase: false,
          ...frameUpdates,
        } as Frame
        return newFrame
      }),
      // and then if there are any upkeep reducer functions on the frame, run them
      (state) => {
        return upkeep.reduce((accum: GameStatePlaying | undefined, f) => f(accum), state)
      }
    )(state)
  }

export const pickFrameFlow = (config: GameCommandConfigParams): FrameFlow =>
  match<GameCommandConfigParams, FrameFlow>(config)
    .with({ players: 3, length: 'long' }, () => nextFrame3Long)
    .with({ players: 4, length: 'long' }, () => nextFrame4Long)
    .with({ players: 3, length: 'short' }, () => nextFrame3Short)
    .with({ players: 4, length: 'short' }, () => nextFrame4Short)
    .with({ players: 2, length: 'long' }, () => nextFrame2Long)
    .with({ players: 2, length: 'short' }, () => nextFrame2Short)
    .with({ players: 1 }, () => nextFrameSolo)
    .exhaustive()

export const nextFrame: StateReducer = (state) => {
  if (state === undefined) return undefined
  if (state.config === undefined) return undefined
  return runProgression(pickFrameFlow(state.config))(state)
}

export const revertActivePlayerToCurrent: StateReducer = withFrame((frame) => ({
  ...frame,
  activePlayerIndex: frame.currentPlayerIndex,
}))

const consumeCommandFromBonus =
  (command: GameCommandEnum) =>
  (frame: Frame | undefined): Frame | undefined => {
    if (frame === undefined) return undefined
    const bonusIndex = findIndex(equals(command))(frame.bonusActions)
    if (bonusIndex === -1) return undefined
    const newValue = remove(bonusIndex, 1, frame.bonusActions)
    return set(lensProp('bonusActions'), newValue, frame)
  }

export const onlyViaBonusActions = (command: GameCommandEnum) => withFrame(consumeCommandFromBonus(command))

export const oncePerFrame = (command: GameCommandEnum): StateReducer =>
  withFrame((frame) => {
    // first try to remove the proposed command from bonusActions
    const bonusFrame = consumeCommandFromBonus(command)(frame)
    if (bonusFrame !== undefined) return bonusFrame

    // then if it couldn't be, consume the main action, if available
    if (frame.mainActionUsed === false) return { ...frame, mainActionUsed: true }
    return undefined
  })

export const clearNeutralBuildingPhase: StateReducer = withFrame(assoc('neutralBuildingPhase', false))

export const setFrameToAllowFreeUsage = (building: BuildingEnum[]): StateReducer =>
  withFrame((frame) => ({
    ...frame,
    usableBuildings: building,
    nextUse: NextUseClergy.Free,
  }))

export const disableFurtherUsage = (building: BuildingEnum): StateReducer =>
  withFrame(
    (frame) =>
      frame && {
        ...frame,
        unusableBuildings: [...frame.unusableBuildings, building],
      }
  )

const whichIndexHasBuilding =
  (building: BuildingEnum) =>
  (landscapes: Tile[][][]): [number, number, number] | undefined => {
    for (let i = 0; i < landscapes.length; i++) {
      const location = findBuildingWithoutOffset(building)(landscapes[i])
      if (location) return [i, ...location]
    }
    return undefined
  }

export const allowFreeUsageToNeighborsOf =
  (building: BuildingEnum): StateReducer =>
  (state) => {
    if (state === undefined) return state
    const location = whichIndexHasBuilding(building)(state.players.map((p) => p.landscape))
    if (location === undefined) return state
    const [player, row, col] = location
    return setFrameToAllowFreeUsage(
      reduce(
        (accum, curr: [number, number, number]) => {
          const [p, r, c] = curr
          const landStack = state.players[p].landscape?.[r]?.[c]
          if (landStack === undefined) return accum
          const [_, building, clergy] = landStack
          if (building === undefined) return accum
          if (clergy !== undefined) return accum
          if (isSettlement(building)) return accum
          if (LANDSCAPES.includes(building)) return accum
          accum.push(building as BuildingEnum)
          return accum
        },
        [] as BuildingEnum[],
        map(([rowMod, colMod]) => [player, row + rowMod, col + colMod], getAdjacentOffsets(col - 2)) as [
          number,
          number,
          number,
        ][]
      )
    )(state)
  }

export const allOccupiedBuildingsUsable: StateReducer = (state) => {
  if (state === undefined) return state
  return setFrameToAllowFreeUsage(occupiedBuildingsForPlayers(state.players))(state)
}

export const checkNotBonusRound: StateReducer = withFrame((frame) => {
  if (frame?.bonusRoundPlacement === true) return undefined
  return frame
})

import { randomInt } from 'pcg'
import {
  assoc,
  assocPath,
  descend,
  equals,
  filter,
  find,
  findIndex,
  fromPairs,
  identity,
  includes,
  isEmpty,
  isNotNil,
  keys,
  lte,
  map,
  mapAccum,
  pipe,
  sort,
  toPairs,
  uniq,
  without,
} from 'ramda'
import {
  BuildingEnum,
  FrameFlow,
  GameConfigVariant,
  GameState,
  GameStatusEnum,
  OrdinalFrame,
  RondelToken,
  SettlementRound,
  StateReducer,
  Tile,
} from '../../types'
import { introduceBuildings, roundBuildings } from '../buildings'
import { introduceGrapeToken, introduceStoneToken, take } from '../rondel'
import { introduceSettlements } from '../settlements'
import { gameEnd } from '../state'
import { nextFrameSolo } from './nextFrameSolo'
import { rotateRondelWithExpire } from './rotateRondel'

// Robbins solo variant
//
// - Before the wheel turns each round, roll a d10 and move one token from the
//   1st/2nd/3rd/4th highest number on the wheel back to 0.
// - The neutral player builds a random building at fixed points of the game.
// - Grape and stone tokens enter as in the multi-player long game.

type Letter = 'A' | 'B' | 'C' | 'D' | 'E'

// the wheel position of each single-player letter. The arm crosses the letter
// on the rotation where pointingBefore becomes this value.
const SOLO_LETTER_POSITION: Record<Letter, number> = { A: 11, B: 2, C: 8, D: 12, E: 5 }

// rotation number (1-based) of the nth time the arm crosses a letter
export const crossing = (letter: Letter, nth: number): number => SOLO_LETTER_POSITION[letter] + 13 * (nth - 1)

// rotation number on which the grape and stone tokens enter (same as multi-player long)
const GRAPE_ROTATION = 8
const STONE_ROTATION = 13

// builds when the arm crosses a letter, the same for normal and aggressive
export const crossingSchedule: [number, SettlementRound][] = [
  [crossing('B', 1), SettlementRound.S],
  [crossing('E', 1), SettlementRound.S],
  [crossing('C', 1), SettlementRound.S],
  [crossing('D', 1), SettlementRound.A],
  [crossing('E', 2), SettlementRound.B],
  [crossing('A', 2), SettlementRound.C],
  [crossing('B', 3), SettlementRound.D],
]

// aggressive only: after settlement phase X resolves, build a building of this type
export const afterSettlementSchedule: Partial<Record<SettlementRound, SettlementRound>> = {
  [SettlementRound.A]: SettlementRound.S,
  [SettlementRound.B]: SettlementRound.A,
  [SettlementRound.C]: SettlementRound.B,
  [SettlementRound.D]: SettlementRound.C,
  [SettlementRound.E]: SettlementRound.D,
}

const RONDEL_TOKENS: RondelToken[] = ['grain', 'sheep', 'clay', 'coin', 'wood', 'joker', 'peat', 'grape', 'stone']

// draw an integer in [min, max) from the seeded generator, and keep the next generator state
const draw =
  (min: number, max: number) =>
  (state: GameState): [number, GameState] => {
    const [value, randGen] = randomInt(min, max, state.randGen!)
    return [value, { ...state, randGen }]
  }

// 1-4 => highest, 5-7 => second highest, 8-9 => third highest, 10 => fourth highest
export const rankForRoll = (roll: number): number => findIndex(lte(roll), [4, 7, 9, 10])

// each token on the wheel, with the number of goods it shows now
export const tokensOnWheel = (state: GameState): [RondelToken, number][] =>
  filter(
    ([, value]) => isNotNil(value),
    map(
      (token): [RondelToken, number] => [
        token,
        state.rondel![token] === undefined
          ? (undefined as unknown as number)
          : take(state.rondel!.pointingBefore, state.rondel![token]!, state.config!),
      ],
      RONDEL_TOKENS
    )
  )

// the tokens which hold the nth highest number. If there are fewer numbers, use the lowest.
export const tokensAtRank = (rank: number, onWheel: [RondelToken, number][]): RondelToken[] => {
  const values = sort(descend(identity), uniq(map(([, value]) => value, onWheel)))
  const target = values[Math.min(rank, values.length - 1)]
  return onWheel.filter(([, value]) => value === target).map(([token]) => token)
}

export const rollProductionWheel: StateReducer = (state) => {
  if (state?.rondel === undefined || state.config === undefined) return state
  const onWheel = tokensOnWheel(state)
  if (isEmpty(onWheel)) return state
  const [roll, s1] = draw(1, 11)(state)
  const candidates = tokensAtRank(rankForRoll(roll), onWheel)
  const [pick, s2] = draw(0, candidates.length)(s1)
  return assocPath(['rondel', candidates[pick]], s2.rondel!.pointingBefore, s2)
}

// spaces of the neutral heartland, top row left to right, then bottom row
const HEARTLAND_COLS = [2, 3, 4, 5, 6]
const topRow = map((col): [number, number] => [0, col], HEARTLAND_COLS)
const bottomRow = map((col): [number, number] => [1, col], HEARTLAND_COLS)

const tileAt =
  (landscape: Tile[][]) =>
  ([row, col]: [number, number]): Tile =>
    landscape[row]?.[col] ?? []

// first space with land and with no erection on it
export const emptyNeutralSpace = (landscape: Tile[][]): [number, number] | undefined =>
  find(
    ([row, col]) => {
      const [land, erection] = tileAt(landscape)([row, col])
      return land !== undefined && erection === undefined
    },
    [...topRow, ...bottomRow]
  )

// when the heartland is full, cover top row buildings from left to right, and then start again
export const coverNeutralSpace = (landscape: Tile[][], covers: number): [number, number] => {
  const built = filter(([row, col]) => tileAt(landscape)([row, col])[1] !== undefined, topRow)
  return built[covers % built.length]
}

// pick a random building of a type from the display, and put it on the neutral heartland.
// with fallback, if no building of that type is left, pick from all of the display.
export const neutralBuild =
  (round: SettlementRound, fallback = false): StateReducer =>
  (state) => {
    if (state?.config === undefined || state.players?.[1] === undefined) return state
    // the last frame repeats after the game ends, so do not build again
    if (state.status === GameStatusEnum.FINISHED) return state
    const display = state.buildings ?? []
    const ofType = filter((b: BuildingEnum) => includes(b, roundBuildings(state.config!, round)), display)
    const pool = isEmpty(ofType) && fallback ? display : ofType
    if (isEmpty(pool)) return state
    const [pick, s1] = draw(0, pool.length)(state)
    const building = pool[pick]
    const { landscape } = s1.players![1]
    const covers = s1.neutralCovers ?? 0
    const empty = emptyNeutralSpace(landscape)
    const [row, col] = empty ?? coverNeutralSpace(landscape, covers)
    return pipe(
      assocPath<BuildingEnum, GameState>(['players', 1, 'landscape', row, col, 1], building),
      (s: GameState) => assoc('buildings', without([building], s.buildings ?? []), s),
      (s: GameState) => (empty ? s : assoc('neutralCovers', covers + 1, s))
    )(s1)
  }

const SETTLEMENT_INTRODUCTIONS = [introduceBuildings, introduceSettlements]

// change one frame of the solo flow
const robbinsFrame =
  (aggressive: boolean) =>
  (rotation: number, rotates: boolean, settledBefore?: SettlementRound) =>
  (frame: OrdinalFrame): OrdinalFrame => {
    const upkeep = frame.upkeep ?? []
    const afterSettlement = aggressive ? afterSettlementSchedule[settledBefore as SettlementRound] : undefined
    const afterSettlementBuild = afterSettlement ? [neutralBuild(afterSettlement, true)] : []
    if (!rotates) {
      return afterSettlementBuild.length ? { ...frame, upkeep: [...afterSettlementBuild, ...upkeep] } : frame
    }
    const isIntroduction = (f: StateReducer) => includes(f, SETTLEMENT_INTRODUCTIONS)
    return {
      ...frame,
      upkeep: [
        // the settlement phase (new buildings and settlements) finishes the round before
        ...filter(isIntroduction, upkeep),
        ...afterSettlementBuild,
        ...(rotation === GRAPE_ROTATION ? [introduceGrapeToken] : []),
        ...(rotation === STONE_ROTATION ? [introduceStoneToken] : []),
        rollProductionWheel,
        ...filter((f) => !isIntroduction(f), upkeep),
        ...crossingSchedule.filter(([at]) => at === rotation).map(([, round]) => neutralBuild(round)),
      ],
    }
  }

// which settlement phase came just before each frame. The solo flow has no
// E settlement phase, so the end of the game takes its place.
const settledBeforeFrame = (flow: FrameFlow): Record<string, SettlementRound> =>
  fromPairs([
    ...toPairs(flow)
      .filter(([, frame]) => !!frame.neutralBuildingPhase && frame.settlementRound !== undefined)
      .map(([, frame]): [string, SettlementRound] => [String(frame.next), frame.settlementRound!]),
    ...toPairs(flow)
      .filter(([, frame]) => includes(gameEnd, frame.upkeep ?? []))
      .map(([key]): [string, SettlementRound] => [String(key), SettlementRound.E]),
  ])

export const robbinsFrameFlow = (variant: GameConfigVariant): FrameFlow => {
  const aggressive = equals(variant, 'robbins-aggressive')
  const settledBefore = settledBeforeFrame(nextFrameSolo)
  const frameKeys = sort((a: number, b: number) => a - b, map(Number, keys(nextFrameSolo)))
  const [, frames] = mapAccum(
    (rotations: number, key: number): [number, [string, OrdinalFrame]] => {
      const frame = nextFrameSolo[key]
      const rotates = includes(rotateRondelWithExpire, frame.upkeep ?? [])
      const rotation = rotates ? rotations + 1 : rotations
      return [rotation, [String(key), robbinsFrame(aggressive)(rotation, rotates, settledBefore[String(key)])(frame)]]
    },
    0,
    frameKeys
  )
  return fromPairs(frames)
}

export const nextFrameRobbins: FrameFlow = robbinsFrameFlow('robbins')
export const nextFrameRobbinsAggressive: FrameFlow = robbinsFrameFlow('robbins-aggressive')

import { describe, it, expect } from '../testHelpers'
import { control, completions, scores, encode, encodeInto, erectionId, FEATURE_LEN, featureSpec } from '..'
import { reducer } from '../reducer'
import { initialState } from '../state'
import { BuildingEnum, GameState, GameStatusEnum, SettlementEnum } from '../types'

// ===========================================================================
// Project 07 — engine fast paths. control() is now defined in terms of
// completions() + scores(), and encode() in terms of encodeInto(); these
// tests pin that the fast paths stay byte-for-byte identical to control()/
// encode() over real replayed games, and that erectionId's Map matches the
// old indexOf chain exactly. See docs/trainer/07-engine-fast-paths.md.
// ===========================================================================

// --- Reference erectionId: the pre-07 indexOf implementation, inlined, so the
// table test compares the Map against exactly what it replaced. ---
const BUILDINGS = Object.values(BuildingEnum) as BuildingEnum[]
const SETTLEMENTS = Object.values(SettlementEnum) as SettlementEnum[]
const genericBuildingKey = (b: string): string => {
  const m = /^L([RGBW])([123])$/.exec(b)
  if (m) return ['', 'ClayMound', 'FarmYard', 'CloisterOffice'][Number(m[2])]
  return b
}
const settlementTypeKey = (s: string): string => {
  const m = /^S[RGBW]([1-8])$/.exec(s)
  return `Settlement${m ? m[1] : s}`
}
const dedupeInOrder = (keys: string[]): string[] => keys.filter((k, i) => keys.indexOf(k) === i)
const OLD_GENERIC = dedupeInOrder(BUILDINGS.map(genericBuildingKey))
const OLD_SETTLEMENT_TYPES = dedupeInOrder(SETTLEMENTS.map(settlementTypeKey))
const OLD_SETTLEMENT_SET = new Set<string>(SETTLEMENTS)
const oldErectionId = (e: string): number => {
  if (OLD_SETTLEMENT_SET.has(e)) return OLD_GENERIC.length + OLD_SETTLEMENT_TYPES.indexOf(settlementTypeKey(e)) + 1
  return OLD_GENERIC.indexOf(genericBuildingKey(e)) + 1
}

// --- Fixtures --------------------------------------------------------------
// A full 4-player France/long game (mainline of game21872.test.ts): CONFIG +
// START through the final COMMIT into FINISHED. Auto-lifted from that fixture.
const game4pCommands: string[][] = [
  ['CONFIG', '4', 'france', 'long'],
  ['START', 'R', 'G', 'B', 'W'],
  ['USE', 'LR3'],
  ['BUY_DISTRICT', '2', 'PLAINS'],
  ['COMMIT'],
  ['USE', 'LG3', 'Jo'],
  ['COMMIT'],
  ['FELL_TREES', '2', '0'],
  ['COMMIT'],
  ['USE', 'LW1'],
  ['COMMIT'],
  ['BUILD', 'G01', '3', '1'],
  ['COMMIT'],
  ['BUILD', 'F09', '3', '1'],
  ['USE', 'F09'],
  ['USE', 'LG2', 'Sh'],
  ['COMMIT'],
  ['CUT_PEAT', '0', '0'],
  ['COMMIT'],
  ['FELL_TREES', '1', '0'],
  ['COMMIT'],
  ['USE', 'G01'],
  ['USE', 'F09'],
  ['USE', 'LG2', 'Gn'],
  ['COMMIT'],
  ['CUT_PEAT', '0', '0', 'Jo'],
  ['COMMIT'],
  ['USE', 'LB1'],
  ['COMMIT'],
  ['BUILD', 'G02', '3', '1'],
  ['USE', 'G02', 'ClPnGn', 'Pn'],
  ['BUY_DISTRICT', '-1', 'PLAINS'],
  ['COMMIT'],
  ['USE', 'LR1', 'Jo'],
  ['COMMIT'],
  ['BUILD', 'G12', '0', '0'],
  ['COMMIT'],
  ['USE', 'LB3'],
  ['BUY_DISTRICT', '-1', 'HILLS'],
  ['COMMIT'],
  ['USE', 'LW2', 'Gn'],
  ['COMMIT'],
  ['FELL_TREES', '2', '0'],
  ['COMMIT'],
  ['USE', 'G12', 'PtPtShShShSh'],
  ['COMMIT'],
  ['BUILD', 'F04', '3', '-1'],
  ['COMMIT'],
  ['BUILD', 'G13', '1', '0'],
  ['COMMIT'],
  ['CONVERT', 'Gn'],
  ['BUILD', 'F05', '2', '0'],
  ['COMMIT'],
  ['CUT_PEAT', '0', '1'],
  ['COMMIT'],
  ['USE', 'LB2', 'Sh'],
  ['COMMIT'],
  ['USE', 'G13', 'PnPn'],
  ['COMMIT'],
  ['USE', 'LR1'],
  ['COMMIT'],
  ['USE', 'F09'],
  ['USE', 'LG3', 'Jo'],
  ['BUY_DISTRICT', '2', 'PLAINS'],
  ['COMMIT'],
  ['USE', 'LB3'],
  ['BUY_PLOT', '-1', 'MOUNTAIN'],
  ['COMMIT'],
  ['USE', 'LW2', 'Gn'],
  ['COMMIT'],
  ['FELL_TREES', '1', '1'],
  ['COMMIT'],
  ['BUILD', 'F08', '1', '2'],
  ['USE', 'F08', 'ClGpPtGn'],
  ['BUY_PLOT', '0', 'MOUNTAIN'],
  ['COMMIT'],
  ['SETTLE', 'SB3', '3', '0', 'ShShShSh'],
  ['COMMIT'],
  ['SETTLE', 'SW1', '2', '-1', 'WoGn'],
  ['COMMIT'],
  ['SETTLE', 'SR2', '3', '0', 'ShGnPtWo'],
  ['COMMIT'],
  ['SETTLE', 'SG1', '2', '2', 'GpPt'],
  ['COMMIT'],
  ['USE', 'LB1'],
  ['COMMIT'],
  ['BUILD', 'F15', '1', '-1'],
  ['USE', 'F15', 'Pn'],
  ['COMMIT'],
  ['USE', 'G01'],
  ['USE', 'F15', 'Pn'],
  ['COMMIT'],
  ['USE', 'LG2', 'Sh'],
  ['COMMIT'],
  ['CONVERT', 'Gn'],
  ['BUILD', 'G16', '3', '1'],
  ['WITH_PRIOR'],
  ['USE', 'G16'],
  ['COMMIT'],
  ['USE', 'G02', 'SwGnWo', 'Pn'],
  ['COMMIT'],
  ['CUT_PEAT', '0', '0'],
  ['COMMIT'],
  ['USE', 'F09'],
  ['USE', 'LG2', 'JoGn'],
  ['COMMIT'],
  ['USE', 'G16'],
  ['COMMIT'],
  ['FELL_TREES', '2', '0'],
  ['COMMIT'],
  ['BUILD', 'G07', '1', '2'],
  ['USE', 'G07', 'PtPtPtPt'],
  ['COMMIT'],
  ['USE', 'LG3'],
  ['COMMIT'],
  ['USE', 'LB2', 'Gn'],
  ['COMMIT'],
  ['USE', 'G13', 'PnPn'],
  ['COMMIT'],
  ['BUILD', 'F14', '4', '2'],
  ['COMMIT'],
  ['SETTLE', 'SG5', '4', '2', 'BrShPt'],
  ['COMMIT'],
  ['SETTLE', 'SB5', '2', '0', 'PtShShSh'],
  ['COMMIT'],
  ['SETTLE', 'SW5', '4', '-1', 'WoShBr'],
  ['COMMIT'],
  ['SETTLE', 'SR5', '3', '2', 'WoBrGnGn'],
  ['COMMIT'],
  ['BUILD', 'G22', '6', '0'],
  ['USE', 'G22', 'Jo'],
  ['COMMIT'],
  ['WITH_PRIOR'],
  ['USE', 'F04', 'GnGnGnGnGnGn'],
  ['COMMIT'],
  ['CONVERT', 'Gn'],
  ['BUILD', 'F21', '2', '0'],
  ['USE', 'F21', 'GpGpWn'],
  ['BUY_PLOT', '-2', 'MOUNTAIN'],
  ['COMMIT'],
  ['USE', 'G01'],
  ['USE', 'F21', 'GpGpGpWn'],
  ['COMMIT'],
  ['FELL_TREES', '0', '2'],
  ['COMMIT'],
  ['WORK_CONTRACT', 'F05', 'PnPn'],
  ['WITH_LAYBROTHER'],
  ['USE', 'F05', 'FlFlFlFlFlFlPtPtBrBr'],
  ['COMMIT'],
  ['CONVERT', 'GnGn'],
  ['BUY_DISTRICT', '-2', 'PLAINS'],
  ['BUILD', 'F20', '2', '-2'],
  ['USE', 'F20', 'PnWn'],
  ['COMMIT'],
  ['BUY_PLOT', '0', 'COAST'],
  ['USE', 'LR2', 'Sh'],
  ['COMMIT'],
  ['USE', 'LG1'],
  ['COMMIT'],
  ['BUY_PLOT', '1', 'MOUNTAIN'],
  ['WORK_CONTRACT', 'G12', 'PnPn'],
  ['WITH_LAYBROTHER'],
  ['USE', 'G12', 'BrBrBrPnPtPtSwSw'],
  ['COMMIT'],
  ['USE', 'G13', 'PnPn'],
  ['COMMIT'],
  ['CONVERT', 'Ni'],
  ['WORK_CONTRACT', 'G22', 'PnPn'],
  ['USE', 'G22', 'Jo'],
  ['COMMIT'],
  ['BUILD', 'F24', '3', '2'],
  ['COMMIT'],
  ['BUILD', 'F17', '5', '1'],
  ['WITH_PRIOR'],
  ['USE', 'F17', 'PnBo'],
  ['COMMIT'],
  ['USE', 'F15', 'Pn'],
  ['COMMIT'],
  ['USE', 'LR2', 'Gn'],
  ['COMMIT'],
  ['BUY_DISTRICT', '3', 'HILLS'],
  ['CUT_PEAT', '0', '3'],
  ['COMMIT'],
  ['FELL_TREES', '2', '-1'],
  ['COMMIT'],
  ['BUILD', 'F25', '3', '-1'],
  ['COMMIT'],
  ['BUILD', 'F11', '-1', '0'],
  ['USE', 'F11'],
  ['COMMIT'],
  ['USE', 'F09'],
  ['USE', 'LG3'],
  ['COMMIT'],
  ['BUILD', 'G18', '5', '2'],
  ['COMMIT'],
  ['CONVERT', 'Ni'],
  ['WORK_CONTRACT', 'G22', 'PnPn'],
  ['WITH_LAYBROTHER'],
  ['USE', 'G22', 'Jo'],
  ['COMMIT'],
  ['WORK_CONTRACT', 'F04', 'Wn'],
  ['USE', 'F04', 'GnGnGnGnGn'],
  ['COMMIT'],
  ['CONVERT', 'Gn'],
  ['BUILD', 'F23', '5', '1'],
  ['USE', 'F23', 'Pn'],
  ['COMMIT'],
  ['CUT_PEAT', '0', '-1'],
  ['COMMIT'],
  ['USE', 'G02', 'ClPnFl', 'Wo'],
  ['COMMIT'],
  ['USE', 'F05', 'FlFlFlFlFlFlFlCoSwBrBr'],
  ['BUY_PLOT', '0', 'MOUNTAIN'],
  ['COMMIT'],
  ['USE', 'F09'],
  ['USE', 'LG2', 'Sh'],
  ['COMMIT'],
  ['USE', 'G16'],
  ['COMMIT'],
  ['SETTLE', 'SW2', '3', '0', 'WoPtBr'],
  ['COMMIT'],
  ['SETTLE', 'SR4', '-1', '1', 'CoBrBrSh'],
  ['COMMIT'],
  ['SETTLE', 'SG3', '0', '2', 'PnPnPnPnPnSh'],
  ['COMMIT'],
  ['SETTLE', 'SB6', '5', '0', 'PtPtPtMt'],
  ['COMMIT'],
  ['BUILD', 'F31', '4', '-2'],
  ['USE', 'F31'],
  ['COMMIT'],
  ['USE', 'LR1'],
  ['BUY_PLOT', '2', 'COAST'],
  ['COMMIT'],
  ['USE', 'G22'],
  ['COMMIT'],
  ['USE', 'G18', 'ClClClSnPtPt'],
  ['COMMIT'],
  ['USE', 'F21', 'GpGpGpGpGpGpGpGpGpWn'],
  ['COMMIT'],
  ['BUILD', 'G19', '1', '1'],
  ['USE', 'G19', 'ShShShShSwSwSwSw'],
  ['COMMIT'],
  ['CONVERT', 'GnGn'],
  ['BUILD', 'F30', '4', '3'],
  ['USE', 'F30', 'Po'],
  ['COMMIT'],
  ['USE', 'G16'],
  ['COMMIT'],
  ['BUY_PLOT', '0', 'MOUNTAIN'],
  ['BUILD', 'F32', '5', '1'],
  ['USE', 'F32', 'Pn'],
  ['FELL_TREES', '0', '-2'],
  ['CUT_PEAT', '0', '0', 'Jo'],
  ['COMMIT'],
  ['USE', 'G01'],
  ['USE', 'F30', 'Po'],
  ['COMMIT'],
  ['USE', 'F09'],
  ['USE', 'LG2', 'Gn'],
  ['COMMIT'],
  ['USE', 'LB2', 'Sh'],
  ['COMMIT'],
  ['USE', 'G02', 'ClWoFl', 'Sh'],
  ['COMMIT'],
  ['BUILD', 'G26', '-1', '3'],
  ['COMMIT'],
  ['WORK_CONTRACT', 'G07', 'PnPn'],
  ['WITH_LAYBROTHER'],
  ['USE', 'G07', 'PtPtPtPtPtPtPtPt'],
  ['COMMIT'],
  ['CONVERT', 'Gn'],
  ['SETTLE', 'SB7', '2', '-1', 'ShShShShShShBrPtWoWoWoWoWoSwSwSwSw'],
  ['COMMIT'],
  ['SETTLE', 'SW3', '3', '-2', 'ShShShFl'],
  ['COMMIT'],
  ['SETTLE', 'SR7', '0', '0', 'MtMtMtCoCoCo'],
  ['COMMIT'],
  ['SETTLE', 'SG2', '3', '3', 'GpGpGpCo'],
  ['COMMIT'],
  ['USE', 'LB3'],
  ['COMMIT'],
  ['BUILD', 'F40', '5', '0'],
  ['COMMIT'],
  ['BUILD', 'F29', '6', '0'],
  ['USE', 'F29'],
  ['COMMIT'],
  ['BUY_PLOT', '2', 'MOUNTAIN'],
  ['BUILD', 'F38', '0', '3'],
  ['USE', 'F38', '1', '3', '2', '3', '1', '1', '1', '0'],
  ['COMMIT'],
  ['CUT_PEAT', '0', '1'],
  ['COMMIT'],
  ['USE', 'G13', 'PnPn'],
  ['COMMIT'],
  ['USE', 'F14'],
  ['COMMIT'],
  ['BUILD', 'F36', '2', '3'],
  ['COMMIT'],
  ['FELL_TREES', '1', '-1'],
  ['COMMIT'],
  ['WORK_CONTRACT', 'LG2', 'Wn'],
  ['USE', 'LG2', 'ShJo'],
  ['COMMIT'],
  ['USE', 'F11'],
  ['COMMIT'],
  ['USE', 'F08', 'WoSnPnGp'],
  ['COMMIT'],
  ['BUILD', 'G39', '5', '-1'],
  ['USE', 'G39', 'PtPtPt'],
  ['COMMIT'],
  ['BUILD', 'G28', '6', '-2'],
  ['USE', 'G28'],
  ['SETTLE', 'SW6', '5', '-2', 'ShShFlPtPtPt'],
  ['COMMIT'],
  ['USE', 'G01'],
  ['USE', 'G28'],
  ['SETTLE', 'SR3', '2', '2', 'MtGpGp'],
  ['COMMIT'],
  ['WORK_CONTRACT', 'G19', 'PnPn'],
  ['CONVERT', 'GnGnGnGnGnGn'],
  ['USE', 'G19', 'SwSwSwSwSwSwShShShShShSh'],
  ['COMMIT'],
  ['USE', 'LB1'],
  ['COMMIT'],
  ['USE', 'F40'],
  ['USE', 'F27', 'Wn'],
  ['USE', 'F08', 'WoClSwSh'],
  ['COMMIT'],
  ['CUT_PEAT', '0', '1'],
  ['BUY_DISTRICT', '3', 'PLAINS'],
  ['COMMIT'],
  ['USE', 'F09'],
  ['USE', 'LG2', 'Sh'],
  ['COMMIT'],
  ['WORK_CONTRACT', 'F36', 'PnPn'],
  ['USE', 'F36', 'Or', 'Po'],
  ['COMMIT'],
  ['USE', 'F15', 'Pn'],
  ['COMMIT'],
  ['USE', 'G01'],
  ['USE', 'G28'],
  ['SETTLE', 'SR6', '2', '3', 'PtPtPtBrGpGp'],
  ['COMMIT'],
  ['WORK_CONTRACT', 'F17', 'PnPn'],
  ['WITH_LAYBROTHER'],
  ['CONVERT', 'Ni'],
  ['USE', 'F17', 'PnPnPnBo'],
  ['COMMIT'],
  ['CONVERT', 'Gn'],
  ['BUILD', 'F35', '1', '-1'],
  ['WITH_PRIOR'],
  ['USE', 'F35', 'PnPnPnPnPn'],
  ['COMMIT'],
  ['USE', 'F40'],
  ['USE', 'F33', 'PtWoMt'],
  ['COMMIT'],
  ['WORK_CONTRACT', 'F24', 'PnPn'],
  ['WITH_LAYBROTHER'],
  ['USE', 'F24', 'BrBrWnWn'],
  ['COMMIT'],
  ['WORK_CONTRACT', 'G28', 'PnPn'],
  ['WITH_LAYBROTHER'],
  ['USE', 'G28'],
  ['SETTLE', 'SG6', '1', '3', 'MtCoCo'],
  ['COMMIT'],
  ['USE', 'G18', 'ClClClPtWo'],
  ['COMMIT'],
  ['USE', 'G13', 'PnPn'],
  ['COMMIT'],
  ['USE', 'G26', 'WoWo'],
  ['COMMIT'],
  ['USE', 'G28'],
  ['SETTLE', 'SG8', '5', '2', 'MtMtMtMtMtMtCo'],
  ['COMMIT'],
  ['USE', 'F40'],
  ['USE', 'G34', 'BoPoOrRq'],
  ['COMMIT'],
  ['USE', 'F25', 'WoClSnSwPnGnShFlGpMtWnBrBo'],
  ['COMMIT'],
  ['SETTLE', 'SR1', '4', '3', 'GpPt'],
  ['COMMIT'],
  ['SETTLE', 'SG7', '5', '3', 'ShShShShShBrGpPnCoCoCo'],
  ['COMMIT'],
  ['SETTLE', 'SB2', '4', '-1', 'PtWoPnPnPn'],
  ['COMMIT'],
  ['SETTLE', 'SW8', '5', '-1', 'ShShShFlGpBrMtMtMtMtWoWoWo'],
  ['COMMIT'],
]

// A solo (1-player) France/long game — exercises scores()'s slice(0, players)
// (a neutral player sits past config.players) and 1p completion arms. Lifted
// verbatim from control-solo.test.ts.
const soloCommands: string[][] = `
CONFIG 1 france long
START R B
CUT_PEAT 0 0
COMMIT
FELL_TREES 1 0
COMMIT
USE LR1
COMMIT
BUILD G07 0 0
USE G07 PtPt
COMMIT
USE LR3
COMMIT
BUILD G01 3 1
COMMIT
USE LR2 Gn
CONVERT GnGn
COMMIT
BUILD G06 1 0
USE G06 CoCoCo
COMMIT
BUY_DISTRICT 2 PLAINS
BUILD F09 3 2
COMMIT
USE LR1
COMMIT
FELL_TREES 0 2
COMMIT
CUT_PEAT 0 1
COMMIT
USE G07 PtPtPtPtPtPt
COMMIT
USE G06 CoCoCo
BUY_PLOT 2 COAST
COMMIT
BUY_DISTRICT 3 PLAINS
BUILD F03 1 3
USE F03 Pn
COMMIT
BUILD F04 -1 3
COMMIT
USE F04 GnGnGnGnGnGnGn
COMMIT
BUILD F05 0 2
USE F05 FlFlFlFlFlFlFlCoSwBrBr
COMMIT
BUILD G12 0 1
COMMIT
USE G12 BrBrBrPnCoCo
COMMIT
BUILD F08 2 2
USE F08 PnGnWoSw
BUY_PLOT 0 COAST
COMMIT
BUILD F11 -1 1
COMMIT
`
  .trim()
  .split('\n')
  .map((l) => l.trim().split(' '))

// Replay a command list, returning every in-play intermediate state. The
// SETUP states before START (no frame/players yet) are dropped: control(),
// completions() and scores() are never called during SETUP and would throw
// (encode's SETUP path is covered by its own test below).
const replay = (commands: string[][]): GameState[] => {
  const states: GameState[] = []
  let s = initialState
  for (const cmd of commands) {
    const next = reducer(s, cmd)
    if (next === undefined) throw new Error(`reducer returned undefined at [${cmd.join(' ')}]`)
    s = next
    if (s.status !== GameStatusEnum.SETUP) states.push(s)
  }
  return states
}

const game4pStates = replay(game4pCommands)
const soloStates = replay(soloCommands)

// completions()/control().completion can only diverge by throwing differently,
// so compare captured outcomes rather than letting a throw abort the suite.
type Outcome = { ok: true; value: unknown } | { ok: false; error: string }
const capture = (fn: () => unknown): Outcome => {
  try {
    return { ok: true, value: fn() }
  } catch (e) {
    return { ok: false, error: String(e) }
  }
}

// Depth-bounded DFS over partials: append each single-token completion to the
// partial and recurse, so command-specific match arms get exercised on real
// states (multi-word coordinate tokens like '3 1' terminate a branch — they
// are not valid partial prefixes pre-canonicalization).
const assertPartialParity = (state: GameState, maxDepth = 3, maxNodes = 120): void => {
  const budget = { nodes: maxNodes }
  const visit = (partial: string[], depth: number): void => {
    const fast = capture(() => completions(state, partial))
    const slow = capture(() => control(state, partial).completion)
    expect(fast).toStrictEqual(slow)
    if (depth >= maxDepth || !fast.ok || !Array.isArray(fast.value)) return
    for (const tok of fast.value as string[]) {
      if (budget.nodes <= 0) return
      if (typeof tok !== 'string' || tok.includes(' ')) continue
      budget.nodes -= 1
      visit([...partial, tok], depth + 1)
    }
  }
  visit([], 0)
}

const expectFloatArraysEqual = (a: Float32Array, b: Float32Array): void => {
  expect(a.length).toBe(b.length)
  let firstMismatch = -1
  for (let i = 0; i < a.length; i++) {
    if (!Object.is(a[i], b[i])) {
      firstMismatch = i
      break
    }
  }
  expect(firstMismatch).toBe(-1)
}

describe('fast paths: completions() parity with control().completion', () => {
  it('matches control() at every state of a 4-player game (top level)', () => {
    for (const state of game4pStates) {
      expect(completions(state, [])).toStrictEqual(control(state, []).completion)
    }
  })

  it('matches control() at every state of a solo game (top level)', () => {
    for (const state of soloStates) {
      expect(completions(state, [])).toStrictEqual(control(state, []).completion)
    }
  })

  it('matches control() over drilled-down partials (command-specific arms)', () => {
    // Sample states across the games so the deeper DFS stays fast.
    for (let i = 0; i < game4pStates.length; i += 9) assertPartialParity(game4pStates[i])
    for (let i = 0; i < soloStates.length; i += 5) assertPartialParity(soloStates[i])
  })

  it('defaults partial to [] like the undefined-head arm', () => {
    const state = game4pStates[2]
    expect(completions(state)).toStrictEqual(completions(state, []))
  })

  it('returns [] for an unknown command head (the .otherwise arm)', () => {
    expect(completions(game4pStates[2], ['NOT_A_COMMAND'])).toStrictEqual([])
  })

  it('short-circuits to [] only for an undefined head on a FINISHED state', () => {
    const finished = game4pStates[game4pStates.length - 1]
    expect(finished.status).toBe(GameStatusEnum.FINISHED)
    expect(completions(finished, [])).toStrictEqual([])
    // a command head still delegates on FINISHED — not short-circuited
    expect(completions(finished, ['USE'])).toStrictEqual(control(finished, ['USE']).completion)
  })
})

describe('fast paths: scores() parity with control().score', () => {
  it('matches control() at every 4-player state', () => {
    for (const state of game4pStates) {
      expect(scores(state)).toStrictEqual(control(state, []).score)
    }
  })

  it('matches control() at every solo state and slices off the neutral player', () => {
    for (const state of soloStates) {
      const s = scores(state)
      expect(s).toStrictEqual(control(state, []).score)
      expect(s.length).toBe(state.config!.players) // 1, though players[] holds a neutral too
    }
  })
})

describe('fast paths: encodeInto() parity with encode()', () => {
  const perspectivesFor = (state: GameState): (number | undefined)[] => [
    undefined,
    ...Array.from({ length: state.players!.length }, (_, i) => i),
  ]

  it('equals encode() byte-for-byte into a fresh buffer, every perspective', () => {
    for (let i = 0; i < game4pStates.length; i += 7) {
      const state = game4pStates[i]
      for (const p of perspectivesFor(state)) {
        const out = new Float32Array(FEATURE_LEN)
        encodeInto(state, p, out)
        expectFloatArraysEqual(out, encode(state, p))
      }
    }
  })

  it('clears a NaN-poisoned scratch buffer (proves the fill(0))', () => {
    const state = game4pStates[120]
    const out = new Float32Array(FEATURE_LEN).fill(NaN)
    encodeInto(state, 0, out)
    expectFloatArraysEqual(out, encode(state, 0))
  })

  it('writes exactly [offset, offset + FEATURE_LEN) and nothing outside', () => {
    const state = game4pStates[120]
    const offset = 37
    const pad = 11
    const buf = new Float32Array(offset + FEATURE_LEN + pad).fill(NaN)
    encodeInto(state, undefined, buf, offset)
    // window equals a standalone encode
    expectFloatArraysEqual(buf.slice(offset, offset + FEATURE_LEN), encode(state))
    // bytes before and after the window are untouched (still NaN)
    for (let i = 0; i < offset; i++) expect(Number.isNaN(buf[i])).toBe(true)
    for (let i = offset + FEATURE_LEN; i < buf.length; i++) expect(Number.isNaN(buf[i])).toBe(true)
  })

  it('throws RangeError when the buffer is too small for the offset', () => {
    const state = game4pStates[10]
    expect(() => encodeInto(state, undefined, new Float32Array(FEATURE_LEN), 1)).toThrow()
    expect(() => encodeInto(state, undefined, new Float32Array(FEATURE_LEN - 1))).toThrow()
  })

  it('zero-fills a SETUP state', () => {
    const setup = { status: GameStatusEnum.SETUP } as GameState
    const out = new Float32Array(FEATURE_LEN).fill(NaN)
    encodeInto(setup, undefined, out)
    expect(out.every((v) => v === 0)).toBe(true)
  })
})

describe('fast paths: erectionId Map matches the old indexOf implementation', () => {
  it('matches for every BuildingEnum value', () => {
    for (const b of BUILDINGS) expect(erectionId(b)).toBe(oldErectionId(b))
  })
  it('matches for every SettlementEnum value', () => {
    for (const s of SETTLEMENTS) expect(erectionId(s)).toBe(oldErectionId(s))
  })
  it('falls back to 0 for an unknown erection (like indexOf −1 + 1)', () => {
    expect(erectionId('NOT_AN_ERECTION' as BuildingEnum)).toBe(0)
    expect(oldErectionId('NOT_AN_ERECTION')).toBe(0)
  })
})

describe('fast paths: featureSpec version and country capacity', () => {
  it('reserves 8 country slots (14,670 -> 14,676) and bumps the version', () => {
    expect(FEATURE_LEN).toBe(14676)
    expect(featureSpec.featureLen).toBe(14676)
    expect(featureSpec.version).toBe(2)
    // countries vocab stays the source of truth for live ids (still 2)
    expect(featureSpec.vocab.countries.length).toBe(2)
  })
})

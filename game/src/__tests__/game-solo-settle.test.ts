import { describe, it, expect } from '../testHelpers'
import { control } from '..'
import { reducer } from '../reducer'
import { initialState } from '../state'
import { GameState, NextUseClergy } from '../types'

describe('game-solo-settle', () => {
  it('settling should', () => {
    const s01 = initialState
    const s02 = reducer(s01, ['CONFIG', '1', 'france', 'long'])!
    const s03 = reducer(s02, ['START', 'G', 'W'])!
    expect(s03.players!.map((p) => p.color)).toStrictEqual(['G', 'W'])
    expect(s03).toBeDefined()
    const s06 = reducer(s03, ['USE', 'LG1'])!
    expect(s06).toBeDefined()
    const s07 = reducer(s06, ['COMMIT'])!
    const s08 = reducer(s07, ['FELL_TREES', '2', '0'])!
    expect(s08).toBeDefined()
    const s09 = reducer(s08, ['COMMIT'])!
    expect(s09).toBeDefined()
    const s10 = reducer(s09, ['USE', 'LG2', 'Gn'])!
    expect(s10).toBeDefined()
    const s11 = reducer(s10, ['CONVERT', 'Gn'])!
    expect(s11).toBeDefined()
    const s12 = reducer(s11, ['COMMIT'])!
    const s13 = reducer(s12, ['CUT_PEAT', '0', '0'])!
    const s14 = reducer(s13, ['COMMIT'])!
    const s15 = reducer(s14, ['BUILD', 'G07', '0', '0'])!
    const s16 = reducer(s15, ['USE', 'G07', 'PtPtPt'])!
    const s17 = reducer(s16, ['COMMIT'])!
    const s18 = reducer(s17, ['FELL_TREES', '1', '1'])!
    const s19 = reducer(s18, ['COMMIT'])!
    const s20 = reducer(s19, ['BUILD', 'F03', '1', '1'])!
    const s21 = reducer(s20, ['USE', 'F03', 'Pn'])!
    const s22 = reducer(s21, ['COMMIT'])!
    const s23 = reducer(s22, ['USE', 'LG1'])!
    const s24 = reducer(s23, ['COMMIT'])!
    const s25 = reducer(s24, ['CONVERT', 'Gn'])!
    expect(s25).toBeDefined()
    const s26 = reducer(s25, ['BUILD', 'G06', '2', '0'])!
    const s27 = reducer(s26, ['COMMIT'])!
    const s28 = reducer(s27, ['USE', 'G06', 'CoCoCo'])!
    const s29 = reducer(s28, ['COMMIT'])!
    const s30 = reducer(s29, ['BUY_DISTRICT', '2', 'HILLS'])!
    const s31 = reducer(s30, ['BUILD', 'F04', '3', '2'])!
    const s32 = reducer(s31, ['USE', 'F04', 'GnGnGnGnGnGnGn'])!
    const s33 = reducer(s32, ['COMMIT'])!
    const s34 = reducer(s33, ['USE', 'F03', 'Pn'])!
    const s35 = reducer(s34, ['COMMIT'])!
    const s36 = reducer(s35, ['BUILD', 'G01', '3', '1'])!
    const s37 = reducer(s36, ['COMMIT'])!
    const s40 = reducer(s37, ['CUT_PEAT', '0', '2'])!
    const s41 = reducer(s40, ['COMMIT'])!
    const s42 = reducer(s41, ['FELL_TREES', '1', '0'])!
    expect(s42.players![0].landscape[0][3]).toStrictEqual(['P'])
    const s43 = reducer(s42, ['COMMIT'])!
    const s44 = reducer(s43, ['USE', 'G07', 'PtPtPtPtPtPt'])!
    const s45 = reducer(s44, ['COMMIT'])!
    const s46 = reducer(s45, ['USE', 'G06', 'CoCoCo'])!
    const s47 = reducer(s46, ['BUY_DISTRICT', '3', 'PLAINS'])!
    const s48 = reducer(s47, ['COMMIT'])!
    expect(s48.frame).toMatchObject({
      mainActionUsed: false,
      usableBuildings: [],
      unusableBuildings: [],
      nextUse: NextUseClergy.Any,
      bonusActions: [],
    })
    const s49 = reducer(s48, ['BUILD', 'F09', '4', '2'])!
    expect(s49.frame).toMatchObject({
      mainActionUsed: true,
      usableBuildings: ['F09'],
      unusableBuildings: [],
      nextUse: NextUseClergy.OnlyPrior,
      bonusActions: ['USE'],
    })
    const s50 = reducer(s49, ['USE', 'F09'])!
    expect(s50.frame).toMatchObject({
      mainActionUsed: true,
      usableBuildings: ['LG3', 'F04'],
      unusableBuildings: ['F09'],
      nextUse: NextUseClergy.Free,
      bonusActions: [],
    })
    const s51 = reducer(s50, ['USE', 'LG3'])!
    expect(s51.frame).toMatchObject({
      mainActionUsed: true,
      usableBuildings: [],
      unusableBuildings: ['F09'], // prevents cycles
      nextUse: NextUseClergy.Free,
      bonusActions: [],
    })
    expect(s51).toBeDefined()

    const c51 = control(s51, [])
    expect(c51.completion).not.toContain('USE')
    expect(c51.completion).toContain('BUY_PLOT')
    expect(c51.completion).toContain('BUY_DISTRICT')
    expect(c51.completion).toContain('CONVERT')
    expect(c51.completion).toContain('COMMIT')

    const s52 = reducer(s51, ['COMMIT'])!

    // just at test to see if we can work_contract here
    const c52 = control(s52, ['WORK_CONTRACT'])
    expect(c52.completion).toContain('G13')
    expect(c52.completion).toHaveLength(4)

    const s53 = reducer(s52, ['USE', 'LG1'])!
    expect(s53).toBeDefined()
    const s54 = reducer(s53, ['COMMIT'])!
    expect(s54).toBeDefined()
    expect(s54.players![0]).toMatchObject({
      penny: 10,
    })
    expect(s54.players![1].landscape[0][2]).toStrictEqual(['P', 'G13'])
    const s55 = reducer(s54, ['WORK_CONTRACT', 'G13', 'Pn'])!
    expect(s55).toBeDefined()
    const s56 = reducer(s55, ['USE', 'G13', 'PnPn'])!
    const s57 = reducer(s56, ['COMMIT'])!
    expect(s57).toBeDefined()
    const s58 = reducer(s57, ['BUILD', 'F05', '2', '3'])!
    const s59 = reducer(s58, ['USE', 'F05', 'FlFlFlFlFlFlFlCoCoBrBr'])!
    const s59a = reducer(s59, ['COMMIT'])!
    const s60 = reducer(s59a, ['BUY_PLOT', '2', 'COAST'])!
    const s61 = reducer(s60, ['BUILD', 'F11', '-1', '2'])!

    expect(s61.players![0]).toMatchObject({
      landscape: [
        [[], [], ['P', 'G07'], ['P'], ['P', 'G06'], ['P'], ['H', 'LG1'], [], []],
        [[], [], ['P', 'LMO'], ['P', 'F03'], ['P', 'LG2'], ['P', 'G01'], ['P', 'LG3'], [], []],
        [['W'], ['C', 'F11'], ['P'], ['P', 'LFO'], ['P', 'LFO'], ['H', 'F04'], ['H', 'F09'], [], []],
        [['W'], ['C'], ['P', 'LFO'], ['P'], ['P', 'F05', 'PRIG'], ['P'], ['H'], [], []],
      ],
    })
    expect(s61.players![1]).toMatchObject({
      landscape: [
        [[], [], ['P', 'G13', 'LB1W'], ['P'], ['P'], ['P'], ['H', 'LW1'], [], []],
        [[], [], ['P'], ['P'], ['P', 'LW2'], ['P'], ['P', 'LW3'], [], []],
      ],
    })
    const s62 = reducer(s61, ['COMMIT'])!

    expect(s62).toBeDefined()

    expect(s62.frame).toMatchObject({
      nextUse: NextUseClergy.Any, // default before any neutralBuildingPhase builds
      mainActionUsed: true,
      bonusActions: ['BUILD'],
      neutralBuildingPhase: true,
    })
    const c62a = control(s62, [])

    // at this point, we should have BUILD, BUY_PLOT, BUY_DISTRICT, and CONVERT
    // but not have COMMIT. need to build all remaining buildings.
    expect(c62a.completion).toStrictEqual(['BUILD', 'BUY_PLOT', 'BUY_DISTRICT', 'CONVERT'])
    expect(c62a.completion).not.toContain('COMMIT')

    const c62b = control(s62, ['BUILD'])
    expect(c62b.completion).toStrictEqual(['G02', 'F08', 'G12'])

    // (0) all buildable from completion
    // (1) free to build if built
    // (2) placed on top of neutral player board
    // (3) placable on top of existing buildings

    const s63 = reducer(s62, ['BUILD', 'G02', '3', '1'])!
    expect(s63.frame).toMatchObject({
      nextUse: NextUseClergy.OnlyPrior,
    })
    const c63a = control(s63, [])
    expect(c63a.completion).toStrictEqual(['BUILD', 'BUY_PLOT', 'BUY_DISTRICT', 'CONVERT'])
    const c63b = control(s63, ['BUILD'])
    expect(c63b.completion).toStrictEqual(['F08', 'G12'])

    const s64 = reducer(s63, ['BUILD', 'F08', '1', '0'])!
    expect(s64.frame).toMatchObject({
      nextUse: NextUseClergy.OnlyPrior,
    })
    const c64a = control(s64, [])
    expect(c64a.completion).toStrictEqual(['BUILD', 'BUY_PLOT', 'BUY_DISTRICT', 'CONVERT'])
    const c64b = control(s64, ['BUILD'])
    expect(c64b.completion).toStrictEqual(['G12'])

    const s65 = reducer(s64, ['BUILD', 'G12', '2', '0'])!
    expect(s63.frame).toMatchObject({
      nextUse: NextUseClergy.OnlyPrior,
    })
    const c65a = control(s65, [])
    expect(c65a.completion).toStrictEqual(['WORK_CONTRACT', 'BUY_PLOT', 'BUY_DISTRICT', 'CONVERT', 'SETTLE', 'COMMIT'])
    const c65b = control(s65, ['WORK_CONTRACT'])
    expect(c65b.completion).toStrictEqual(['G02', 'F08', 'G12'])
    const c65c = control(s65, ['WORK_CONTRACT', 'G12'])
    expect(c65c.completion).toContain('Pn')

    expect(s65.frame).toMatchObject({
      bonusActions: ['SETTLE', 'COMMIT'],
      bonusRoundPlacement: false,
      canBuyLandscape: true,
      mainActionUsed: true,
      neutralBuildingPhase: true,
      nextUse: NextUseClergy.OnlyPrior,
      usableBuildings: ['G02', 'F08', 'G12'],
    })
    expect(s65.players![0]).toMatchObject({
      penny: 3,
      bread: 5,
      coal: 3,
    })
    expect(s65.players![1]).toMatchObject({
      clergy: ['LB2W', 'PRIW'],
    })

    const s65b = reducer(s65, ['WORK_CONTRACT', 'G12', 'Pn'])!
    expect(s65b.players![1]).toMatchObject({
      clergy: ['LB2W'],
      landscape: [
        [[], [], ['P', 'G13', 'LB1W'], ['P', 'F08'], ['P', 'G12', 'PRIW'], ['P'], ['H', 'LW1'], [], []],
        [[], [], ['P'], ['P'], ['P', 'LW2'], ['P', 'G02'], ['P', 'LW3'], [], []],
      ],
    })
    expect(s65b.frame).toMatchObject({
      usableBuildings: ['G12'],
      neutralBuildingPhase: true,
      nextUse: 'free',
    })

    const s66 = reducer(s65b, ['USE', 'G12', 'BrBrBrPnCoCo'])!
    expect(s66.frame).toMatchObject({
      usableBuildings: [],
      neutralBuildingPhase: false, // after an optional USE (with prior), we are implicitly out of neutral building phase
    })
    expect(s66.players![1]).toMatchObject({
      clergy: ['LB2W'],
      landscape: [
        [[], [], ['P', 'G13', 'LB1W'], ['P', 'F08'], ['P', 'G12', 'PRIW'], ['P'], ['H', 'LW1'], [], []],
        [[], [], ['P'], ['P'], ['P', 'LW2'], ['P', 'G02'], ['P', 'LW3'], [], []],
      ],
    })
    expect(s66.players![0]).toMatchObject({
      settlements: ['SG1', 'SG2', 'SG3', 'SG4'],
    })
    expect(s66.players![1]).toMatchObject({
      settlements: [],
    })

    const c66a = control(s66, [])
    expect(c66a.completion).toStrictEqual(['BUY_PLOT', 'BUY_DISTRICT', 'CONVERT', 'SETTLE', 'COMMIT'])
    const c66b = control(s66, ['SETTLE'])
    expect(c66b.completion).toStrictEqual(['SG1', 'SG2', 'SG3', 'SG4'])
    const c66c = control(s66, ['SETTLE', 'SG2'])
    expect(c66c.completion).toStrictEqual(['1 0', '3 0', '0 2', '-1 3', '1 3', '3 3', '4 3'])
    const c66d = control(s66, ['SETTLE', 'SG2', '3', '3'])
    expect(c66d.completion).toContain('BrCo')
    const c66e = control(s66, ['SETTLE', 'SG2', '3', '3', 'BrCo'])
    expect(c66e.completion).toStrictEqual([''])

    const s67 = reducer(s66, ['SETTLE', 'SG2', '3', '3', 'BrCo'])!
    const c67a = control(s67, [])
    expect(c67a.completion).toStrictEqual(['BUY_PLOT', 'BUY_DISTRICT', 'CONVERT', 'COMMIT'])

    const s68 = reducer(s67, ['COMMIT'])!
    expect(s68.buildings).toStrictEqual(['F15', 'G16', 'F17', 'G18', 'G19'])
    expect(s68.frame).toMatchObject({
      mainActionUsed: false,
      bonusActions: [],
      nextUse: 'any',
      usableBuildings: [],
    })
  })
})

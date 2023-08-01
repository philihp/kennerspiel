import { control } from '..'
import { reducer } from '../reducer'
import { initialState } from '../state'
import { GameStatePlaying, GameStateSetup } from '../types'

describe('game 21872', () => {
  it('runs through moves', () => {
    const s01 = initialState
    const s02 = reducer(s01, ['CONFIG', '4', 'france', 'long'])! as GameStateSetup
    const s03 = reducer(s02, ['START', '41303', 'W', 'B', 'G', 'R'])! as GameStatePlaying
    expect(s03.buildings).toContain('G07')
    expect(s03.players[0].color).toBe('R')
    expect(s03.players[1].color).toBe('G')
    expect(s03.players[2].color).toBe('B')
    expect(s03.players[3].color).toBe('W')
    expect(s03.rondel).toMatchObject({
      clay: 0,
      coin: 0,
      grain: 0,
      grape: undefined,
      joker: 0,
      peat: 0,
      stone: undefined,
      sheep: 0,
      wood: 0,
      pointingBefore: 1,
    })

    const s04 = reducer(s03, ['USE', 'LR3'])! as GameStatePlaying
    expect(s04.frame).toMatchObject({
      activePlayerIndex: 0,
    })
    const s05 = reducer(s04, ['BUY_DISTRICT', '2', 'PLAINS'])! as GameStatePlaying
    expect(s05.frame).toMatchObject({
      activePlayerIndex: 0,
    })
    const s06 = reducer(s05, ['COMMIT'])! as GameStatePlaying
    expect(s06.frame).toMatchObject({
      activePlayerIndex: 1,
    })
    const s07 = reducer(s06, ['USE', 'LG3', 'Jo'])! as GameStatePlaying
    expect(s07.frame).toMatchObject({
      activePlayerIndex: 1,
    })
    expect(s07.players[1].clergy).toStrictEqual(['LB2G', 'PRIG'])
    const s08 = reducer(s07, ['COMMIT'])! as GameStatePlaying
    expect(s08.frame).toMatchObject({
      activePlayerIndex: 2,
    })
    const s09 = reducer(s08, ['FELL_TREES', '2', '0'])! as GameStatePlaying
    expect(s09.frame).toMatchObject({
      activePlayerIndex: 2,
    })
    const s10 = reducer(s09, ['COMMIT'])! as GameStatePlaying
    expect(s10.frame).toMatchObject({
      activePlayerIndex: 3,
    })
    const s11 = reducer(s10, ['USE', 'LW1'])! as GameStatePlaying
    expect(s11.frame).toMatchObject({
      activePlayerIndex: 3,
    })
    const s12 = reducer(s11, ['COMMIT'])! as GameStatePlaying
    expect(s12.frame).toMatchObject({
      activePlayerIndex: 0,
    })
    const s13 = reducer(s12, ['BUILD', 'G01', '3', '1'])! as GameStatePlaying
    expect(s13.frame).toMatchObject({
      activePlayerIndex: 0,
    })
    const s14 = reducer(s13, ['COMMIT'])! as GameStatePlaying
    expect(s14.frame).toMatchObject({
      activePlayerIndex: 1,
    })
    const s15 = reducer(s14, ['BUILD', 'F09', '3', '1'])! as GameStatePlaying
    expect(s15.frame).toMatchObject({
      activePlayerIndex: 1,
    })
    const s16 = reducer(s15, ['USE', 'F09'])! as GameStatePlaying
    expect(s16.frame).toMatchObject({
      activePlayerIndex: 1,
    })
    const s17 = reducer(s16, ['USE', 'LG2', 'Sh'])! as GameStatePlaying
    expect(s17.players[1].clergy).toStrictEqual(['LB2G'])
    expect(s17.frame).toMatchObject({
      activePlayerIndex: 1,
    })
    const s18 = reducer(s17, ['COMMIT'])! as GameStatePlaying
    expect(s18.frame).toMatchObject({
      activePlayerIndex: 2,
    })
    const s19 = reducer(s18, ['CUT_PEAT', '0', '0'])! as GameStatePlaying
    expect(s19.frame).toMatchObject({
      activePlayerIndex: 2,
    })
    const s20 = reducer(s19, ['COMMIT'])! as GameStatePlaying
    expect(s20.frame).toMatchObject({
      activePlayerIndex: 3,
    })
    const s21 = reducer(s20, ['FELL_TREES', '1', '0'])! as GameStatePlaying
    expect(s21.frame).toMatchObject({
      activePlayerIndex: 3,
    })
    const s22 = reducer(s21, ['COMMIT'])! as GameStatePlaying
    expect(s22.frame).toMatchObject({
      activePlayerIndex: 0,
    })
    const s23 = reducer(s22, ['USE', 'G01'])! as GameStatePlaying
    expect(s23.frame).toMatchObject({
      activePlayerIndex: 0,
    })
    const s24 = reducer(s23, ['USE', 'F09'])! as GameStatePlaying
    expect(s24.frame).toMatchObject({
      activePlayerIndex: 0,
    })
    const s25 = reducer(s24, ['USE', 'LG2', 'Gn'])! as GameStatePlaying
    expect(s25.frame).toMatchObject({
      activePlayerIndex: 0,
    })
    const s26 = reducer(s25, ['COMMIT'])! as GameStatePlaying
    expect(s26.frame).toMatchObject({
      activePlayerIndex: 1,
    })
    const s27 = reducer(s26, ['CUT_PEAT', '0', '0', 'Jo'])! as GameStatePlaying
    expect(s27.players[1].clergy).toStrictEqual(['LB2G'])
    expect(s27.frame).toMatchObject({
      activePlayerIndex: 1,
    })
    const s28 = reducer(s27, ['COMMIT'])! as GameStatePlaying
    expect(s28.frame).toMatchObject({
      activePlayerIndex: 2,
    })
    const s29 = reducer(s28, ['USE', 'LB1'])! as GameStatePlaying
    expect(s29.frame).toMatchObject({
      activePlayerIndex: 2,
    })
    const s30 = reducer(s29, ['COMMIT'])! as GameStatePlaying
    expect(s30.frame).toMatchObject({
      activePlayerIndex: 3,
    })
    const s31 = reducer(s30, ['BUILD', 'G02', '3', '1'])! as GameStatePlaying
    expect(s31.frame).toMatchObject({
      activePlayerIndex: 3,
    })
    const s32 = reducer(s31, ['USE', 'G02', 'ClPnGn', 'Pn'])! as GameStatePlaying
    expect(s32.frame).toMatchObject({
      activePlayerIndex: 3,
    })
    const s33 = reducer(s32, ['BUY_DISTRICT', '-1', 'PLAINS'])! as GameStatePlaying
    expect(s33.frame).toMatchObject({
      activePlayerIndex: 3,
    })
    expect(s33.buildings).toContain('G07')

    const s34 = reducer(s33, ['COMMIT'])! as GameStatePlaying
    expect(s34.frame).toMatchObject({
      activePlayerIndex: 0,
    })
    const s35 = reducer(s34, ['USE', 'LR1', 'Jo'])! as GameStatePlaying
    expect(s35.frame).toMatchObject({
      activePlayerIndex: 0,
    })
    const s36 = reducer(s35, ['COMMIT'])! as GameStatePlaying
    expect(s36.frame).toMatchObject({
      activePlayerIndex: 1,
    })
    const s37 = reducer(s36, ['BUILD', 'G12', '0', '0'])! as GameStatePlaying
    expect(s37.players[1].clergy).toStrictEqual(['LB2G'])
    expect(s37.frame).toMatchObject({
      activePlayerIndex: 1,
      next: 16,
    })
    const s38 = reducer(s37, ['COMMIT'])! as GameStatePlaying
    expect(s38.frame).toMatchObject({
      activePlayerIndex: 2,
      next: 17,
    })
    const s39 = reducer(s38, ['USE', 'LB3'])! as GameStatePlaying
    const s40 = reducer(s39, ['BUY_DISTRICT', '-1', 'HILLS'])! as GameStatePlaying
    const s41 = reducer(s40, ['COMMIT'])! as GameStatePlaying
    expect(s41.frame).toMatchObject({
      activePlayerIndex: 3,
      next: 18,
    })

    const s42 = reducer(s41, ['USE', 'LW2', 'Gn'])! as GameStatePlaying
    const s43 = reducer(s42, ['COMMIT'])! as GameStatePlaying
    expect(s43.frame).toMatchObject({
      activePlayerIndex: 0,
      next: 19,
    })

    const s45 = reducer(s43, ['FELL_TREES', '2', '0'])! as GameStatePlaying
    const s46 = reducer(s45, ['COMMIT'])! as GameStatePlaying
    expect(s46.frame).toMatchObject({
      activePlayerIndex: 1,
      next: 20,
    })
    const s47 = reducer(s46, ['USE', 'G12', 'PtPtShShShSh'])! as GameStatePlaying
    expect(s47.players[1].clergy).toStrictEqual([])
    const s48 = reducer(s47, ['COMMIT'])! as GameStatePlaying
    expect(s48.players[1].clergy).toStrictEqual([])
    expect(s48.frame).toMatchObject({
      activePlayerIndex: 2,
      next: 21,
    })
    const s49 = reducer(s48, ['BUILD', 'F04', '3', '-1'])! as GameStatePlaying
    const s50 = reducer(s49, ['COMMIT'])! as GameStatePlaying
    expect(s50.players[1].clergy).toStrictEqual([])
    expect(s50.frame).toMatchObject({
      activePlayerIndex: 3,
      next: 22,
    })
    const s51 = reducer(s50, ['BUILD', 'G13', '1', '0'])! as GameStatePlaying
    const s52 = reducer(s51, ['COMMIT'])! as GameStatePlaying
    expect(s52.players[1].clergy).toStrictEqual(['LB1G', 'LB2G', 'PRIG'])
    expect(s52.frame).toMatchObject({
      activePlayerIndex: 0,
      next: 23,
    })
    const s53 = reducer(s52, ['CONVERT', 'Gn'])! as GameStatePlaying
    const s54 = reducer(s53, ['BUILD', 'F05', '2', '0'])! as GameStatePlaying
    const s55 = reducer(s54, ['COMMIT'])! as GameStatePlaying
    expect(s55.frame).toMatchObject({
      activePlayerIndex: 1,
    })
    const s56 = reducer(s55, ['CUT_PEAT', '0', '1'])! as GameStatePlaying
    const s57 = reducer(s56, ['COMMIT'])! as GameStatePlaying
    expect(s57.players[1].clergy).toStrictEqual(['LB1G', 'LB2G', 'PRIG'])
    expect(s57.frame).toMatchObject({
      activePlayerIndex: 2,
    })
    const s58 = reducer(s57, ['USE', 'LB2', 'Sh'])! as GameStatePlaying
    const s59 = reducer(s58, ['COMMIT'])! as GameStatePlaying
    expect(s59.frame).toMatchObject({
      activePlayerIndex: 3,
    })
    const s60 = reducer(s59, ['USE', 'G13', 'PnPn'])! as GameStatePlaying
    const s61 = reducer(s60, ['COMMIT'])! as GameStatePlaying
    expect(s61.players[1].clergy).toStrictEqual(['LB1G', 'LB2G', 'PRIG'])
    expect(s61.frame).toMatchObject({
      activePlayerIndex: 0,
    })
    const s62 = reducer(s61, ['USE', 'LR1'])! as GameStatePlaying
    const s63 = reducer(s62, ['COMMIT'])! as GameStatePlaying
    expect(s63.players[1].clergy).toStrictEqual(['LB1G', 'LB2G', 'PRIG'])
    expect(s63.frame).toMatchObject({
      activePlayerIndex: 1,
    })
    const s64 = reducer(s63, ['USE', 'F09'])! as GameStatePlaying
    const s65 = reducer(s64, ['USE', 'LG3', 'Jo'])! as GameStatePlaying
    const s66 = reducer(s65, ['BUY_DISTRICT', '2', 'PLAINS'])! as GameStatePlaying
    const s67 = reducer(s66, ['COMMIT'])! as GameStatePlaying
    expect(s67.players[1].clergy).toStrictEqual(['LB2G', 'PRIG'])
    expect(s67.frame).toMatchObject({
      activePlayerIndex: 2,
    })
    const s68 = reducer(s67, ['USE', 'LB3'])! as GameStatePlaying
    const s69 = reducer(s68, ['BUY_PLOT', '-1', 'MOUNTAIN'])! as GameStatePlaying
    const s70 = reducer(s69, ['COMMIT'])! as GameStatePlaying
    expect(s70.players[1].clergy).toStrictEqual(['LB2G', 'PRIG'])
    expect(s70.frame).toMatchObject({
      activePlayerIndex: 3,
    })
    const s71 = reducer(s70, ['USE', 'LW2', 'Gn'])! as GameStatePlaying
    const s72 = reducer(s71, ['COMMIT'])! as GameStatePlaying
    expect(s72.players[1].clergy).toStrictEqual(['LB2G', 'PRIG'])
    expect(s72.frame).toMatchObject({
      activePlayerIndex: 0,
    })
    const s73 = reducer(s72, ['FELL_TREES', '1', '1'])! as GameStatePlaying
    const s74 = reducer(s73, ['COMMIT'])! as GameStatePlaying
    expect(s74.players[1].clergy).toStrictEqual(['LB2G', 'PRIG'])
    expect(s74.frame).toMatchObject({
      activePlayerIndex: 1,
    })
    const s75 = reducer(s74, ['BUILD', 'F08', '1', '2'])! as GameStatePlaying
    const s76 = reducer(s75, ['USE', 'F08', 'ClGpPtGn'])! as GameStatePlaying
    const s77 = reducer(s76, ['BUY_PLOT', '0', 'MOUNTAIN'])! as GameStatePlaying
    const s78 = reducer(s77, ['COMMIT'])! as GameStatePlaying
    expect(s78.players[1].clergy).toStrictEqual(['LB2G'])
    expect(s78.buildings).toContain('G07')
    expect(s78.frame).toMatchObject({
      activePlayerIndex: 2,
    })

    const s79 = reducer(s78, ['SETTLE', 'SB3', '3', '0', 'ShShShSh'])! as GameStatePlaying
    const s80 = reducer(s79, ['COMMIT'])! as GameStatePlaying
    expect(s80.frame).toMatchObject({
      activePlayerIndex: 3,
    })

    const s81 = reducer(s80, ['SETTLE', 'SW1', '2', '-1', 'WoGn'])! as GameStatePlaying
    const s82 = reducer(s81, ['COMMIT'])! as GameStatePlaying
    expect(s82.frame).toMatchObject({
      activePlayerIndex: 0,
    })

    const s83 = reducer(s82, ['SETTLE', 'SR2', '3', '0', 'ShGnPtWo'])! as GameStatePlaying
    const s84 = reducer(s83, ['COMMIT'])! as GameStatePlaying
    expect(s84.players[1].clergy).toStrictEqual(['LB2G'])
    expect(s84.frame).toMatchObject({
      activePlayerIndex: 1,
    })

    const s85 = reducer(s84, ['SETTLE', 'SG1', '2', '2', 'GpPt'])! as GameStatePlaying
    const s86 = reducer(s85, ['COMMIT'])! as GameStatePlaying
    expect(s86.frame).toMatchObject({
      activePlayerIndex: 2,
    })

    const s87 = reducer(s86, ['USE', 'LB1'])! as GameStatePlaying
    const s88 = reducer(s87, ['COMMIT'])! as GameStatePlaying
    expect(s88.frame).toMatchObject({
      activePlayerIndex: 3,
    })

    const s89 = reducer(s88, ['BUILD', 'F15', '1', '-1'])! as GameStatePlaying
    const s90 = reducer(s89, ['USE', 'F15', 'Pn'])! as GameStatePlaying
    const s91 = reducer(s90, ['COMMIT'])! as GameStatePlaying
    expect(s91.frame).toMatchObject({
      activePlayerIndex: 0,
    })

    const s92 = reducer(s91, ['USE', 'G01'])! as GameStatePlaying
    const s93 = reducer(s92, ['USE', 'F15', 'Pn'])! as GameStatePlaying
    const s94 = reducer(s93, ['COMMIT'])! as GameStatePlaying
    expect(s94.players[1].clergy).toStrictEqual(['LB2G'])
    expect(s94.frame).toMatchObject({
      activePlayerIndex: 1,
    })

    const s95 = reducer(s94, ['USE', 'LG2', 'Sh'])! as GameStatePlaying
    const s96 = reducer(s95, ['COMMIT'])! as GameStatePlaying
    expect(s96.frame).toMatchObject({
      activePlayerIndex: 2,
    })
    expect(s96.rondel).toStrictEqual({
      clay: 7,
      coin: 6,
      grain: 6,
      joker: 6,
      peat: 5,
      pointingBefore: 7,
      sheep: 7,
      wood: 6,
      stone: undefined,
      grape: undefined,
    })

    const s97 = reducer(s96, ['CONVERT', 'Gn'])! as GameStatePlaying
    const s98 = reducer(s97, ['BUILD', 'G16', '3', '1'])! as GameStatePlaying
    const s9X = reducer(s98, ['WITH_PRIOR'])! as GameStatePlaying
    const s99 = reducer(s9X, ['USE', 'G16'])! as GameStatePlaying
    const s100 = reducer(s99, ['COMMIT'])! as GameStatePlaying
    expect(s100.frame).toMatchObject({
      activePlayerIndex: 3,
      next: 43,
    })
    expect(s100.rondel).toStrictEqual({
      clay: 7,
      coin: 6,
      grain: 6,
      joker: 6,
      peat: 5,
      pointingBefore: 8,
      sheep: 7,
      wood: 6,
      stone: undefined,
      grape: 7,
    })

    const s101 = reducer(s100, ['USE', 'G02', 'SwGnWo', 'Pn'])! as GameStatePlaying
    const s102 = reducer(s101, ['COMMIT'])! as GameStatePlaying
    expect(s102.frame).toMatchObject({
      activePlayerIndex: 0,
    })
    expect(s102.rondel).toStrictEqual({
      clay: 7,
      coin: 6,
      grain: 6,
      joker: 6,
      peat: 5,
      pointingBefore: 8,
      sheep: 7,
      wood: 6,
      stone: undefined,
      grape: 7,
    })

    const s103 = reducer(s102, ['CUT_PEAT', '0', '0'])! as GameStatePlaying
    expect(s103.players[0].peat).toBe(4)
    expect(s103.rondel).toMatchObject({
      peat: 8,
      pointingBefore: 8,
    })
    const s104 = reducer(s103, ['COMMIT'])! as GameStatePlaying
    expect(s104.players[1].clergy).toStrictEqual(['LB1G', 'LB2G', 'PRIG'])
    expect(s104.frame).toMatchObject({
      activePlayerIndex: 1,
    })

    const s105 = reducer(s104, ['USE', 'F09'])! as GameStatePlaying
    const s106 = reducer(s105, ['USE', 'LG2', 'JoGn'])! as GameStatePlaying
    const s107 = reducer(s106, ['COMMIT'])! as GameStatePlaying
    expect(s107.frame).toMatchObject({
      activePlayerIndex: 2,
    })

    const s108 = reducer(s107, ['USE', 'G16'])! as GameStatePlaying
    const s109 = reducer(s108, ['COMMIT'])! as GameStatePlaying
    expect(s109.frame).toMatchObject({
      activePlayerIndex: 3,
    })

    const s110 = reducer(s109, ['FELL_TREES', '2', '0'])! as GameStatePlaying
    const s111 = reducer(s110, ['COMMIT'])! as GameStatePlaying
    expect(s111.frame).toMatchObject({
      activePlayerIndex: 0,
    })

    const s112 = reducer(s111, ['BUILD', 'G07', '1', '2'])! as GameStatePlaying
    const s113 = reducer(s112, ['USE', 'G07', 'PtPtPtPt'])! as GameStatePlaying
    const s114 = reducer(s113, ['COMMIT'])! as GameStatePlaying
    expect(s114.players[1].clergy).toStrictEqual(['LB2G', 'PRIG'])
    expect(s114.frame).toMatchObject({
      activePlayerIndex: 1,
    })

    const s115 = reducer(s114, ['USE', 'LG3'])! as GameStatePlaying
    const s116 = reducer(s115, ['COMMIT'])! as GameStatePlaying
    expect(s116.frame).toMatchObject({
      activePlayerIndex: 2,
      next: 50,
    })

    const s117 = reducer(s116, ['USE', 'LB2', 'Gn'])! as GameStatePlaying
    const s118 = reducer(s117, ['COMMIT'])! as GameStatePlaying
    expect(s118.frame).toMatchObject({
      activePlayerIndex: 3,
      next: 51,
    })
    const s119 = reducer(s118, ['USE', 'G13', 'PnPn'])! as GameStatePlaying
    const s120 = reducer(s119, ['COMMIT'])! as GameStatePlaying
    expect(s120.frame).toMatchObject({
      activePlayerIndex: 0,
      next: 52,
    })

    const s121 = reducer(s120, ['BUILD', 'F14', '4', '2'])! as GameStatePlaying
    const s122 = reducer(s121, ['COMMIT'])! as GameStatePlaying
    expect(s122.players[1].clergy).toStrictEqual(['PRIG'])
    expect(s122.frame).toMatchObject({
      activePlayerIndex: 1,
      next: 53,
    })

    const s123 = reducer(s122, ['SETTLE', 'SG5', '4', '2', 'BrShPt'])! as GameStatePlaying
    const s124 = reducer(s123, ['COMMIT'])! as GameStatePlaying
    expect(s124.frame).toMatchObject({
      activePlayerIndex: 2,
      next: 54,
    })

    const s125 = reducer(s124, ['SETTLE', 'SB5', '2', '0', 'PtShShSh'])! as GameStatePlaying
    const s126 = reducer(s125, ['COMMIT'])! as GameStatePlaying
    expect(s126.frame).toMatchObject({
      activePlayerIndex: 3,
      next: 55,
    })

    const s127 = reducer(s126, ['SETTLE', 'SW5', '4', '-1', 'WoShBr'])! as GameStatePlaying
    const s128 = reducer(s127, ['COMMIT'])! as GameStatePlaying
    expect(s128.frame).toMatchObject({
      activePlayerIndex: 0,
      next: 56,
    })

    const s129 = reducer(s128, ['SETTLE', 'SR5', '3', '2', 'WoBrGnGn'])! as GameStatePlaying
    const s130 = reducer(s129, ['COMMIT'])! as GameStatePlaying
    expect(s130.players[1].clergy).toStrictEqual(['PRIG'])
    expect(s130.frame).toMatchObject({
      activePlayerIndex: 1,
      startingPlayer: 1,
      next: 57,
    })

    const s131 = reducer(s130, ['BUILD', 'G22', '6', '0'])! as GameStatePlaying
    const s132 = reducer(s131, ['USE', 'G22', 'Jo'])! as GameStatePlaying
    const s133 = reducer(s132, ['COMMIT'])! as GameStatePlaying
    expect(s133.frame).toMatchObject({
      activePlayerIndex: 2,
      next: 58,
    })

    const s13X = reducer(s133, ['WITH_PRIOR'])! as GameStatePlaying
    const s134 = reducer(s13X, ['USE', 'F04', 'GnGnGnGnGnGn'])! as GameStatePlaying
    const s135 = reducer(s134, ['COMMIT'])! as GameStatePlaying
    expect(s135.frame).toMatchObject({
      activePlayerIndex: 3,
      next: 59,
    })

    const s136 = reducer(s135, ['CONVERT', 'Gn'])! as GameStatePlaying
    const s137 = reducer(s136, ['BUILD', 'F21', '2', '0'])! as GameStatePlaying
    const s138 = reducer(s137, ['USE', 'F21', 'GpGpWn'])! as GameStatePlaying
    const s139 = reducer(s138, ['BUY_PLOT', '-2', 'MOUNTAIN'])! as GameStatePlaying
    const s140 = reducer(s139, ['COMMIT'])! as GameStatePlaying
    expect(s140.frame).toMatchObject({
      activePlayerIndex: 0,
      next: 60,
    })

    const s141 = reducer(s140, ['USE', 'G01'])! as GameStatePlaying
    const s142 = reducer(s141, ['USE', 'F21', 'GpGpGpWn'])! as GameStatePlaying
    const s143 = reducer(s142, ['COMMIT'])! as GameStatePlaying
    expect(s143.players[1].clergy).toStrictEqual([])
    expect(s143.frame).toMatchObject({
      activePlayerIndex: 1,
      next: 61,
    })

    const s144 = reducer(s143, ['FELL_TREES', '0', '2'])! as GameStatePlaying
    const s145 = reducer(s144, ['COMMIT'])! as GameStatePlaying
    expect(s145.players[1].clergy).toStrictEqual(['LB1G', 'LB2G', 'PRIG'])
    expect(s145.frame).toMatchObject({
      activePlayerIndex: 2,
      startingPlayer: 2,
      next: 62,
    })

    const s146 = reducer(s145, ['WORK_CONTRACT', 'F05', 'PnPn'])! as GameStatePlaying
    const c146 = control(s146, [])
    expect(s146.frame).toMatchObject({
      activePlayerIndex: 0,
      currentPlayerIndex: 2,
    })
    expect(c146.completion).toHaveLength(2)
    expect(c146.completion).toContain('WITH_LAYBROTHER')
    expect(c146.completion).toContain('WITH_PRIOR')

    const s147 = reducer(s146, ['WITH_LAYBROTHER'])! as GameStatePlaying
    const s148 = reducer(s147, ['USE', 'F05', 'FlFlFlFlFlFlPtPtBrBr'])! as GameStatePlaying
    const s149 = reducer(s148, ['COMMIT'])! as GameStatePlaying
    expect(s149.frame).toMatchObject({
      activePlayerIndex: 3,
      next: 63,
    })

    const s150 = reducer(s149, ['CONVERT', 'GnGn'])! as GameStatePlaying
    const s151 = reducer(s150, ['BUY_DISTRICT', '-2', 'PLAINS'])! as GameStatePlaying
    const s152 = reducer(s151, ['BUILD', 'F20', '2', '-2'])! as GameStatePlaying
    const s153 = reducer(s152, ['USE', 'F20', 'PnWn'])! as GameStatePlaying
    const s154 = reducer(s153, ['COMMIT'])! as GameStatePlaying
    expect(s154.frame).toMatchObject({
      activePlayerIndex: 0,
      next: 64,
    })

    const s155 = reducer(s154, ['BUY_PLOT', '0', 'COAST'])! as GameStatePlaying
    const s156 = reducer(s155, ['USE', 'LR2', 'Sh'])! as GameStatePlaying
    const s157 = reducer(s156, ['COMMIT'])! as GameStatePlaying
    expect(s157.players[1].clergy).toStrictEqual(['LB1G', 'LB2G', 'PRIG'])
    expect(s157.frame).toMatchObject({
      activePlayerIndex: 1,
      next: 65,
    })

    const s158 = reducer(s157, ['USE', 'LG1'])! as GameStatePlaying
    const s159 = reducer(s158, ['COMMIT'])! as GameStatePlaying
    expect(s159.frame).toMatchObject({
      activePlayerIndex: 2,
      next: 66,
    })

    const s160 = reducer(s159, ['BUY_PLOT', '1', 'MOUNTAIN'])! as GameStatePlaying
    expect(s160.players[1].clergy).toStrictEqual(['LB2G', 'PRIG'])
    const s161 = reducer(s160, ['WORK_CONTRACT', 'G12', 'PnPn'])! as GameStatePlaying
    const s162 = reducer(s161, ['WITH_LAYBROTHER'])! as GameStatePlaying
    expect(s162.players[1].clergy).toStrictEqual(['PRIG'])
    const s163 = reducer(s162, ['USE', 'G12', 'BrBrBrPnPtPtSwSw'])! as GameStatePlaying
    const s164 = reducer(s163, ['COMMIT'])! as GameStatePlaying
    expect(s164.frame).toMatchObject({
      activePlayerIndex: 3,
      startingPlayer: 3,
      next: 67,
    })

    const s165 = reducer(s164, ['USE', 'G13', 'PnPn'])! as GameStatePlaying
    const s166 = reducer(s165, ['COMMIT'])! as GameStatePlaying
    expect(s166.frame).toMatchObject({
      activePlayerIndex: 0,
      currentPlayerIndex: 0,
      next: 68,
    })

    const s167 = reducer(s166, ['CONVERT', 'Ni'])! as GameStatePlaying
    expect(s167.players[1].clergy).toStrictEqual(['PRIG'])
    expect(s167.players[1].landscape[0][8]).toStrictEqual(['M', 'G22'])
    const s168 = reducer(s167, ['WORK_CONTRACT', 'G22', 'PnPn'])! as GameStatePlaying
    expect(s168.frame).toMatchObject({
      activePlayerIndex: 0,
      currentPlayerIndex: 0,
    })
    // this cant happen because player '1' only has a PRIOR, so activity never went to her
    // const s169 = reducer(s168, ['WITH_LAYBROTHER'])! as GameStatePlaying
    const s170 = reducer(s168, ['USE', 'G22', 'Jo'])! as GameStatePlaying
    const s171 = reducer(s170, ['COMMIT'])! as GameStatePlaying
    expect(s171.frame).toMatchObject({
      activePlayerIndex: 1,
      next: 69,
    })

    const s172 = reducer(s171, ['BUILD', 'F24', '3', '2'])! as GameStatePlaying
    const s173 = reducer(s172, ['COMMIT'])! as GameStatePlaying
    expect(s173.frame).toMatchObject({
      activePlayerIndex: 2,
      next: 70,
    })

    const s174 = reducer(s173, ['BUILD', 'F17', '5', '1'])! as GameStatePlaying
    const s17X = reducer(s174, ['WITH_PRIOR'])! as GameStatePlaying
    const s175 = reducer(s17X, ['USE', 'F17', 'PnBo'])! as GameStatePlaying
    const s176 = reducer(s175, ['COMMIT'])! as GameStatePlaying
    expect(s176.frame).toMatchObject({
      activePlayerIndex: 3,
      next: 71,
    })

    const s177 = reducer(s176, ['USE', 'F15', 'Pn'])! as GameStatePlaying
    const s178 = reducer(s177, ['COMMIT'])! as GameStatePlaying
    expect(s178.frame).toMatchObject({
      activePlayerIndex: 0,
      next: 72,
    })

    const s179 = reducer(s178, ['USE', 'LR2', 'Gn'])! as GameStatePlaying
    const s180 = reducer(s179, ['COMMIT'])! as GameStatePlaying
    expect(s180.frame).toMatchObject({
      activePlayerIndex: 1,
      next: 73,
    })

    const s181 = reducer(s180, ['BUY_DISTRICT', '3', 'HILLS'])! as GameStatePlaying
    const s182 = reducer(s181, ['CUT_PEAT', '0', '3'])! as GameStatePlaying
    const s183 = reducer(s182, ['COMMIT'])! as GameStatePlaying
    expect(s183.frame).toMatchObject({
      activePlayerIndex: 2,
      next: 74,
    })

    const s184 = reducer(s183, ['FELL_TREES', '2', '-1'])! as GameStatePlaying
    const s185 = reducer(s184, ['COMMIT'])! as GameStatePlaying
    expect(s185.frame).toMatchObject({
      activePlayerIndex: 3,
      next: 75,
    })

    const s186 = reducer(s185, ['BUILD', 'F25', '3', '-1'])! as GameStatePlaying
    const s187 = reducer(s186, ['COMMIT'])! as GameStatePlaying
    expect(s187.frame).toMatchObject({
      activePlayerIndex: 0,
      next: 76,
    })

    const s188 = reducer(s187, ['BUILD', 'F11', '-1', '0'])! as GameStatePlaying
    const s189 = reducer(s188, ['USE', 'F11'])! as GameStatePlaying
    const s190 = reducer(s189, ['COMMIT'])! as GameStatePlaying
    expect(s190.frame).toMatchObject({
      activePlayerIndex: 1,
      next: 77,
    })

    const s191 = reducer(s190, ['USE', 'F09'])! as GameStatePlaying
    const s192 = reducer(s191, ['USE', 'LG3'])! as GameStatePlaying
    const s193 = reducer(s192, ['COMMIT'])! as GameStatePlaying
    expect(s193.frame).toMatchObject({
      activePlayerIndex: 2,
      next: 78,
    })

    const s194 = reducer(s193, ['BUILD', 'G18', '5', '2'])! as GameStatePlaying
    const s195 = reducer(s194, ['COMMIT'])! as GameStatePlaying
    expect(s195.frame).toMatchObject({
      activePlayerIndex: 3,
      next: 79,
    })
    expect(s195.players[1].landscape[0][8]).toStrictEqual(['M', 'G22'])
    expect(s195.players[1].clergy).toStrictEqual(['LB2G', 'PRIG'])

    const s19X = reducer(s195, ['CONVERT', 'Ni'])! as GameStatePlaying
    const s196 = reducer(s19X, ['WORK_CONTRACT', 'G22', 'PnPn'])! as GameStatePlaying
    expect(s196.frame).toMatchObject({
      activePlayerIndex: 1,
      currentPlayerIndex: 3,
    })
    const s197 = reducer(s196, ['WITH_LAYBROTHER'])! as GameStatePlaying
    const s198 = reducer(s197, ['USE', 'G22', 'Jo'])! as GameStatePlaying
    const s199 = reducer(s198, ['COMMIT'])! as GameStatePlaying
    expect(s199.frame).toMatchObject({
      activePlayerIndex: 0,
      next: 80,
    })

    const s200 = reducer(s199, ['WORK_CONTRACT', 'F04', 'Wn'])! as GameStatePlaying
    const s202 = reducer(s200, ['USE', 'F04', 'GnGnGnGnGn'])! as GameStatePlaying
    const s203 = reducer(s202, ['COMMIT'])! as GameStatePlaying
    expect(s203.frame).toMatchObject({
      activePlayerIndex: 1,
      next: 81,
    })

    const s204 = reducer(s203, ['CONVERT', 'Gn'])! as GameStatePlaying
    const s205 = reducer(s204, ['BUILD', 'F23', '5', '1'])! as GameStatePlaying
    const s206 = reducer(s205, ['USE', 'F23', 'Pn'])! as GameStatePlaying
    const s207 = reducer(s206, ['COMMIT'])! as GameStatePlaying
    expect(s207.frame).toMatchObject({
      activePlayerIndex: 2,
      next: 82,
    })

    const s208 = reducer(s207, ['CUT_PEAT', '0', '-1'])! as GameStatePlaying
    const s209 = reducer(s208, ['COMMIT'])! as GameStatePlaying
    expect(s209.frame).toMatchObject({
      activePlayerIndex: 3,
      next: 83,
    })

    const s210 = reducer(s209, ['USE', 'G02', 'ClPnFl', 'Wo'])! as GameStatePlaying
    const s211 = reducer(s210, ['COMMIT'])! as GameStatePlaying
    expect(s211.frame).toMatchObject({
      activePlayerIndex: 0,
      next: 84,
    })

    const s212 = reducer(s211, ['USE', 'F05', 'FlFlFlFlFlFlFlCoSwBrBr'])! as GameStatePlaying
    const s213 = reducer(s212, ['BUY_PLOT', '0', 'MOUNTAIN'])! as GameStatePlaying
    const s214 = reducer(s213, ['COMMIT'])! as GameStatePlaying
    expect(s214.frame).toMatchObject({
      activePlayerIndex: 1,
      next: 85,
    })

    const s215 = reducer(s214, ['USE', 'F09'])! as GameStatePlaying
    const s216 = reducer(s215, ['USE', 'LG2', 'Sh'])! as GameStatePlaying
    const s217 = reducer(s216, ['COMMIT'])! as GameStatePlaying
    expect(s217.frame).toMatchObject({
      activePlayerIndex: 2,
      next: 86,
    })

    const s218 = reducer(s217, ['USE', 'G16'])! as GameStatePlaying
    const s219 = reducer(s218, ['COMMIT'])! as GameStatePlaying
    expect(s219.frame).toMatchObject({
      activePlayerIndex: 3,
      next: 87,
    })

    const s220 = reducer(s219, ['SETTLE', 'SW2', '3', '0', 'WoPtBr'])! as GameStatePlaying
    const s221 = reducer(s220, ['COMMIT'])! as GameStatePlaying
    expect(s221.frame).toMatchObject({
      activePlayerIndex: 0,
      next: 88,
    })

    const s222 = reducer(s221, ['SETTLE', 'SR4', '-1', '1', 'CoBrBrSh'])! as GameStatePlaying
    const s223 = reducer(s222, ['COMMIT'])! as GameStatePlaying
    expect(s223.frame).toMatchObject({
      activePlayerIndex: 1,
      next: 89,
    })

    const s224 = reducer(s223, ['SETTLE', 'SG3', '0', '2', 'PnPnPnPnPnSh'])! as GameStatePlaying
    const s225 = reducer(s224, ['COMMIT'])! as GameStatePlaying
    expect(s225.frame).toMatchObject({
      activePlayerIndex: 2,
      next: 90,
    })

    const s226 = reducer(s225, ['SETTLE', 'SB6', '5', '0', 'PtPtPtMt'])! as GameStatePlaying
    const s227 = reducer(s226, ['COMMIT'])! as GameStatePlaying
    expect(s227.frame).toMatchObject({
      activePlayerIndex: 3,
      next: 91,
    })

    const s228 = reducer(s227, ['BUILD', 'F31', '4', '-2'])! as GameStatePlaying
    const s229 = reducer(s228, ['USE', 'F31'])! as GameStatePlaying
    const s230 = reducer(s229, ['COMMIT'])! as GameStatePlaying
    expect(s230.frame).toMatchObject({
      activePlayerIndex: 0,
      next: 92,
    })

    const s231 = reducer(s230, ['USE', 'LR1'])! as GameStatePlaying
    expect(s231.players[0]).toMatchObject({
      penny: 2,
      nickel: 1,
    })
    const s232 = reducer(s231, ['BUY_PLOT', '2', 'COAST'])! as GameStatePlaying
    const s233 = reducer(s232, ['COMMIT'])! as GameStatePlaying
    expect(s233.frame).toMatchObject({
      activePlayerIndex: 1,
      next: 93,
    })

    const s234 = reducer(s233, ['USE', 'G22'])! as GameStatePlaying
    const s235 = reducer(s234, ['COMMIT'])! as GameStatePlaying
    expect(s235.frame).toMatchObject({
      activePlayerIndex: 2,
      next: 94,
    })

    const s236 = reducer(s235, ['USE', 'G18', 'ClClClSnPtPt'])! as GameStatePlaying
    const s237 = reducer(s236, ['COMMIT'])! as GameStatePlaying
    expect(s237.frame).toMatchObject({
      activePlayerIndex: 3,
      next: 95,
    })

    const s238 = reducer(s237, ['USE', 'F21', 'GpGpGpGpGpGpGpGpGpWn'])! as GameStatePlaying
    const s239 = reducer(s238, ['COMMIT'])! as GameStatePlaying
    expect(s239.frame).toMatchObject({
      activePlayerIndex: 0,
      next: 96,
    })

    const s240 = reducer(s239, ['BUILD', 'G19', '1', '1'])! as GameStatePlaying
    const s241 = reducer(s240, ['USE', 'G19', 'ShShShShSwSwSwSw'])! as GameStatePlaying
    const s242 = reducer(s241, ['COMMIT'])! as GameStatePlaying
    expect(s242.frame).toMatchObject({
      activePlayerIndex: 1,
      next: 97,
    })

    const s243 = reducer(s242, ['CONVERT', 'GnGn'])! as GameStatePlaying
    const s244 = reducer(s243, ['BUILD', 'F30', '4', '3'])! as GameStatePlaying
    const s245 = reducer(s244, ['USE', 'F30', 'Po'])! as GameStatePlaying
    const s246 = reducer(s245, ['COMMIT'])! as GameStatePlaying
    expect(s246.frame).toMatchObject({
      activePlayerIndex: 2,
      next: 98,
    })

    const s247 = reducer(s246, ['USE', 'G16'])! as GameStatePlaying
    const s248 = reducer(s247, ['COMMIT'])! as GameStatePlaying
    expect(s248.frame).toMatchObject({
      activePlayerIndex: 3,
      next: 99,
    })

    const s249 = reducer(s248, ['BUY_PLOT', '0', 'MOUNTAIN'])! as GameStatePlaying
    const s250 = reducer(s249, ['BUILD', 'F32', '5', '1'])! as GameStatePlaying
    const s251 = reducer(s250, ['USE', 'F32', 'Pn'])! as GameStatePlaying
    const s252 = reducer(s251, ['FELL_TREES', '0', '-2'])! as GameStatePlaying
    const s253 = reducer(s252, ['CUT_PEAT', '0', '0', 'Jo'])! as GameStatePlaying
    const s254 = reducer(s253, ['COMMIT'])! as GameStatePlaying
    expect(s254.frame).toMatchObject({
      activePlayerIndex: 0,
      next: 100,
    })

    const s255 = reducer(s254, ['USE', 'G01'])! as GameStatePlaying
    const s256 = reducer(s255, ['USE', 'F30', 'Po'])! as GameStatePlaying
    const s257 = reducer(s256, ['COMMIT'])! as GameStatePlaying
    expect(s257.frame).toMatchObject({
      activePlayerIndex: 1,
      next: 101,
    })

    const s258 = reducer(s257, ['USE', 'F09'])! as GameStatePlaying
    const s259 = reducer(s258, ['USE', 'LG2', 'Gn'])! as GameStatePlaying
    const s260 = reducer(s259, ['COMMIT'])! as GameStatePlaying
    expect(s260.frame).toMatchObject({
      activePlayerIndex: 2,
      next: 102,
    })

    const s261 = reducer(s260, ['USE', 'LB2', 'Sh'])! as GameStatePlaying
    const s262 = reducer(s261, ['COMMIT'])! as GameStatePlaying
    expect(s262.frame).toMatchObject({
      activePlayerIndex: 3,
      next: 103,
    })

    const s263 = reducer(s262, ['USE', 'G02', 'ClWoFl', 'Sh'])! as GameStatePlaying
    const s264 = reducer(s263, ['COMMIT'])! as GameStatePlaying
    expect(s264.frame).toMatchObject({
      activePlayerIndex: 0,
      next: 104,
    })

    const s265 = reducer(s264, ['BUILD', 'G26', '-1', '3'])! as GameStatePlaying
    const s266 = reducer(s265, ['COMMIT'])! as GameStatePlaying
    expect(s266.frame).toMatchObject({
      activePlayerIndex: 1,
      next: 105,
    })

    const s267 = reducer(s266, ['WORK_CONTRACT', 'G07', 'PnPn'])! as GameStatePlaying
    const s268 = reducer(s267, ['WITH_LAYBROTHER'])! as GameStatePlaying
    const s269 = reducer(s268, ['USE', 'G07', 'PtPtPtPtPtPtPtPt'])! as GameStatePlaying
    const s270 = reducer(s269, ['COMMIT'])! as GameStatePlaying
    expect(s270.frame).toMatchObject({
      activePlayerIndex: 2,
      next: 106,
    })

    const s271 = reducer(s270, ['CONVERT', 'Gn'])! as GameStatePlaying
    const s272 = reducer(s271, ['SETTLE', 'SB7', '2', '-1', 'ShShShShShShBrPtWoWoWoWoWoSwSwSwSw'])! as GameStatePlaying
    expect(s272).toBeDefined()
    const s273 = reducer(s272, ['COMMIT'])! as GameStatePlaying
    expect(s273.frame).toMatchObject({
      activePlayerIndex: 3,
      next: 107,
    })

    const s274 = reducer(s273, ['SETTLE', 'SW3', '3', '-2', 'ShShShFl'])! as GameStatePlaying
    const s275 = reducer(s274, ['COMMIT'])! as GameStatePlaying
    expect(s275.frame).toMatchObject({
      activePlayerIndex: 0,
      next: 108,
    })

    const s276 = reducer(s275, ['SETTLE', 'SR7', '0', '0', 'MtMtMtCoCoCo'])! as GameStatePlaying
    const s277 = reducer(s276, ['COMMIT'])! as GameStatePlaying
    expect(s277.frame).toMatchObject({
      activePlayerIndex: 1,
      next: 109,
    })

    const s278 = reducer(s277, ['SETTLE', 'SG2', '3', '3', 'GpGpGpCo'])! as GameStatePlaying
    const s279 = reducer(s278, ['COMMIT'])! as GameStatePlaying
    expect(s279.frame).toMatchObject({
      activePlayerIndex: 2,
      next: 110,
    })

    const s280 = reducer(s279, ['USE', 'LB3'])! as GameStatePlaying
    const s281 = reducer(s280, ['COMMIT'])! as GameStatePlaying
    expect(s281.frame).toMatchObject({
      activePlayerIndex: 3,
      next: 111,
    })

    const s282 = reducer(s281, ['BUILD', 'F40', '5', '0'])! as GameStatePlaying
    const s283 = reducer(s282, ['COMMIT'])! as GameStatePlaying
    expect(s283.frame).toMatchObject({
      activePlayerIndex: 0,
      next: 112,
    })

    const s284 = reducer(s283, ['BUILD', 'F29', '6', '0'])! as GameStatePlaying
    const s285 = reducer(s284, ['USE', 'F29'])! as GameStatePlaying
    const s286 = reducer(s285, ['COMMIT'])! as GameStatePlaying
    expect(s286.frame).toMatchObject({
      activePlayerIndex: 1,
      next: 113,
    })

    const s287 = reducer(s286, ['BUY_PLOT', '2', 'MOUNTAIN'])! as GameStatePlaying
    const s288 = reducer(s287, ['BUILD', 'F38', '0', '3'])! as GameStatePlaying
    const s289 = reducer(s288, ['USE', 'F38', '1', '3', '2', '3', '1', '1', '1', '0'])! as GameStatePlaying
    const s290 = reducer(s289, ['COMMIT'])! as GameStatePlaying
    expect(s290.frame).toMatchObject({
      activePlayerIndex: 2,
      next: 114,
    })

    const s291 = reducer(s290, ['CUT_PEAT', '0', '1'])! as GameStatePlaying
    const s292 = reducer(s291, ['COMMIT'])! as GameStatePlaying
    expect(s292.frame).toMatchObject({
      activePlayerIndex: 3,
      next: 115,
    })

    const s293 = reducer(s292, ['USE', 'G13', 'PnPn'])! as GameStatePlaying
    const s294 = reducer(s293, ['COMMIT'])! as GameStatePlaying
    expect(s294.frame).toMatchObject({
      activePlayerIndex: 0,
      next: 116,
    })

    const s295 = reducer(s294, ['USE', 'F14'])! as GameStatePlaying
    const s296 = reducer(s295, ['COMMIT'])! as GameStatePlaying
    expect(s296.frame).toMatchObject({
      activePlayerIndex: 1,
      next: 117,
    })

    expect(s296.players[1]).toMatchObject({
      penny: 2,
      nickel: 1,
    })
    const s297 = reducer(s296, ['BUILD', 'F36', '2', '3'])! as GameStatePlaying
    expect(s297).toBeDefined()
    const s298 = reducer(s297, ['COMMIT'])! as GameStatePlaying
    expect(s298.frame).toMatchObject({
      activePlayerIndex: 2,
      next: 118,
    })

    const s299 = reducer(s298, ['FELL_TREES', '1', '-1'])! as GameStatePlaying
    const s300 = reducer(s299, ['COMMIT'])! as GameStatePlaying
    expect(s300.frame).toMatchObject({
      activePlayerIndex: 3,
      next: 119,
    })

    const s301 = reducer(s300, ['WORK_CONTRACT', 'LG2', 'Wn'])! as GameStatePlaying
    // this now skips because the contracted player doesnt have an unplaced prior
    // const s302 = reducer(s301, ['WITH_LAYBROTHER'])! as GameStatePlaying
    const s303 = reducer(s301, ['USE', 'LG2', 'ShJo'])! as GameStatePlaying
    const s304 = reducer(s303, ['COMMIT'])! as GameStatePlaying
    expect(s304.frame).toMatchObject({
      activePlayerIndex: 0,
      next: 120,
    })

    const s305 = reducer(s304, ['USE', 'F11'])! as GameStatePlaying
    const s306 = reducer(s305, ['COMMIT'])! as GameStatePlaying
    expect(s306.frame).toMatchObject({
      activePlayerIndex: 1,
      next: 121,
    })

    const s307 = reducer(s306, ['USE', 'F08', 'WoSnPnGp'])! as GameStatePlaying
    const s308 = reducer(s307, ['COMMIT'])! as GameStatePlaying
    expect(s308.frame).toMatchObject({
      activePlayerIndex: 2,
      next: 122,
    })

    const s309 = reducer(s308, ['BUILD', 'G39', '5', '-1'])! as GameStatePlaying
    const s30X = reducer(s309, ['WITH_PRIOR'])! as GameStatePlaying
    const s310 = reducer(s309, ['USE', 'G39', 'PtPtPt'])! as GameStatePlaying
    const s311 = reducer(s310, ['COMMIT'])! as GameStatePlaying
    expect(s311.frame).toMatchObject({
      activePlayerIndex: 3,
      next: 123,
    })

    const s312 = reducer(s311, ['BUILD', 'G28', '6', '-2'])! as GameStatePlaying
    const s313 = reducer(s312, ['USE', 'G28'])! as GameStatePlaying
    const s314 = reducer(s313, ['SETTLE', 'SW6', '5', '-2', 'ShShFlPtPtPt'])! as GameStatePlaying
    const s315 = reducer(s314, ['COMMIT'])! as GameStatePlaying
    expect(s315.frame).toMatchObject({
      activePlayerIndex: 0,
      next: 124,
    })

    const s316 = reducer(s315, ['USE', 'G01'])! as GameStatePlaying
    const s317 = reducer(s316, ['USE', 'G28'])! as GameStatePlaying
    const s318 = reducer(s317, ['SETTLE', 'SR3', '2', '2', 'MtGpGp'])! as GameStatePlaying
    const s319 = reducer(s318, ['COMMIT'])! as GameStatePlaying
    expect(s319.frame).toMatchObject({
      activePlayerIndex: 1,
      next: 125,
    })

    const s320 = reducer(s319, ['WORK_CONTRACT', 'G19', 'PnPn'])! as GameStatePlaying
    // this now skips because the contracted player doesnt have an unplaced prior
    // const s321 = reducer(s320, ['WITH_LAYBROTHER'])! as GameStatePlaying
    const s322 = reducer(s320, ['CONVERT', 'GnGnGnGnGnGn'])! as GameStatePlaying
    const s323 = reducer(s322, ['USE', 'G19', 'SwSwSwSwSwSwShShShShShSh'])! as GameStatePlaying
    const s324 = reducer(s323, ['COMMIT'])! as GameStatePlaying
    expect(s324.frame).toMatchObject({
      activePlayerIndex: 2,
      next: 126,
    })

    const s325 = reducer(s324, ['USE', 'LB1'])! as GameStatePlaying
    const s326 = reducer(s325, ['COMMIT'])! as GameStatePlaying
    expect(s326.frame).toMatchObject({
      activePlayerIndex: 3,
      next: 127,
    })

    const s327 = reducer(s326, ['USE', 'F40'])! as GameStatePlaying
    const s328 = reducer(s327, ['USE', 'F27', 'Wn'])! as GameStatePlaying
    const s329 = reducer(s328, ['USE', 'F08', 'WoClSwSh'])! as GameStatePlaying
    const s330 = reducer(s329, ['COMMIT'])! as GameStatePlaying
    expect(s330.frame).toMatchObject({
      activePlayerIndex: 0,
      next: 128,
    })

    const s331 = reducer(s330, ['CUT_PEAT', '0', '1'])! as GameStatePlaying
    const s332 = reducer(s331, ['BUY_DISTRICT', '3', 'PLAINS'])! as GameStatePlaying
    const s333 = reducer(s332, ['COMMIT'])! as GameStatePlaying
    expect(s333.frame).toMatchObject({
      activePlayerIndex: 1,
      next: 129,
    })

    const s334 = reducer(s333, ['USE', 'F09'])! as GameStatePlaying
    const s335 = reducer(s334, ['USE', 'LG2', 'Sh'])! as GameStatePlaying
    const s336 = reducer(s335, ['COMMIT'])! as GameStatePlaying
    expect(s336.frame).toMatchObject({
      activePlayerIndex: 2,
      next: 130,
    })

    const s337 = reducer(s336, ['WORK_CONTRACT', 'F36', 'PnPn'])! as GameStatePlaying
    // this now skips because the contracted player doesnt have an unplaced prior
    // const s338 = reducer(s337, ['WITH_LAYBROTHER'])! as GameStatePlaying
    const s339 = reducer(s337, ['USE', 'F36', 'Or', 'Po'])! as GameStatePlaying
    const s340 = reducer(s339, ['COMMIT'])! as GameStatePlaying
    expect(s340.frame).toMatchObject({
      activePlayerIndex: 3,
      next: 131,
    })

    const s341 = reducer(s340, ['USE', 'F15', 'Pn'])! as GameStatePlaying
    const s342 = reducer(s341, ['COMMIT'])! as GameStatePlaying
    expect(s342.frame).toMatchObject({
      activePlayerIndex: 0,
      next: 132,
    })

    const s343 = reducer(s342, ['USE', 'G01'])! as GameStatePlaying
    const s344 = reducer(s343, ['USE', 'G28'])! as GameStatePlaying
    const s345 = reducer(s344, ['SETTLE', 'SR6', '2', '3', 'PtPtPtBrGpGp'])! as GameStatePlaying
    const s346 = reducer(s345, ['COMMIT'])! as GameStatePlaying
    expect(s346.frame).toMatchObject({
      activePlayerIndex: 1,
      next: 133,
    })

    const s347 = reducer(s346, ['WORK_CONTRACT', 'F17', 'PnPn'])! as GameStatePlaying
    const s348 = reducer(s347, ['WITH_LAYBROTHER'])! as GameStatePlaying
    const s34X = reducer(s348, ['CONVERT', 'Ni'])! as GameStatePlaying
    const s349 = reducer(s34X, ['USE', 'F17', 'PnPnPnBo'])! as GameStatePlaying
    const s350 = reducer(s349, ['COMMIT'])! as GameStatePlaying
    expect(s350.frame).toMatchObject({
      activePlayerIndex: 2,
      next: 134,
    })

    const s351 = reducer(s350, ['CONVERT', 'Gn'])! as GameStatePlaying
    const s352 = reducer(s351, ['BUILD', 'F35', '1', '-1'])! as GameStatePlaying
    const s35X = reducer(s352, ['WITH_PRIOR'])! as GameStatePlaying
    const s353 = reducer(s35X, ['USE', 'F35', 'PnPnPnPnPn'])! as GameStatePlaying
    const s354 = reducer(s353, ['COMMIT'])! as GameStatePlaying
    expect(s354.frame).toMatchObject({
      startingPlayer: 3,
      activePlayerIndex: 3,
      next: 135,
    })

    const s355 = reducer(s354, ['USE', 'F40'])! as GameStatePlaying
    const s356 = reducer(s355, ['USE', 'F33', 'PtWoMt'])! as GameStatePlaying
    const s357 = reducer(s356, ['COMMIT'])! as GameStatePlaying
    expect(s357.frame).toMatchObject({
      activePlayerIndex: 0,
      next: 136,
    })

    const s358 = reducer(s357, ['WORK_CONTRACT', 'F24', 'PnPn'])! as GameStatePlaying
    const s359 = reducer(s358, ['WITH_LAYBROTHER'])! as GameStatePlaying
    const s360 = reducer(s359, ['USE', 'F24', 'BrBrWnWn'])! as GameStatePlaying
    const s361 = reducer(s360, ['COMMIT'])! as GameStatePlaying
    expect(s361.frame).toMatchObject({
      activePlayerIndex: 1,
      next: 137,
    })

    const s362 = reducer(s361, ['WORK_CONTRACT', 'G28', 'PnPn'])! as GameStatePlaying
    const s363 = reducer(s362, ['WITH_LAYBROTHER'])! as GameStatePlaying
    const s364 = reducer(s363, ['USE', 'G28'])! as GameStatePlaying
    const s365 = reducer(s364, ['SETTLE', 'SG6', '1', '3', 'MtCoCo'])! as GameStatePlaying
    const s366 = reducer(s365, ['COMMIT'])! as GameStatePlaying
    expect(s366.frame).toMatchObject({
      activePlayerIndex: 2,
      next: 138,
    })

    const s367 = reducer(s366, ['USE', 'G18', 'ClClClPtWo'])! as GameStatePlaying
    const s368 = reducer(s367, ['COMMIT'])! as GameStatePlaying
    expect(s368.frame).toMatchObject({
      activePlayerIndex: 3,
      next: 139,
    })

    const s369 = reducer(s368, ['USE', 'G13', 'PnPn'])! as GameStatePlaying
    const s370 = reducer(s369, ['COMMIT'])! as GameStatePlaying
    expect(s370.frame).toMatchObject({
      startingPlayer: 0,
      activePlayerIndex: 0,
      next: 140,
    })

    // bonus action round, only 4 more actions remain
    const s371 = reducer(s370, ['USE', 'G26', 'WoWo'])! as GameStatePlaying
    const s372 = reducer(s371, ['COMMIT'])! as GameStatePlaying
    expect(s372.frame).toMatchObject({
      activePlayerIndex: 1,
      next: 141,
    })

    // i think they meant to use castle with bonus action
    const s37X = reducer(s372, ['USE', 'G28'])! as GameStatePlaying
    expect(s37X).toBeDefined()
    const s373 = reducer(s37X, ['SETTLE', 'SG8', '5', '2', 'MtMtMtMtMtMtCo'])! as GameStatePlaying
    const s374 = reducer(s373, ['COMMIT'])! as GameStatePlaying
    expect(s374.frame).toMatchObject({
      activePlayerIndex: 2,
      next: 142,
    })

    // p3 bonus action
    const s375 = reducer(s374, ['USE', 'F40'])! as GameStatePlaying
    expect(s375.frame).toMatchObject({
      bonusRoundPlacement: false,
      mainActionUsed: true,
      nextUse: 'free',
    })
    expect(s375.frame.usableBuildings).toContain('G34')
    const s376 = reducer(s375, ['USE', 'G34', 'BoPoOrRq'])! as GameStatePlaying
    expect(s376).toBeDefined()
    const s377 = reducer(s376, ['COMMIT'])! as GameStatePlaying
    expect(s377.frame).toMatchObject({
      activePlayerIndex: 3,
      next: 143,
    })

    // p4 bonus action
    const s378 = reducer(s377, ['USE', 'F25', 'WoClSnSwPnGnShFlGpMtWnBrBo'])! as GameStatePlaying
    const s379 = reducer(s378, ['COMMIT'])! as GameStatePlaying
    expect(s379.frame).toMatchObject({
      activePlayerIndex: 0,
      next: 144,
    })

    const s380 = reducer(s379, ['SETTLE', 'SR1', '4', '3', 'GpPt'])! as GameStatePlaying
    const s381 = reducer(s380, ['COMMIT'])! as GameStatePlaying
    expect(s381.frame).toMatchObject({
      activePlayerIndex: 1,
      next: 145,
    })

    const s382 = reducer(s381, ['SETTLE', 'SG7', '5', '3', 'ShShShShShBrGpPnCoCoCo'])! as GameStatePlaying
    const s383 = reducer(s382, ['COMMIT'])! as GameStatePlaying
    expect(s383.frame).toMatchObject({
      activePlayerIndex: 2,
      next: 146,
    })

    const s384 = reducer(s383, ['SETTLE', 'SB2', '4', '-1', 'PtWoPnPnPn'])! as GameStatePlaying
    const s385 = reducer(s384, ['COMMIT'])! as GameStatePlaying
    expect(s385.frame).toMatchObject({
      activePlayerIndex: 3,
      next: 147,
    })

    const s386 = reducer(s385, ['SETTLE', 'SW8', '5', '-1', 'ShShShFlGpBrMtMtMtMtWoWoWo'])! as GameStatePlaying
    const s387 = reducer(s386, ['COMMIT'])! as GameStatePlaying
    expect(s387).toMatchObject({
      status: 'FINISHED',
    })
  })
})

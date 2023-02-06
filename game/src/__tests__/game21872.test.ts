import { initialState, reducer } from '../reducer'
import { BuildingEnum, GameStatePlaying, GameStateSetup } from '../types'

describe('game 21872', () => {
  it('runs through moves', () => {
    const s01 = initialState
    const s02 = reducer(s01, ['CONFIG', '4', 'france', 'long'])! as GameStateSetup
    const s03 = reducer(s02, ['START', '42', 'R', 'G', 'B', 'W'])! as GameStatePlaying
    const s04 = reducer(s03, ['USE', 'LR3'])! as GameStatePlaying
    const s05 = reducer(s04, ['BUY_DISTRICT', '2', 'PLAINS'])! as GameStatePlaying
    const s06 = reducer(s05, ['COMMIT'])! as GameStatePlaying
    const s07 = reducer(s06, ['USE', 'LG3', 'Jo'])! as GameStatePlaying
    const s08 = reducer(s07, ['COMMIT'])! as GameStatePlaying
    const s09 = reducer(s08, ['FELL_TREES', '2', '0'])! as GameStatePlaying
    const s10 = reducer(s09, ['COMMIT'])! as GameStatePlaying
    const s11 = reducer(s10, ['USE', 'LW1'])! as GameStatePlaying
    const s12 = reducer(s11, ['COMMIT'])! as GameStatePlaying
    const s13 = reducer(s12, ['BUILD', 'G01', '3', '1'])! as GameStatePlaying
    const s14 = reducer(s13, ['COMMIT'])! as GameStatePlaying
    const s15 = reducer(s14, ['BUILD', 'F09', '3', '1'])! as GameStatePlaying
    const s16 = reducer(s15, ['USE', 'F09'])! as GameStatePlaying
    const s17 = reducer(s16, ['USE', 'LG2', 'Sh'])! as GameStatePlaying
    const s18 = reducer(s17, ['COMMIT'])! as GameStatePlaying
    const s19 = reducer(s18, ['CUT_PEAT', '0', '0'])! as GameStatePlaying
    const s20 = reducer(s19, ['COMMIT'])! as GameStatePlaying
    const s21 = reducer(s20, ['FELL_TREES', '1', '0'])! as GameStatePlaying
    const s22 = reducer(s21, ['COMMIT'])! as GameStatePlaying
    const s23 = reducer(s22, ['USE', 'G01'])! as GameStatePlaying
    const s24 = reducer(s23, ['USE', 'F09'])! as GameStatePlaying
    const s25 = reducer(s24, ['USE', 'LG2', 'Gn'])! as GameStatePlaying
    const s26 = reducer(s25, ['COMMIT'])! as GameStatePlaying
    const s27 = reducer(s26, ['CUT_PEAT', '0', '0', 'Jo'])! as GameStatePlaying
    const s28 = reducer(s27, ['COMMIT'])! as GameStatePlaying
    const s29 = reducer(s28, ['USE', 'LB1'])! as GameStatePlaying
    const s30 = reducer(s29, ['COMMIT'])! as GameStatePlaying
    const s31 = reducer(s30, ['BUILD', 'G02', '3', '1'])! as GameStatePlaying
    const s32 = reducer(s31, ['USE', 'G02', 'ClPnGn', 'Pn'])! as GameStatePlaying
    const s33 = reducer(s32, ['BUY_DISTRICT', '-1', 'PLAINS'])! as GameStatePlaying
    const s34 = reducer(s33, ['COMMIT'])! as GameStatePlaying
    const s35 = reducer(s34, ['USE', 'LR1', 'Jo'])! as GameStatePlaying
    const s36 = reducer(s35, ['COMMIT'])! as GameStatePlaying
    const s37 = reducer(s36, ['BUILD', 'G12', '0', '0'])! as GameStatePlaying
    const s38 = reducer(s37, ['COMMIT'])! as GameStatePlaying
    const s39 = reducer(s38, ['USE', 'LB3'])! as GameStatePlaying
    const s40 = reducer(s39, ['BUY_DISTRICT', '-1', 'HILLS'])! as GameStatePlaying
    const s41 = reducer(s40, ['COMMIT'])! as GameStatePlaying
    const s42 = reducer(s41, ['USE', 'LW2', 'Gn'])! as GameStatePlaying
    const s43 = reducer(s42, ['COMMIT'])! as GameStatePlaying
    expect(s43).toBeDefined()
  })
})

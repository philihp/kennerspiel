import { initialState, reducer } from '../reducer'
import { BuildingEnum, GameStatePlaying, GameStateSetup } from '../types'

describe('game 21872', () => {
  it.skip('runs through moves', () => {
    const s01 = initialState
    const s02 = reducer(s01, ['CONFIG', '4', 'france', 'long'])! as GameStateSetup
    const s03 = reducer(s02, ['START', '28', 'W', 'B', 'G', 'R'])! as GameStatePlaying
    expect(s03.players[0].color).toBe('R')
    expect(s03.players[1].color).toBe('G')
    expect(s03.players[2].color).toBe('B')
    expect(s03.players[3].color).toBe('W')
    const s04 = reducer(s03, ['USE', 'LR3'])! as GameStatePlaying
    expect(s04).toBeDefined()
    const s05 = reducer(s04, ['BUY_DISTRICT', '2', 'PLAINS'])! as GameStatePlaying
    expect(s05).toBeDefined()
    const s06 = reducer(s05, ['COMMIT'])! as GameStatePlaying
    expect(s06).toBeDefined()
    const s07 = reducer(s06, ['USE', 'LG3', 'Jo'])! as GameStatePlaying
    expect(s07).toBeDefined()
    const s08 = reducer(s07, ['COMMIT'])! as GameStatePlaying
    expect(s08).toBeDefined()
    const s09 = reducer(s08, ['FELL_TREES', '2', '0'])! as GameStatePlaying
    expect(s09).toBeDefined()
    const s10 = reducer(s09, ['COMMIT'])! as GameStatePlaying
    expect(s10).toBeDefined()
    const s11 = reducer(s10, ['USE', 'LW1'])! as GameStatePlaying
    expect(s11).toBeDefined()
    const s12 = reducer(s11, ['COMMIT'])! as GameStatePlaying
    expect(s12).toBeDefined()
    const s13 = reducer(s12, ['BUILD', 'G01', '3', '1'])! as GameStatePlaying
    expect(s13).toBeDefined()
    const s14 = reducer(s13, ['COMMIT'])! as GameStatePlaying
    expect(s14).toBeDefined()
    const s15 = reducer(s14, ['BUILD', 'F09', '3', '1'])! as GameStatePlaying
    expect(s15).toBeDefined()
    const s16 = reducer(s15, ['USE', 'F09'])! as GameStatePlaying
    expect(s16).toBeDefined()
    const s17 = reducer(s16, ['USE', 'LG2', 'Sh'])! as GameStatePlaying
    expect(s17).toBeDefined()
    const s18 = reducer(s17, ['COMMIT'])! as GameStatePlaying
    expect(s18).toBeDefined()
    const s19 = reducer(s18, ['CUT_PEAT', '0', '0'])! as GameStatePlaying
    expect(s19).toBeDefined()
    const s20 = reducer(s19, ['COMMIT'])! as GameStatePlaying
    expect(s20).toBeDefined()
    const s21 = reducer(s20, ['FELL_TREES', '1', '0'])! as GameStatePlaying
    expect(s21).toBeDefined()
    const s22 = reducer(s21, ['COMMIT'])! as GameStatePlaying
    expect(s22).toBeDefined()
    const s23 = reducer(s22, ['USE', 'G01'])! as GameStatePlaying
    expect(s23).toBeDefined()
    const s24 = reducer(s23, ['USE', 'F09'])! as GameStatePlaying
    expect(s24).toBeDefined()
    const s25 = reducer(s24, ['USE', 'LG2', 'Gn'])! as GameStatePlaying
    expect(s25).toBeDefined()
    const s26 = reducer(s25, ['COMMIT'])! as GameStatePlaying
    expect(s26).toBeDefined()
    const s27 = reducer(s26, ['CUT_PEAT', '0', '0', 'Jo'])! as GameStatePlaying
    expect(s27).toBeDefined()
    const s28 = reducer(s27, ['COMMIT'])! as GameStatePlaying
    expect(s28).toBeDefined()
    const s29 = reducer(s28, ['USE', 'LB1'])! as GameStatePlaying
    expect(s29).toBeDefined()
    const s30 = reducer(s29, ['COMMIT'])! as GameStatePlaying
    expect(s30).toBeDefined()
    const s31 = reducer(s30, ['BUILD', 'G02', '3', '1'])! as GameStatePlaying
    expect(s31).toBeDefined()
    const s32 = reducer(s31, ['USE', 'G02', 'ClPnGn', 'Pn'])! as GameStatePlaying
    expect(s32).toBeDefined()
    const s33 = reducer(s32, ['BUY_DISTRICT', '-1', 'PLAINS'])! as GameStatePlaying
    expect(s33).toBeDefined()
    const s34 = reducer(s33, ['COMMIT'])! as GameStatePlaying
    expect(s34).toBeDefined()
    const s35 = reducer(s34, ['USE', 'LR1', 'Jo'])! as GameStatePlaying
    expect(s35).toBeDefined()
    const s36 = reducer(s35, ['COMMIT'])! as GameStatePlaying
    expect(s36).toBeDefined()
    const s37 = reducer(s36, ['BUILD', 'G12', '0', '0'])! as GameStatePlaying
    expect(s37).toBeDefined()
    const s38 = reducer(s37, ['COMMIT'])! as GameStatePlaying
    expect(s38).toBeDefined()
    const s39 = reducer(s38, ['USE', 'LB3'])! as GameStatePlaying
    expect(s39).toBeDefined()
    const s40 = reducer(s39, ['BUY_DISTRICT', '-1', 'HILLS'])! as GameStatePlaying
    expect(s40).toBeDefined()
    const s41 = reducer(s40, ['COMMIT'])! as GameStatePlaying
    expect(s41).toBeDefined()
    const s42 = reducer(s41, ['USE', 'LW2', 'Gn'])! as GameStatePlaying
    expect(s42).toBeDefined()
    const s43 = reducer(s42, ['COMMIT'])! as GameStatePlaying
    expect(s43).toBeDefined()
  })
})

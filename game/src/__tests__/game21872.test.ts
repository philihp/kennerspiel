import { reducer } from '../reducer'
// import { initialState } from '../state'
// import { GameStatePlaying, GameStateSetup } from '../types'

describe('game 21872', () => {
  it('passes', () => {
    expect(true).toBeTruthy()
  })
})
// describe.skip('game 21872', () => {
//   it('runs through moves', () => {
//     const s01 = initialState
//     const s02 = reducer(s01, ['CONFIG', '4', 'france', 'long'])! as GameStateSetup
//     const s03 = reducer(s02, ['START', '28', 'W', 'B', 'G', 'R'])! as GameStatePlaying
//     expect(s03.players[0].color).toBe('R')
//     expect(s03.players[1].color).toBe('G')
//     expect(s03.players[2].color).toBe('B')
//     expect(s03.players[3].color).toBe('W')
//     const s04 = reducer(s03, ['USE', 'LR3'])! as GameStatePlaying
//     expect(s04.frame).toMatchObject({
//       activePlayerIndex: 0,
//     })
//     const s05 = reducer(s04, ['BUY_DISTRICT', '2', 'PLAINS'])! as GameStatePlaying
//     expect(s05.frame).toMatchObject({
//       activePlayerIndex: 0,
//     })
//     const s06 = reducer(s05, ['COMMIT'])! as GameStatePlaying
//     expect(s06.frame).toMatchObject({
//       activePlayerIndex: 1,
//     })
//     const s07 = reducer(s06, ['USE', 'LG3', 'Jo'])! as GameStatePlaying
//     expect(s07.frame).toMatchObject({
//       activePlayerIndex: 1,
//     })
//     const s08 = reducer(s07, ['COMMIT'])! as GameStatePlaying
//     expect(s08.frame).toMatchObject({
//       activePlayerIndex: 2,
//     })
//     const s09 = reducer(s08, ['FELL_TREES', '2', '0'])! as GameStatePlaying
//     expect(s09.frame).toMatchObject({
//       activePlayerIndex: 2,
//     })
//     const s10 = reducer(s09, ['COMMIT'])! as GameStatePlaying
//     expect(s10.frame).toMatchObject({
//       activePlayerIndex: 3,
//     })
//     const s11 = reducer(s10, ['USE', 'LW1'])! as GameStatePlaying
//     expect(s11.frame).toMatchObject({
//       activePlayerIndex: 3,
//     })
//     const s12 = reducer(s11, ['COMMIT'])! as GameStatePlaying
//     expect(s12.frame).toMatchObject({
//       activePlayerIndex: 0,
//     })
//     const s13 = reducer(s12, ['BUILD', 'G01', '3', '1'])! as GameStatePlaying
//     expect(s13.frame).toMatchObject({
//       activePlayerIndex: 0,
//     })
//     const s14 = reducer(s13, ['COMMIT'])! as GameStatePlaying
//     expect(s14.frame).toMatchObject({
//       activePlayerIndex: 1,
//     })
//     const s15 = reducer(s14, ['BUILD', 'F09', '3', '1'])! as GameStatePlaying
//     expect(s15.frame).toMatchObject({
//       activePlayerIndex: 1,
//     })
//     const s16 = reducer(s15, ['USE', 'F09'])! as GameStatePlaying
//     expect(s16.frame).toMatchObject({
//       activePlayerIndex: 1,
//     })
//     const s17 = reducer(s16, ['USE', 'LG2', 'Sh'])! as GameStatePlaying
//     expect(s17.frame).toMatchObject({
//       activePlayerIndex: 1,
//     })
//     const s18 = reducer(s17, ['COMMIT'])! as GameStatePlaying
//     expect(s18.frame).toMatchObject({
//       activePlayerIndex: 2,
//     })
//     const s19 = reducer(s18, ['CUT_PEAT', '0', '0'])! as GameStatePlaying
//     expect(s19.frame).toMatchObject({
//       activePlayerIndex: 2,
//     })
//     const s20 = reducer(s19, ['COMMIT'])! as GameStatePlaying
//     expect(s20.frame).toMatchObject({
//       activePlayerIndex: 3,
//     })
//     const s21 = reducer(s20, ['FELL_TREES', '1', '0'])! as GameStatePlaying
//     expect(s21.frame).toMatchObject({
//       activePlayerIndex: 3,
//     })
//     const s22 = reducer(s21, ['COMMIT'])! as GameStatePlaying
//     expect(s22.frame).toMatchObject({
//       activePlayerIndex: 0,
//     })
//     const s23 = reducer(s22, ['USE', 'G01'])! as GameStatePlaying
//     expect(s23.frame).toMatchObject({
//       activePlayerIndex: 0,
//     })
//     const s24 = reducer(s23, ['USE', 'F09'])! as GameStatePlaying
//     expect(s24.frame).toMatchObject({
//       activePlayerIndex: 0,
//     })
//     const s25 = reducer(s24, ['USE', 'LG2', 'Gn'])! as GameStatePlaying
//     expect(s25.frame).toMatchObject({
//       activePlayerIndex: 0,
//     })
//     const s26 = reducer(s25, ['COMMIT'])! as GameStatePlaying
//     expect(s26.frame).toMatchObject({
//       activePlayerIndex: 1,
//     })
//     const s27 = reducer(s26, ['CUT_PEAT', '0', '0', 'Jo'])! as GameStatePlaying
//     expect(s27.frame).toMatchObject({
//       activePlayerIndex: 1,
//     })
//     const s28 = reducer(s27, ['COMMIT'])! as GameStatePlaying
//     expect(s28.frame).toMatchObject({
//       activePlayerIndex: 2,
//     })
//     const s29 = reducer(s28, ['USE', 'LB1'])! as GameStatePlaying
//     expect(s29.frame).toMatchObject({
//       activePlayerIndex: 2,
//     })
//     const s30 = reducer(s29, ['COMMIT'])! as GameStatePlaying
//     expect(s30.frame).toMatchObject({
//       activePlayerIndex: 3,
//     })
//     const s31 = reducer(s30, ['BUILD', 'G02', '3', '1'])! as GameStatePlaying
//     expect(s31.frame).toMatchObject({
//       activePlayerIndex: 3,
//     })
//     const s32 = reducer(s31, ['USE', 'G02', 'ClPnGn', 'Pn'])! as GameStatePlaying
//     expect(s32.frame).toMatchObject({
//       activePlayerIndex: 3,
//     })
//     const s33 = reducer(s32, ['BUY_DISTRICT', '-1', 'PLAINS'])! as GameStatePlaying
//     expect(s33.frame).toMatchObject({
//       activePlayerIndex: 3,
//     })
//     const s34 = reducer(s33, ['COMMIT'])! as GameStatePlaying
//     expect(s34.frame).toMatchObject({
//       activePlayerIndex: 0,
//     })
//     const s35 = reducer(s34, ['USE', 'LR1', 'Jo'])! as GameStatePlaying
//     expect(s35.frame).toMatchObject({
//       activePlayerIndex: 0,
//     })
//     const s36 = reducer(s35, ['COMMIT'])! as GameStatePlaying
//     expect(s36.frame).toMatchObject({
//       activePlayerIndex: 1,
//     })
//     const s37 = reducer(s36, ['BUILD', 'G12', '0', '0'])! as GameStatePlaying
//     expect(s37.frame).toMatchObject({
//       activePlayerIndex: 1,
//     })
//     const s38 = reducer(s37, ['COMMIT'])! as GameStatePlaying
//     expect(s38.frame).toMatchObject({
//       activePlayerIndex: 2,
//     })
//     const s39 = reducer(s38, ['USE', 'LB3'])! as GameStatePlaying
//     expect(s39.frame).toMatchObject({
//       activePlayerIndex: 2,
//     })
//     const s40 = reducer(s39, ['BUY_DISTRICT', '-1', 'HILLS'])! as GameStatePlaying
//     expect(s40.frame).toMatchObject({
//       activePlayerIndex: 2,
//     })
//     const s41 = reducer(s40, ['COMMIT'])! as GameStatePlaying
//     expect(s41.frame).toMatchObject({
//       activePlayerIndex: 3,
//     })
//     const s42 = reducer(s41, ['USE', 'LW2', 'Gn'])! as GameStatePlaying
//     expect(s42.frame).toMatchObject({
//       activePlayerIndex: 3,
//     })
//     const s43 = reducer(s42, ['COMMIT'])! as GameStatePlaying
//     expect(s43.frame).toMatchObject({
//       activePlayerIndex: 0,
//     })
//   })
// })

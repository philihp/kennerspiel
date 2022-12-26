import { settlementRounds } from '../settlementRounds'

describe('board/settlementRounds', () => {
  it('returns rounds for 1 player france short', () => {
    expect.assertions(1)
    expect(settlementRounds({ players: 1, country: 'france', length: 'short' })).toStrictEqual([11, 15, 21, 25, 31])
  })
  it('returns rounds for 1 player ireland short', () => {
    expect.assertions(1)
    expect(settlementRounds({ players: 1, country: 'ireland', length: 'short' })).toStrictEqual([11, 15, 21, 25, 31])
  })
  it('returns rounds for 1 player france long', () => {
    expect.assertions(1)
    expect(settlementRounds({ players: 1, country: 'france', length: 'long' })).toStrictEqual([11, 15, 21, 25, 31])
  })
  it('returns rounds for 1 player ireland long', () => {
    expect.assertions(1)
    expect(settlementRounds({ players: 1, country: 'ireland', length: 'long' })).toStrictEqual([11, 15, 21, 25, 31])
  })
  it('returns rounds for 2 player france short', () => {
    expect.assertions(1)
    expect(settlementRounds({ players: 2, country: 'france', length: 'short' })).toStrictEqual([6, 13, 20, 27])
  })
  it('returns rounds for 2 player ireland short', () => {
    expect.assertions(1)
    expect(settlementRounds({ players: 2, country: 'ireland', length: 'short' })).toStrictEqual([6, 13, 20, 27])
  })
  it('returns rounds for 2 player france long', () => {
    expect.assertions(1)
    expect(settlementRounds({ players: 2, country: 'france', length: 'long' })).toStrictEqual([6, 13, 20, 27])
  })
  it('returns rounds for 2 player ireland long', () => {
    expect.assertions(1)
    expect(settlementRounds({ players: 2, country: 'ireland', length: 'long' })).toStrictEqual([6, 13, 20, 27])
  })
  it('returns rounds for 3 player france short', () => {
    expect.assertions(1)
    expect(settlementRounds({ players: 3, country: 'france', length: 'short' })).toStrictEqual([2, 4, 6, 8, 12])
  })
  it('returns rounds for 3 player ireland short', () => {
    expect.assertions(1)
    expect(settlementRounds({ players: 3, country: 'ireland', length: 'short' })).toStrictEqual([2, 4, 6, 8, 12])
  })
  it('returns rounds for 3 player france long', () => {
    expect.assertions(1)
    expect(settlementRounds({ players: 3, country: 'france', length: 'long' })).toStrictEqual([5, 10, 14, 19, 24])
  })
  it('returns rounds for 3 player ireland long', () => {
    expect.assertions(1)
    expect(settlementRounds({ players: 3, country: 'ireland', length: 'long' })).toStrictEqual([5, 10, 14, 19, 24])
  })
  it('returns rounds for 4 player france short', () => {
    expect.assertions(1)
    expect(settlementRounds({ players: 4, country: 'france', length: 'short' })).toStrictEqual([2, 4, 6, 8, 12])
  })
  it('returns rounds for 4 player ireland short', () => {
    expect.assertions(1)
    expect(settlementRounds({ players: 4, country: 'ireland', length: 'short' })).toStrictEqual([2, 4, 6, 8, 12])
  })
  it('returns rounds for 4 player france long', () => {
    expect.assertions(1)
    expect(settlementRounds({ players: 4, country: 'france', length: 'long' })).toStrictEqual([6, 9, 15, 18, 24])
  })
  it('returns rounds for 4 player ireland long', () => {
    expect.assertions(1)
    expect(settlementRounds({ players: 4, country: 'ireland', length: 'long' })).toStrictEqual([6, 9, 15, 18, 24])
  })
})

import { initialState } from '../../reducer'
import { GameStatusEnum } from '../../types'
import { commit } from '../commit'

describe('commands/commit', () => {
  it('cannot commit from setup', () => {
    expect.assertions(1)
    expect(
      commit(
        {
          ...initialState,
          status: GameStatusEnum.SETUP,
        },
        { players: 3 }
      )
    ).toBeUndefined()
  })

  it('cannot commit from finished', () => {
    expect.assertions(1)
    expect(
      commit(
        {
          ...initialState,
          status: GameStatusEnum.FINISHED,
        },
        { players: 2 }
      )
    ).toBeUndefined()
  })

  it('can commit from playing', () => {
    expect.assertions(1)
    const dst = commit({
      ...initialState,
      numberOfPlayers: 3,
      activePlayerIndex: 0,
      status: GameStatusEnum.PLAYING,
      rondel: {
        pointingBefore: 0,
      },
    })
    expect(dst?.activePlayerIndex).toBe(1)
  })

  it('wrap around active player index', () => {
    expect.assertions(1)
    const dst = commit({
      ...initialState,
      numberOfPlayers: 3,
      activePlayerIndex: 2,
      status: GameStatusEnum.PLAYING,
      rondel: {
        pointingBefore: 0,
      },
    })
    expect(dst?.activePlayerIndex).toBe(0)
  })

  it('wrap around rondel', () => {
    expect.assertions(1)
    const dst = commit({
      ...initialState,
      numberOfPlayers: 3,
      activePlayerIndex: 2,
      status: GameStatusEnum.PLAYING,
      rondel: {
        pointingBefore: 12,
      },
    })
    expect(dst?.rondel?.pointingBefore).toBe(0)
  })
})

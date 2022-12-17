import { initialState } from '../../reducer'
import { GameState, GameStatusEnum } from '../../types'
import { commit } from '../commit'

describe('commands/commit', () => {
  it('cannot commit from setup', () => {
    expect.assertions(1)
    expect(
      commit({
        ...initialState,
        status: GameStatusEnum.SETUP,
      })
    ).toBeUndefined()
  })

  it('cannot commit from finished', () => {
    expect.assertions(1)
    expect(
      commit({
        ...initialState,
        status: GameStatusEnum.FINISHED,
      })
    ).toBeUndefined()
  })

  it('can commit from playing', () => {
    expect.assertions(1)
    const dst = commit({
      ...initialState,
      config: {
        players: 3,
        country: 'ireland',
        length: 'long',
      },
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
      config: {
        players: 3,
        country: 'france',
        length: 'short',
      },
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
    const src: GameState = {
      ...initialState,
      config: {
        players: 3,
        country: 'france',
        length: 'long',
      },
      activePlayerIndex: 2,
      status: GameStatusEnum.PLAYING,
      rondel: {
        pointingBefore: 12,
      },
    }
    const dst = commit(src)
    expect(dst?.rondel?.pointingBefore).toBe(0)
  })
})

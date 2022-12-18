import { initialState } from '../../reducer'
import { GameStatusEnum } from '../../types'
import { start } from '../start'

describe('commands/start', () => {
  it('cannot start from playing', () => {
    expect.assertions(1)
    expect(
      start({
        ...initialState,
        rondel: {
          pointingBefore: 0,
        },
        status: GameStatusEnum.PLAYING,
      })
    ).toBeUndefined()
  })

  it('cannot start from finished', () => {
    expect.assertions(1)
    expect(
      start({
        ...initialState,
        rondel: {
          pointingBefore: 0,
        },
        status: GameStatusEnum.FINISHED,
      })
    ).toBeUndefined()
  })

  it('cannot start before configured', () => {
    expect.assertions(1)
    const dst = start({
      ...initialState,
      status: GameStatusEnum.SETUP,
    })
    expect(dst).toBeUndefined()
  })

  it('cannot start without config', () => {
    expect.assertions(1)
    const dst = start({
      ...initialState,
      rondel: {
        pointingBefore: 0,
      },
      status: GameStatusEnum.SETUP,
    })
    expect(dst).toBeUndefined()
  })

  it('can start after being configured', () => {
    expect.assertions(1)
    const dst = start({
      ...initialState,
      status: GameStatusEnum.SETUP,
      rondel: {
        pointingBefore: 0,
      },
      config: {
        players: 2,
        country: 'france',
        length: 'short',
      },
    })
    expect(dst).toBeDefined()
  })
})

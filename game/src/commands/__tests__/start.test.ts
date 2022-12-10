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

  it('can start from setup', () => {
    expect.assertions(2)
    const dst = start({
      ...initialState,
      rondel: {
        pointingBefore: 0,
      },
      status: GameStatusEnum.SETUP,
    })
    expect(dst?.status).toBe(GameStatusEnum.PLAYING)
    expect(dst?.rondel).toBeDefined()
  })
})

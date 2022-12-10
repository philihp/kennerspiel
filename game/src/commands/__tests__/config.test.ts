import { initialState } from '../../reducer'
import { GameStatusEnum } from '../../types'
import { config } from '../config'

describe('commands/config', () => {
  it('cannot config from playing', () => {
    expect.assertions(1)
    expect(
      config(
        {
          ...initialState,
          status: GameStatusEnum.PLAYING,
        },
        { players: 3 }
      )
    ).toBeUndefined()
  })

  it('cannot config from finished', () => {
    expect.assertions(1)
    expect(
      config(
        {
          ...initialState,
          status: GameStatusEnum.FINISHED,
        },
        { players: 2 }
      )
    ).toBeUndefined()
  })

  it('can config from setup', () => {
    expect.assertions(1)
    const dst = config(
      {
        ...initialState,
        status: GameStatusEnum.SETUP,
      },
      { players: 3 }
    )
    expect(dst?.numberOfPlayers).toBe(3)
  })

  it('cannot set numberOfPlayers past 4', () => {
    expect.assertions(1)
    const dst = config(
      {
        ...initialState,
        status: GameStatusEnum.SETUP,
      },
      { players: 5 }
    )
    expect(dst).toBeUndefined()
  })
})

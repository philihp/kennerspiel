import { initialState } from '../../reducer'
import { GameStatusEnum, PlayerColor } from '../../types'
import { start } from '../start'

describe('commands/start', () => {
  it('cannot start from playing', () => {
    expect.assertions(1)
    expect(
      start(
        {
          ...initialState,
          rondel: {
            pointingBefore: 0,
          },
          status: GameStatusEnum.PLAYING,
        },
        { colors: [PlayerColor.Red] }
      )
    ).toBeUndefined()
  })

  it('cannot start from finished', () => {
    expect.assertions(1)
    expect(
      start(
        {
          ...initialState,
          rondel: {
            pointingBefore: 0,
          },
          status: GameStatusEnum.FINISHED,
        },
        { colors: [PlayerColor.Red] }
      )
    ).toBeUndefined()
  })

  it('cannot start before configured', () => {
    expect.assertions(1)
    const dst = start(
      {
        ...initialState,
        status: GameStatusEnum.SETUP,
      },
      { colors: [PlayerColor.Blue] }
    )
    expect(dst).toBeUndefined()
  })

  it('cannot start without config', () => {
    expect.assertions(1)
    const dst = start(
      {
        ...initialState,
        rondel: {
          pointingBefore: 0,
        },
        status: GameStatusEnum.SETUP,
      },
      { colors: [PlayerColor.Red] }
    )
    expect(dst).toBeUndefined()
  })

  it('can start after being configured', () => {
    expect.assertions(2)
    const dst = start(
      {
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
      },
      { colors: [PlayerColor.Red, PlayerColor.Green] }
    )
    expect(dst).toBeDefined()
    expect(dst?.players).toHaveLength(2)
  })

  it('creates a tableau for every player', () => {
    expect.assertions(10)
    const dst = start(
      {
        ...initialState,
        status: GameStatusEnum.SETUP,
        rondel: {
          pointingBefore: 0,
        },
        config: {
          players: 4,
          country: 'france',
          length: 'short',
        },
      },
      { colors: [PlayerColor.Red, PlayerColor.Green, PlayerColor.Blue, PlayerColor.White] }
    )
    expect(dst).toBeDefined()
    expect(dst?.players).toHaveLength(4)
    expect(dst?.players?.[0]?.landscape).toStrictEqual([
      [['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['H', 'LR1']],
      [['P', 'LPE'], ['P', 'LFO'], ['P', 'LR2'], ['P'], ['P', 'LR3']],
    ])
    expect(dst?.players?.[0]?.clergy).toStrictEqual(['LayBrother1', 'LayBrother2', 'Prior'])
    expect(dst?.players?.[1]?.landscape).toStrictEqual([
      [['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['H', 'LG1']],
      [['P', 'LPE'], ['P', 'LFO'], ['P', 'LG2'], ['P'], ['P', 'LG3']],
    ])
    expect(dst?.players?.[1]?.clergy).toStrictEqual(['LayBrother1', 'LayBrother2', 'Prior'])
    expect(dst?.players?.[2]?.landscape).toStrictEqual([
      [['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['H', 'LB1']],
      [['P', 'LPE'], ['P', 'LFO'], ['P', 'LB2'], ['P'], ['P', 'LB3']],
    ])
    expect(dst?.players?.[2]?.clergy).toStrictEqual(['LayBrother1', 'LayBrother2', 'Prior'])
    expect(dst?.players?.[3]?.landscape).toStrictEqual([
      [['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['H', 'LW1']],
      [['P', 'LPE'], ['P', 'LFO'], ['P', 'LW2'], ['P'], ['P', 'LW3']],
    ])
    expect(dst?.players?.[3]?.clergy).toStrictEqual(['LayBrother1', 'LayBrother2', 'Prior'])
  })

  it('responds to alternate starting color order', () => {
    expect.assertions(8)
    const dst = start(
      {
        ...initialState,
        status: GameStatusEnum.SETUP,
        rondel: {
          pointingBefore: 0,
        },
        config: {
          players: 3,
          country: 'france',
          length: 'short',
        },
      },
      { colors: [PlayerColor.Red, PlayerColor.White, PlayerColor.Blue] }
    )
    expect(dst).toBeDefined()
    expect(dst?.players).toHaveLength(3)
    expect(dst?.players?.[0]?.landscape).toStrictEqual([
      [['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['H', 'LR1']],
      [['P', 'LPE'], ['P', 'LFO'], ['P', 'LR2'], ['P'], ['P', 'LR3']],
    ])
    expect(dst?.players?.[0]?.clergy).toStrictEqual(['LayBrother1', 'LayBrother2', 'Prior'])
    expect(dst?.players?.[1]?.landscape).toStrictEqual([
      [['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['H', 'LW1']],
      [['P', 'LPE'], ['P', 'LFO'], ['P', 'LW2'], ['P'], ['P', 'LW3']],
    ])
    expect(dst?.players?.[1]?.clergy).toStrictEqual(['LayBrother1', 'LayBrother2', 'Prior'])
    expect(dst?.players?.[2]?.landscape).toStrictEqual([
      [['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['H', 'LB1']],
      [['P', 'LPE'], ['P', 'LFO'], ['P', 'LB2'], ['P'], ['P', 'LB3']],
    ])
    expect(dst?.players?.[2]?.clergy).toStrictEqual(['LayBrother1', 'LayBrother2', 'Prior'])
  })
})

import { initialState } from '../../state'
import { GameCommandConfigParams, GameStatusEnum, PlayerColor } from '../../types'
import { config } from '../config'
import { start } from '../start'

// TODO: Refactor so this test works independently of "config"

describe('commands/start', () => {
  describe('start', () => {
    it('cannot start before configured', () => {
      const dst = start(
        {
          ...initialState,
          status: GameStatusEnum.SETUP,
        },
        { seed: 42, colors: [PlayerColor.Blue] }
      )
      expect(dst).toBeUndefined()
    })

    it('cannot start without config', () => {
      const dst = start(
        {
          ...initialState,
          rondel: {
            pointingBefore: 0,
          },
          status: GameStatusEnum.SETUP,
        },
        { seed: 42, colors: [PlayerColor.Red] }
      )
      expect(dst).toBeUndefined()
    })

    it('can start after being configured', () => {
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
        { seed: 1, colors: [PlayerColor.Red, PlayerColor.Green] }
      )
      expect(dst).toBeDefined()
      expect(dst?.players).toHaveLength(2)
    })

    it('will create a game with 3 players only', () => {
      const dst = start(
        {
          ...initialState,
          status: GameStatusEnum.SETUP,
          rondel: {
            pointingBefore: 0,
          },
          config: {
            country: 'france',
            length: 'long',
            // players will be filled in by the number of colors given
          } as GameCommandConfigParams,
        },
        { seed: 1, colors: [PlayerColor.Red, PlayerColor.Green, PlayerColor.Blue] }
      )
      expect(dst?.players).toHaveLength(3)
    })

    it('creates a tableau for every player', () => {
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
        { seed: 28, colors: [PlayerColor.Red, PlayerColor.Green, PlayerColor.Blue, PlayerColor.White] }
      )
      expect(dst).toBeDefined()
      expect(dst?.players).toHaveLength(4)
      expect(dst?.players?.[0]?.landscape).toStrictEqual([
        [[], [], ['P'], ['P'], ['P', 'LFO'], ['P'], ['H', 'LW1'], [], []],
        [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LW2'], ['P'], ['P', 'LW3'], [], []],
      ])
      expect(dst?.players?.[0]?.clergy).toStrictEqual(['LB1W', 'PRIW'])
      expect(dst?.players?.[1]?.landscape).toStrictEqual([
        [[], [], ['P'], ['P'], ['P', 'LFO'], ['P'], ['H', 'LB1'], [], []],
        [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LB2'], ['P'], ['P', 'LB3'], [], []],
      ])
      expect(dst?.players?.[1]?.clergy).toStrictEqual(['LB1B', 'PRIB'])
      expect(dst?.players?.[2]?.landscape).toStrictEqual([
        [[], [], ['P'], ['P'], ['P', 'LFO'], ['P'], ['H', 'LG1'], [], []],
        [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LG2'], ['P'], ['P', 'LG3'], [], []],
      ])
      expect(dst?.players?.[2]?.clergy).toStrictEqual(['LB1G', 'PRIG'])
      expect(dst?.players?.[3]?.landscape).toStrictEqual([
        [[], [], ['P'], ['P'], ['P', 'LFO'], ['P'], ['H', 'LR1'], [], []],
        [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LR2'], ['P'], ['P', 'LR3'], [], []],
      ])
      expect(dst?.players?.[3]?.clergy).toStrictEqual(['LB1R', 'PRIR'])
    })

    it('responds to alternate starting color order', () => {
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
        { seed: 15, colors: [PlayerColor.Red, PlayerColor.White, PlayerColor.Blue] }
      )
      expect(dst).toBeDefined()
      expect(dst?.players).toHaveLength(3)
      expect(dst?.players?.[0]?.landscape).toStrictEqual([
        [[], [], ['P'], ['P'], ['P', 'LFO'], ['P'], ['H', 'LR1'], [], []],
        [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LR2'], ['P'], ['P', 'LR3'], [], []],
      ])
      expect(dst?.players?.[0]?.clergy).toStrictEqual(['LB1R', 'PRIR'])
      expect(dst?.players?.[1]?.landscape).toStrictEqual([
        [[], [], ['P'], ['P'], ['P', 'LFO'], ['P'], ['H', 'LB1'], [], []],
        [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LB2'], ['P'], ['P', 'LB3'], [], []],
      ])
      expect(dst?.players?.[1]?.clergy).toStrictEqual(['LB1B', 'PRIB'])
      expect(dst?.players?.[2]?.landscape).toStrictEqual([
        [[], [], ['P'], ['P'], ['P', 'LFO'], ['P'], ['H', 'LW1'], [], []],
        [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LW2'], ['P'], ['P', 'LW3'], [], []],
      ])
      expect(dst?.players?.[2]?.clergy).toStrictEqual(['LB1W', 'PRIW'])
    })

    it('sets round, and moveInRound, and a starting player', () => {
      const s0 = initialState
      const s1 = config({ country: 'france', players: 4, length: 'long' })(s0)!
      const s2 = start(s1!, {
        colors: [PlayerColor.Red, PlayerColor.White, PlayerColor.Blue, PlayerColor.Green],
        seed: 12345,
      })!
      expect(s2.frame.startingPlayer).toBeGreaterThanOrEqual(0)
      expect(s2.frame.startingPlayer).toBeLessThan(4)
    })

    it('starts up with buildings and settlements', () => {
      const s0 = initialState
      const s1 = config({ country: 'france', players: 4, length: 'long' })(s0)!
      const s2 = start(s1, {
        colors: [PlayerColor.Red, PlayerColor.White, PlayerColor.Blue, PlayerColor.Green],
        seed: 14,
      })!
      const buildings = ['G01', 'G02', 'F03', 'F04', 'F05', 'G06', 'G07', 'F08', 'F09', 'F10', 'F11', 'G12', 'G13']
      expect(s2.buildings).toStrictEqual(buildings)
      expect(s2.players![0].settlements).toStrictEqual(['SR1', 'SR2', 'SR3', 'SR4'])
    })
  })
})

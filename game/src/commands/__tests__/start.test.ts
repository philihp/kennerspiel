import { parser } from '../../parser'
import { initialState } from '../../reducer'
import { GameStatusEnum, PlayerColor } from '../../types'
import { config } from '../config'
import { start } from '../start'

describe('commands/start', () => {
  describe('start', () => {
    it('cannot start before configured', () => {
      expect.assertions(1)
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
      expect.assertions(1)
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
        { seed: 42, colors: [PlayerColor.Red, PlayerColor.Green] }
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
        { seed: 42, colors: [PlayerColor.Red, PlayerColor.Green, PlayerColor.Blue, PlayerColor.White] }
      )
      expect(dst).toBeDefined()
      expect(dst?.players).toHaveLength(4)
      expect(dst?.players?.[0]?.landscape).toStrictEqual([
        [['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['H', 'LW1']],
        [['P', 'LPE'], ['P', 'LFO'], ['P', 'LW2'], ['P'], ['P', 'LW3']],
      ])
      expect(dst?.players?.[0]?.clergy).toStrictEqual(['LB1W', 'LB2W', 'PRIW'])
      expect(dst?.players?.[1]?.landscape).toStrictEqual([
        [['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['H', 'LB1']],
        [['P', 'LPE'], ['P', 'LFO'], ['P', 'LB2'], ['P'], ['P', 'LB3']],
      ])
      expect(dst?.players?.[1]?.clergy).toStrictEqual(['LB1B', 'LB2B', 'PRIB'])
      expect(dst?.players?.[2]?.landscape).toStrictEqual([
        [['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['H', 'LG1']],
        [['P', 'LPE'], ['P', 'LFO'], ['P', 'LG2'], ['P'], ['P', 'LG3']],
      ])
      expect(dst?.players?.[2]?.clergy).toStrictEqual(['LB1G', 'LB2G', 'PRIG'])
      expect(dst?.players?.[3]?.landscape).toStrictEqual([
        [['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['H', 'LR1']],
        [['P', 'LPE'], ['P', 'LFO'], ['P', 'LR2'], ['P'], ['P', 'LR3']],
      ])
      expect(dst?.players?.[3]?.clergy).toStrictEqual(['LB1R', 'LB2R', 'PRIR'])
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
        { seed: 42, colors: [PlayerColor.Red, PlayerColor.White, PlayerColor.Blue] }
      )
      expect(dst).toBeDefined()
      expect(dst?.players).toHaveLength(3)
      expect(dst?.players?.[0]?.landscape).toStrictEqual([
        [['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['H', 'LR1']],
        [['P', 'LPE'], ['P', 'LFO'], ['P', 'LR2'], ['P'], ['P', 'LR3']],
      ])
      expect(dst?.players?.[0]?.clergy).toStrictEqual(['LB1R', 'LB2R', 'PRIR'])
      expect(dst?.players?.[1]?.landscape).toStrictEqual([
        [['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['H', 'LB1']],
        [['P', 'LPE'], ['P', 'LFO'], ['P', 'LB2'], ['P'], ['P', 'LB3']],
      ])
      expect(dst?.players?.[1]?.clergy).toStrictEqual(['LB1B', 'LB2B', 'PRIB'])
      expect(dst?.players?.[2]?.landscape).toStrictEqual([
        [['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['H', 'LW1']],
        [['P', 'LPE'], ['P', 'LFO'], ['P', 'LW2'], ['P'], ['P', 'LW3']],
      ])
      expect(dst?.players?.[2]?.clergy).toStrictEqual(['LB1W', 'LB2W', 'PRIW'])
    })

    it('sets round, and moveInRound, and a starting player', () => {
      expect.assertions(4)
      const s0 = initialState
      const s1 = config(s0!, { country: 'france', players: 4, length: 'long' })
      const s2 = start(s1!, {
        colors: [PlayerColor.Red, PlayerColor.White, PlayerColor.Blue, PlayerColor.Green],
        seed: 12345,
      })
      expect(s2?.moveInRound).toBe(1)
      expect(s2?.round).toBe(1)
      expect(s2?.startingPlayer).toBeGreaterThanOrEqual(0)
      expect(s2?.startingPlayer).toBeLessThan(4)
    })

    it('starts up with buildings and settlements', () => {
      const s0 = initialState
      const s1 = config(s0, { country: 'france', players: 4, length: 'long' })!
      const s2 = start(s1, {
        colors: [PlayerColor.Red, PlayerColor.White, PlayerColor.Blue, PlayerColor.Green],
        seed: 12345,
      })!
      const buildings = ['G01', 'G02', 'F03', 'F04', 'F05', 'G06', 'G07', 'F08', 'F09', 'F10', 'F11', 'G12', 'G13']
      expect(s2.buildings).toStrictEqual(buildings)
      expect(s2.players![0].settlements).toStrictEqual(['SR1', 'SR2', 'SR3', 'SR4'])
    })
  })

  describe('parser', () => {
    it('parses colors', () => {
      expect.assertions(1)
      expect(parser(['START', '12345', 'R', 'B'])).toStrictEqual({
        command: 'START',
        params: {
          seed: 12345,
          colors: ['R', 'B'],
        },
      })
    })
    it('fails if no colors', () => {
      expect.assertions(1)
      expect(parser(['START', '42'])).toBeUndefined()
    })
    it('fails if not a number for seed', () => {
      expect.assertions(1)
      expect(parser(['START', 'ABC', 'R', 'B'])).toBeUndefined()
    })
  })
})

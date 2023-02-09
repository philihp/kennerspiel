import { config } from '../../commands/config'
import { start } from '../../commands/start'
import { initialState } from '../../reducer'
import { PlayerColor } from '../../types'
import { makeLandscape } from '../modeSetup'

describe('board/modeSetup', () => {
  describe('makeLandscape', () => {
    it('creates a landscape', () => {
      const ls = makeLandscape(PlayerColor.Red)
      expect(ls).toStrictEqual([
        [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['H', 'LR1'], [], []],
        [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LR2'], ['P'], ['P', 'LR3'], [], []],
      ])
    })
    it('creates a neutral landscape', () => {
      const ls = makeLandscape(PlayerColor.Blue, true)
      expect(ls).toStrictEqual([
        [[], [], ['P', 'G13'], ['P'], ['P'], ['P'], ['H', 'LB1'], [], []],
        [[], [], ['P'], ['P'], ['P', 'LB2'], ['P'], ['P', 'LB3'], [], []],
      ])
    })
  })

  describe('modeSetup', () => {
    it('sets up boards for solo play', () => {
      const s0 = initialState!
      const s1 = config(s0, { country: 'france', players: 1, length: 'long' })!
      const s2 = start(s1, { seed: 3, colors: [PlayerColor.Blue] })!
      expect(s2.players[0].landscape).toStrictEqual([
        [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['H', 'LB1'], [], []],
        [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LB2'], ['P'], ['P', 'LB3'], [], []],
      ])
      expect(s2.players[1].landscape).toStrictEqual([
        [[], [], ['P', 'G13'], ['P'], ['P'], ['P'], ['H', 'LG1'], [], []],
        [[], [], ['P'], ['P'], ['P', 'LG2'], ['P'], ['P', 'LG3'], [], []],
      ])
    })
  })
})

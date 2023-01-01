import { PlayerColor } from '../../types'
import { makeLandscape } from '../modeSetup'

describe('board/modeSetup', () => {
  describe('makeLandscape', () => {
    it('creates a landscape', () => {
      const ls = makeLandscape(PlayerColor.Red)
      expect(ls).toStrictEqual([
        [['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['H', 'LR1']],
        [['P', 'LPE'], ['P', 'LFO'], ['P', 'LR2'], ['P'], ['P', 'LR3']],
      ])
    })
    it('creates a neutral landscape', () => {
      const ls = makeLandscape(PlayerColor.Blue, true)
      expect(ls).toStrictEqual([
        [['P', 'G13'], ['P'], ['P'], ['P'], ['H', 'LB1']],
        [['P'], ['P'], ['P', 'LB2'], ['P'], ['P', 'LB3']],
      ])
    })
  })
})

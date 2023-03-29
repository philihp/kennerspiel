import { view } from '../player'
import { GameCommandConfigParams, GameStatePlaying, PlayerColor } from '../types'

describe('player', () => {
  describe('player/view', () => {
    it('can create a frame flower', () => {
      const config = {
        players: 3,
        length: 'long',
      } as GameCommandConfigParams
      const s0 = {
        config,
        players: [
          {
            color: PlayerColor.Red,
          },
          {
            color: PlayerColor.Green,
          },
          {
            color: PlayerColor.Blue,
          },
        ],
        frame: {
          activePlayerIndex: 0,
          next: 1,
        },
      } as GameStatePlaying

      const s1 = view(s0, 0)
      expect(s1.flow.map((f) => f.player).slice(0, 10)).toStrictEqual([
        'R',
        'G',
        'B',
        'R',
        'G',
        'B',
        'R',
        'G',
        'B',
        'R',
      ])
    })
  })
})

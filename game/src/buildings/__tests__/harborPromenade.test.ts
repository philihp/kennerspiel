import { initialState, reducer } from '../../reducer'
import { GameStatePlaying, NextUseClergy } from '../../types'

describe('buildings/carpentry', () => {
  describe('use', () => {
    it('goes through a happy path', () => {
      const s0 = initialState
      const s1 = reducer(s0, ['CONFIG', '4', 'france', 'long'])!
      const s2 = reducer(s1, ['START', '42', 'R', 'G', 'B', 'W'])! as GameStatePlaying
      expect(s2.activePlayerIndex).toBe(0)
      expect(s2.players[0].color).toBe('W')
      expect(s2.players[1].color).toBe('B')
      expect(s2.players[2].color).toBe('G')
      expect(s2.players[3].color).toBe('R')
      expect(s2.nextUse).toBe(NextUseClergy.Any)
      s2.players[0].wood = 2
      s2.players[0].clay = 1
      const s3 = reducer(s2, ['BUILD', 'F10', '3', '1'])! as GameStatePlaying
      expect(s3).toMatchObject({
        nextUse: NextUseClergy.OnlyPrior,
        usableBuildings: ['F10'],
      })
      // const s4 = reducer(s3, ['USE', 'F10', '0', '1'])! as GameStatePlaying
      // expect(s4).toMatchObject({
      //   usableBuildings: [],
      //   nextUse: NextUseClergy.None,
      // })
      // expect(s4.players[0].landscape[0][1]).toStrictEqual(['P'])
    })
  })
})

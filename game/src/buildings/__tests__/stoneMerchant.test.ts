import { reducer, initialState } from '../../reducer'
import { BuildingEnum, GameStatePlaying } from '../../types'

describe('buildings/stoneMerchant', () => {
  describe('use', () => {
    it('goes through a happy path', () => {
      const s0 = initialState
      const s1 = reducer(s0, ['CONFIG', '1', 'france', 'short'])!
      const s2 = reducer(s1, ['START', '42', 'R'])! as GameStatePlaying
      const s3 = {
        ...s2,
        players: [
          {
            ...s2?.players[0],
            wood: 1,
            peat: 2,
            bread: 3,
          },
          s2?.players.slice(1),
        ],
      } as GameStatePlaying
      const s4 = reducer(s3, ['BUILD', 'G12', '3', '1'])! as GameStatePlaying
      expect(s4.players[0]).toMatchObject({
        wood: 0,
        peat: 2,
        bread: 3,
      })
      expect(s4).toMatchObject({
        usableBuildings: ['G12'],
      })
      const s5 = reducer(s4, ['USE', 'G12', 'PtPtBrBrBr'])! as GameStatePlaying
      expect(s5.players[0]).toMatchObject({
        peat: 0,
        bread: 0,
        stone: 4,
      })
      expect(s5).toMatchObject({})
    })
  })
})

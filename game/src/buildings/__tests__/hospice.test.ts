import { reducer, initialState } from '../../reducer'
import { BuildingEnum, GameStatePlaying } from '../../types'
import { hospice } from '../hospice'

describe('buildings/hospice', () => {
  describe('hospice', () => {
    it('retains undefined state', () => {
      const s0: GameStatePlaying | undefined = undefined
      const s1 = hospice()(s0)
      expect(s1).toBeUndefined()
    })
    it('baseline happy path to build', () => {
      const s0 = initialState
      const s1 = reducer(s0, ['CONFIG', '4', 'france', 'long'])!
      const s2 = reducer(s1, ['START', '42', 'R', 'B', 'G', 'W'])! as GameStatePlaying
      const s3 = {
        ...s2,
        buildings: [BuildingEnum.HarborPromenade, BuildingEnum.Hospice],
        players: [
          {
            ...s2.players[0],
            wood: 3,
            straw: 1,
            penny: 0,
            wine: 0,
            pottery: 0,
          },
          ...s2.players.slice(1),
        ],
      }
      const s4 = reducer(s3, ['BUILD', 'F40', '3', '1'])! as GameStatePlaying
      expect(s4.players[0].landscape[1][5]).toStrictEqual(['P', 'F40'])
      expect(s4.players[0]).toMatchObject({
        wood: 0,
        straw: 0,
      })
      expect(s4).toMatchObject({
        usableBuildings: ['F40'],
        nextUse: 'only-prior',
      })
      const s5 = reducer(s4, ['USE', 'F40'])! as GameStatePlaying
      expect(s5).toMatchObject({
        usableBuildings: ['F11'],
        nextUse: 'free',
      })
      const s6 = reducer(s5, ['USE', 'F11'])! as GameStatePlaying
      expect(s6).toMatchObject({
        nextUse: 'none',
      })
      expect(s6.players[0]).toMatchObject({
        wood: 1,
        wine: 1,
        penny: 1,
        pottery: 1,
      })
    })
  })
})

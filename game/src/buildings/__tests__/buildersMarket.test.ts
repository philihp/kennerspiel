import { reducer, initialState } from '../../reducer'
import { BuildingEnum, GameStatePlaying } from '../../types'
import { buildersMarket } from '../buildersMarket'

describe('buildings/buildersMarket', () => {
  describe('buildersMarket', () => {
    it('retains undefined state', () => {
      const s0: GameStatePlaying | undefined = undefined
      const s1 = buildersMarket()(s0)
      expect(s1).toBeUndefined()
    })
    it('baseline happy path', () => {
      const s0 = initialState
      const s1 = reducer(s0, ['CONFIG', '4', 'france', 'long'])!
      const s2 = reducer(s1, ['START', '42', 'R', 'B', 'G', 'W'])! as GameStatePlaying
      const s3 = {
        ...s2,
        buildings: [BuildingEnum.BuildersMarket],
        players: [
          {
            ...s2.players[0],
            wood: 0,
            straw: 0,
            clay: 2,
            stone: 0,
            penny: 2,
          },
          ...s2.players.slice(1),
        ],
      }
      const s4 = reducer(s3, ['BUILD', 'G13', '3', '1'])! as GameStatePlaying
      expect(s4.players[0].landscape[1][5]).toStrictEqual(['P', 'G13'])
      expect(s4.players[0]).toMatchObject({
        clay: 0,
        penny: 2,
      })
      expect(s4).toMatchObject({
        buildings: [],
        nextUse: 'only-prior',
        usableBuildings: ['G13'],
      })
      const s5 = reducer(s4, ['USE', 'G13', 'PnPn'])! as GameStatePlaying
      expect(s5.players[0]).toMatchObject({
        penny: 0,
        wood: 1,
        clay: 1,
        stone: 1,
        straw: 1,
      })
    })
  })
})

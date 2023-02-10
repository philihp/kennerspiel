import { reducer } from '../../reducer'
import { initialState } from '../../state'
import { BuildingEnum, GameStatePlaying } from '../../types'
import { chamberOfWonders } from '../chamberOfWonders'

describe('buildings/chamberOfWonders', () => {
  describe('chamberOfWonders', () => {
    it('retains undefined state', () => {
      const s0: GameStatePlaying | undefined = undefined
      const s1 = chamberOfWonders()(s0)
      expect(s1).toBeUndefined()
    })
    it('baseline happy path', () => {
      const s0 = initialState
      const s1 = reducer(s0, ['CONFIG', '4', 'france', 'long'])!
      const s2 = reducer(s1, ['START', '42', 'R', 'B', 'G', 'W'])! as GameStatePlaying
      const s3 = {
        ...s2,
        buildings: [BuildingEnum.ChamberOfWonders],
        players: [
          {
            ...s2.players[0],
            penny: 1,
            clay: 2,
            wood: 2,
            grain: 1,
            sheep: 1,
            stone: 1,
            flour: 1,
            grape: 1,
            coal: 1,
            book: 1,
            pottery: 1,
            straw: 1,
          },
          ...s2.players.slice(1),
        ],
      }
      const s4 = reducer(s3, ['BUILD', 'F25', '3', '1'])! as GameStatePlaying
      expect(s4.players[0].landscape[1][5]).toStrictEqual(['P', 'F25'])
      expect(s4.players[0]).toMatchObject({
        peat: 1,
        penny: 1,
        clay: 1,
        wood: 1,
        grain: 1,
        sheep: 1,
        stone: 1,
        flour: 1,
        grape: 1,
        coal: 1,
        book: 1,
        pottery: 1,
        straw: 1,
      })
      expect(s4).toMatchObject({
        buildings: [],
      })
      expect(s4.frame).toMatchObject({
        nextUse: 'only-prior',
        usableBuildings: ['F25'],
      })
      const s5 = reducer(s4, ['USE', 'F25', 'PtPnClWoGnShSnFlGpCoBoPoSw'])! as GameStatePlaying
      expect(s5.players[0]).toMatchObject({
        peat: 0,
        penny: 0,
        clay: 0,
        wood: 0,
        grain: 0,
        sheep: 0,
        stone: 0,
        flour: 0,
        grape: 0,
        coal: 0,
        book: 0,
        pottery: 0,
        straw: 0,
      })
    })
  })
})

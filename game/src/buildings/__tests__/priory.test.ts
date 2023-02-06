import { reducer, initialState } from '../../reducer'
import { BuildingEnum, Clergy, GameStatePlaying, LandEnum, NextUseClergy, PlayerColor } from '../../types'
import { priory } from '../priory'

describe('buildings/proiry', () => {
  describe('use', () => {
    it('retains undefined state', () => {
      const s0: GameStatePlaying | undefined = undefined
      const s1 = priory()(s0)
      expect(s1).toBeUndefined()
    })
    it('using priory allows usage of many buildings except itself', () => {
      const s0 = initialState
      const s1 = reducer(s0, ['CONFIG', '3', 'france', 'short'])!
      const s2 = reducer(s1, ['START', '15', 'R', 'B', 'G'])! as GameStatePlaying
      expect(s2.players[0].color).toBe(PlayerColor.Red)
      expect(s2.players[1].color).toBe(PlayerColor.Green)
      expect(s2.players[2].color).toBe(PlayerColor.Blue)
      const s3: GameStatePlaying = {
        ...s2,
        buildings: [BuildingEnum.Priory],
        players: [
          {
            ...s2.players[0],
            landscape: [
              [[], [], [LandEnum.Plains], [LandEnum.Plains, BuildingEnum.CloisterOfficeR], [], []],
              [[], [], [LandEnum.Plains], [LandEnum.Plains], [], []],
            ],
            wood: 1,
            clay: 1,
            penny: 1,
          },
          {
            ...s2.players[1],
            clergy: [Clergy.LayBrother1G, Clergy.LayBrother2G],
            landscape: [[[LandEnum.Plains, BuildingEnum.GrainStorage, Clergy.PriorG]]],
          },
          {
            ...s2.players[2],
            clergy: [Clergy.LayBrother1B, Clergy.LayBrother2B, Clergy.PriorB],
            landscape: [[[LandEnum.Plains, BuildingEnum.Windmill]]],
          },
        ],
      }
      const s4 = reducer(s3, ['BUILD', BuildingEnum.Priory, '0', '0'])! as GameStatePlaying
      expect(s4.turn).toMatchObject({
        nextUse: NextUseClergy.OnlyPrior,
        usableBuildings: [BuildingEnum.Priory],
      })
      const s5 = reducer(s4, ['USE', BuildingEnum.Priory])! as GameStatePlaying
      expect(s5.turn).toMatchObject({
        nextUse: NextUseClergy.Free,
        usableBuildings: [BuildingEnum.GrainStorage],
      })
      const s6 = reducer(s5, ['USE', BuildingEnum.GrainStorage, 'Pn'])! as GameStatePlaying
      expect(s6.players[0]).toMatchObject({
        penny: 0,
        grain: 8,
      })
      expect(s6.turn).toMatchObject({
        nextUse: NextUseClergy.None,
        usableBuildings: [],
      })
    })
  })
})

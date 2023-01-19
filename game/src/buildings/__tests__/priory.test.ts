import { reducer, initialState } from '../../reducer'
import { BuildingEnum, Clergy, GameStatePlaying, LandEnum, NextUseClergy, PlayerColor } from '../../types'

describe('buildings/proiry', () => {
  describe('use', () => {
    it('using priory allows usage of many buildings except itself', () => {
      const s0 = initialState
      const s1 = reducer(s0, ['CONFIG', '3', 'france', 'short'])!
      const s2 = reducer(s1, ['START', '42', 'R', 'B', 'G'])! as GameStatePlaying
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
              [[LandEnum.Plains], [LandEnum.Plains, BuildingEnum.CloisterOfficeR]],
              [[LandEnum.Plains], [LandEnum.Plains]],
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
            clergy: [Clergy.LayBrother1B, Clergy.LayBrother2B],
            landscape: [[[LandEnum.Plains, BuildingEnum.Windmill, Clergy.PriorB]]],
          },
        ],
      }
      const s4 = reducer(s3, ['BUILD', BuildingEnum.Priory, '0', '0'])! as GameStatePlaying
      expect(s4).toMatchObject({
        nextUse: NextUseClergy.OnlyPrior,
        usableBuildings: [BuildingEnum.Priory],
      })
      const s5 = reducer(s4, ['USE', BuildingEnum.Priory])! as GameStatePlaying
      expect(s5).toMatchObject({
        nextUse: NextUseClergy.Free,
        usableBuildings: [BuildingEnum.GrainStorage, BuildingEnum.Windmill],
      })
      const s6 = reducer(s5, ['USE', BuildingEnum.GrainStorage])! as GameStatePlaying
      expect(s6.players[0]).toMatchObject({
        penny: 0,
        grain: 8,
      })
      expect(s6).toMatchObject({
        nextUse: NextUseClergy.None,
        usableBuildings: [],
      })
    })
  })
})

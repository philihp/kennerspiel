import { config } from '../../commands/config'
import { start } from '../../commands/start'
import { use } from '../../commands/use'
import { initialState } from '../../reducer'
import { BuildingEnum, PlayerColor, ResourceEnum } from '../../types'

describe('buildings/farmyard', () => {
  describe('use', () => {
    it('goes through a happy path', () => {
      const s0 = initialState
      const s1 = config(s0!, { country: 'france', length: 'short', players: 3 })
      expect(s1).toBeDefined()
      const s2 = start(s1!, { colors: [PlayerColor.Red, PlayerColor.Blue, PlayerColor.Green], seed: 42 })
      expect(s2).toBeDefined()
      expect(s2?.activePlayerIndex).toBe(0)
      expect(s2?.players![0].landscape?.[1][2]).toStrictEqual(['P', 'LR2'])
      const s3 = use(s2!, { building: BuildingEnum.FarmYardR, p1: [ResourceEnum.Sheep] })
      expect(s3?.rondel?.sheep).toBe(s3?.rondel?.pointingBefore)
    })
  })
})

import { BuildingEnum, ErectionEnum, LandEnum, SettlementEnum } from '../../types'
import { terrainForErection } from '../erections'

describe('board/erections', () => {
  describe('terrainForErection', () => {
    it('fulfills terrain exception matrix', () => {
      expect.assertions(90)
      const tests: [
        canBuildWater: 0 | 1,
        canBuildCoast: 0 | 1,
        canBuildPlains: 0 | 1,
        canBuildHills: 0 | 1,
        canBuildMountain: 0 | 1,
        erection: ErectionEnum,
      ][] = [
        [0, 1, 1, 1, 0, BuildingEnum.Priory],
        [0, 1, 0, 1, 0, BuildingEnum.Windmill],
        [0, 1, 0, 0, 0, BuildingEnum.FalseLighthouse],
        [0, 1, 0, 0, 0, BuildingEnum.HarborPromenade],
        [1, 0, 0, 0, 0, BuildingEnum.Houseboat],
        [0, 0, 0, 1, 0, BuildingEnum.GrapevineA],
        [0, 0, 0, 1, 0, BuildingEnum.GrapevineB],
        [0, 0, 0, 1, 0, BuildingEnum.DruidsHouse],
        [0, 0, 0, 0, 1, BuildingEnum.QuarryA],
        [0, 0, 0, 0, 1, BuildingEnum.QuarryB],
        [0, 1, 0, 0, 0, BuildingEnum.Shipyard],
        [0, 0, 0, 1, 0, BuildingEnum.Palace],
        [0, 0, 0, 1, 1, BuildingEnum.Castle],
        [0, 1, 0, 0, 0, BuildingEnum.CoalHarbor],
        [0, 1, 0, 0, 0, BuildingEnum.ShippingCompany],
        [0, 0, 0, 1, 0, BuildingEnum.RoundTower],
        [0, 1, 0, 0, 0, SettlementEnum.FishingVillageR],
        [0, 0, 0, 1, 0, SettlementEnum.HilltopVillageW],
      ]
      tests.forEach(([w, c, p, h, m, erection]) => {
        const allowableTerrain = terrainForErection(erection)
        expect(allowableTerrain.includes(LandEnum.Water)).toBe(!!w)
        expect(allowableTerrain.includes(LandEnum.Coast)).toBe(!!c)
        expect(allowableTerrain.includes(LandEnum.Plains)).toBe(!!p)
        expect(allowableTerrain.includes(LandEnum.Hillside)).toBe(!!h)
        expect(allowableTerrain.includes(LandEnum.Mountain)).toBe(!!m)
      })
    })
  })
})

import { BuildingEnum, ErectionEnum, LandEnum, SettlementEnum } from '../../types'
import { pointsForBuilding, pointsForDwelling, terrainForErection } from '../erections'

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

  describe('pointsForBuilding and pointsForDwelling', () => {
    it('has all of the correct building values', () => {
      // just some sanity here, i copied the building values from the reference sheet, but when i did
      // the following, i copied them from the cards themselves.
      const tests: [ErectionEnum, number, number][] = [
        [BuildingEnum.Priory, 4, 3],
        [BuildingEnum.CloisterCourtyard, 4, 4],
        [BuildingEnum.GrainStorage, 3, 4],
        [BuildingEnum.Windmill, 10, 6],
        [BuildingEnum.Bakery, 4, 5],
        [BuildingEnum.FuelMerchant, 5, 2],
        [BuildingEnum.PeatCoalKiln, 4, -2],
        [BuildingEnum.Market, 5, 8],
        [BuildingEnum.CloisterGarden, 5, 0],
        [BuildingEnum.Carpentry, 7, 0],
        [BuildingEnum.HarborPromenade, 1, 7],
        [BuildingEnum.StoneMerchant, 6, 1],
        [BuildingEnum.BuildersMarket, 6, 1],
        [BuildingEnum.GrapevineA, 3, 6],
        [BuildingEnum.FinancedEstate, 4, 6],
        [BuildingEnum.CloisterChapterHouse, 2, 5],
        [BuildingEnum.CloisterLibrary, 7, 7],
        [BuildingEnum.CloisterWorkshop, 7, 2],
        [BuildingEnum.Slaughterhouse, 8, -3],
        [BuildingEnum.Inn, 4, 6],
        [BuildingEnum.Winery, 4, 5],
        [BuildingEnum.QuarryA, 7, -4],
        [BuildingEnum.Bathhouse, 2, 6],
        [BuildingEnum.CloisterChurch, 12, 9],
        [BuildingEnum.ChamberOfWonders, 0, 6],
        [BuildingEnum.Shipyard, 15, -2],
        [BuildingEnum.Palace, 25, 8],
        [BuildingEnum.QuarryB, 7, -4],
        [BuildingEnum.Castle, 15, 7],
        [BuildingEnum.TownEstate, 6, 5],
        [BuildingEnum.GrapevineB, 3, 6],
        [BuildingEnum.Calefactory, 2, 5],
        [BuildingEnum.ShippingCompany, 8, 4],
        [BuildingEnum.Sacristy, 10, 7],
        [BuildingEnum.ForgersWorkshop, 4, 2],
        [BuildingEnum.PilgrimageSite, 2, 6],
        [BuildingEnum.Dormitory, 3, 4],
        [BuildingEnum.PrintingOffice, 5, 5],
        [BuildingEnum.Estate, 5, 6],
        [BuildingEnum.Hospice, 7, 5],
        [BuildingEnum.HouseOfTheBrotherhood, 3, 3],
        // and ireland
        [BuildingEnum.Granary, 2, 3],
        [BuildingEnum.Malthouse, 5, 4],
        [BuildingEnum.Brewery, 9, 7],
        [BuildingEnum.FalseLighthouse, 5, 5],
        [BuildingEnum.SpinningMill, 3, 3],
        [BuildingEnum.Cottage, 5, 0],
        [BuildingEnum.Houseboat, 4, 6],
        [BuildingEnum.SacredSite, 3, 6],
        [BuildingEnum.DruidsHouse, 6, 6],
        [BuildingEnum.Scriptorium, 3, 5],
        [BuildingEnum.Alehouse, 3, 6],
        [BuildingEnum.WhiskeyDistillery, 6, 5],
        [BuildingEnum.Locutory, 7, 1],
        [BuildingEnum.Chapel, 10, 8],
        [BuildingEnum.Portico, 2, 6],
        [BuildingEnum.GrandManor, 18, 7],
        [BuildingEnum.ForestHut, 1, 5],
        [BuildingEnum.Refectory, 4, 5],
        [BuildingEnum.CoalHarbor, 12, 0],
        [BuildingEnum.FilialChurch, 6, 7],
        [BuildingEnum.Cooperage, 5, 3],
        [BuildingEnum.RoundTower, 6, 9],
        [BuildingEnum.Camera, 5, 3],
        [BuildingEnum.Bulwark, 8, 6],
        [BuildingEnum.FestivalGround, 3, 7],
        [BuildingEnum.Guesthouse, 7, 5],
        [SettlementEnum.ShantyTownR, 0, -3],
        [SettlementEnum.FarmingVillageR, 1, 1],
        [SettlementEnum.MarketTownR, 2, 2],
        [SettlementEnum.FishingVillageR, 4, 6],
        [SettlementEnum.ArtistsColonyR, -1, 5],
        [SettlementEnum.HamletR, 3, 4],
        [SettlementEnum.VillageR, 8, 6],
        [SettlementEnum.HilltopVillageR, 10, 8],
        [SettlementEnum.ShantyTownG, 0, -3],
        [SettlementEnum.FarmingVillageG, 1, 1],
        [SettlementEnum.MarketTownG, 2, 2],
        [SettlementEnum.FishingVillageG, 4, 6],
        [SettlementEnum.ArtistsColonyG, -1, 5],
        [SettlementEnum.HamletG, 3, 4],
        [SettlementEnum.VillageG, 8, 6],
        [SettlementEnum.HilltopVillageG, 10, 8],
        [SettlementEnum.ShantyTownB, 0, -3],
        [SettlementEnum.FarmingVillageB, 1, 1],
        [SettlementEnum.MarketTownB, 2, 2],
        [SettlementEnum.FishingVillageB, 4, 6],
        [SettlementEnum.ArtistsColonyB, -1, 5],
        [SettlementEnum.HamletB, 3, 4],
        [SettlementEnum.VillageB, 8, 6],
        [SettlementEnum.HilltopVillageB, 10, 8],
        [SettlementEnum.ShantyTownW, 0, -3],
        [SettlementEnum.FarmingVillageW, 1, 1],
        [SettlementEnum.MarketTownW, 2, 2],
        [SettlementEnum.FishingVillageW, 4, 6],
        [SettlementEnum.ArtistsColonyW, -1, 5],
        [SettlementEnum.HamletW, 3, 4],
        [SettlementEnum.VillageW, 8, 6],
        [SettlementEnum.HilltopVillageW, 10, 8],
        [BuildingEnum.Moor, 0, 0],
        [BuildingEnum.Forest, 0, 0],
        [BuildingEnum.ClayMoundR, 0, 3],
        [BuildingEnum.FarmYardR, 0, 2],
        [BuildingEnum.CloisterOfficeR, 0, 2],
        [BuildingEnum.ClayMoundG, 0, 3],
        [BuildingEnum.FarmYardG, 0, 2],
        [BuildingEnum.CloisterOfficeG, 0, 2],
        [BuildingEnum.ClayMoundB, 0, 3],
        [BuildingEnum.FarmYardB, 0, 2],
        [BuildingEnum.CloisterOfficeB, 0, 2],
        [BuildingEnum.ClayMoundW, 0, 3],
        [BuildingEnum.FarmYardW, 0, 2],
        [BuildingEnum.CloisterOfficeW, 0, 2],
      ]
      tests.forEach(([erection, shield, dwelling]) => {
        expect([erection, pointsForBuilding(erection)]).toStrictEqual([erection, shield])
        expect([erection, pointsForDwelling(erection)]).toStrictEqual([erection, dwelling])
      })
    })
  })
})

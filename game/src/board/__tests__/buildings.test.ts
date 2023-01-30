import { BuildingEnum, SettlementRound } from '../../types'
import { costForBuilding, isCloisterBuilding, roundBuildings } from '../buildings'

describe('build/buildings', () => {
  describe('costForBuilding', () => {
    it('has appropriate building materials for Priory', () => {
      expect(costForBuilding(BuildingEnum.Priory)).toStrictEqual({ clay: 1, wood: 1 })
    })
    it('has appropriate building materials for Cloister Courtyard', () => {
      expect(costForBuilding(BuildingEnum.CloisterCourtyard)).toStrictEqual({ wood: 2 })
    })
    it('has appropriate building materials for Grain Storage', () => {
      expect(costForBuilding(BuildingEnum.GrainStorage)).toStrictEqual({ wood: 1, straw: 1 })
    })
    it('has appropriate building materials for Windmill', () => {
      expect(costForBuilding(BuildingEnum.Windmill)).toStrictEqual({ wood: 3, clay: 2 })
    })
    it('has appropriate building materials for Bakery', () => {
      expect(costForBuilding(BuildingEnum.Bakery)).toStrictEqual({ clay: 2, straw: 1 })
    })
    it('has appropriate building materials for Fuel Merchant', () => {
      expect(costForBuilding(BuildingEnum.FuelMerchant)).toStrictEqual({ clay: 1, straw: 1 })
    })
    it('has appropriate building materials for Peat Coal Kiln', () => {
      expect(costForBuilding(BuildingEnum.PeatCoalKiln)).toStrictEqual({ clay: 1 })
    })
    it('has appropriate building materials for Market', () => {
      expect(costForBuilding(BuildingEnum.Market)).toStrictEqual({ stone: 2 })
    })
    it('has appropriate building materials for Cloister Garden', () => {
      expect(costForBuilding(BuildingEnum.CloisterGarden)).toStrictEqual({ penny: 3 })
    })
    it('has appropriate building materials for Carpentry', () => {
      expect(costForBuilding(BuildingEnum.Carpentry)).toStrictEqual({ wood: 2, clay: 1 })
    })
    it('has appropriate building materials for Harbor Promenade', () => {
      expect(costForBuilding(BuildingEnum.HarborPromenade)).toStrictEqual({ wood: 1, stone: 1 })
    })
    it('has appropriate building materials for Stone Merchant', () => {
      expect(costForBuilding(BuildingEnum.StoneMerchant)).toStrictEqual({ wood: 1 })
    })
    it("has appropriate building materials for Builders' Market", () => {
      expect(costForBuilding(BuildingEnum.BuildersMarket)).toStrictEqual({ clay: 2 })
    })
    it('has appropriate building materials for Grapevine', () => {
      expect(costForBuilding(BuildingEnum.GrapevineA)).toStrictEqual({ wood: 1 })
    })
    it('has appropriate building materials for Financed Estate', () => {
      expect(costForBuilding(BuildingEnum.FinancedEstate)).toStrictEqual({ clay: 1, stone: 1 })
    })
    it('has appropriate building materials for Cloister Chapter House', () => {
      expect(costForBuilding(BuildingEnum.CloisterChapterHouse)).toStrictEqual({ clay: 3, straw: 1 })
    })
    it('has appropriate building materials for Cloister Library', () => {
      expect(costForBuilding(BuildingEnum.CloisterLibrary)).toStrictEqual({ straw: 1, stone: 2 })
    })
    it('has appropriate building materials for Cloister Workshop', () => {
      expect(costForBuilding(BuildingEnum.CloisterWorkshop)).toStrictEqual({ wood: 3 })
    })
    it('has appropriate building materials for Slaughterhouse', () => {
      expect(costForBuilding(BuildingEnum.Slaughterhouse)).toStrictEqual({ wood: 2, clay: 2 })
    })
    it('has appropriate building materials for Inn', () => {
      expect(costForBuilding(BuildingEnum.Inn)).toStrictEqual({ wood: 2, straw: 2 })
    })
    it('has appropriate building materials for Cloister Church', () => {
      expect(costForBuilding(BuildingEnum.CloisterChurch)).toStrictEqual({ clay: 5, stone: 3 })
    })
    it('has appropriate building materials for Quarry A', () => {
      expect(costForBuilding(BuildingEnum.QuarryA)).toStrictEqual({ penny: 5 })
    })
    it('has appropriate building materials for Winery', () => {
      expect(costForBuilding(BuildingEnum.Winery)).toStrictEqual({ clay: 2, straw: 2 })
    })
    it('has appropriate building materials for Palace', () => {
      expect(costForBuilding(BuildingEnum.Palace)).toStrictEqual({ penny: 25 })
    })
    it('has appropriate building materials for Quarry B', () => {
      expect(costForBuilding(BuildingEnum.QuarryB)).toStrictEqual({ penny: 5 })
    })
  })
  describe('roundBuildings', () => {
    it('returns a list of buildings given a round', () => {
      expect(roundBuildings({ players: 3, country: 'france', length: 'long' }, SettlementRound.B)).toStrictEqual([
        'F20',
        'F21',
        'G22',
        'F24',
        'G26',
      ])
    })
    it('does not contain specific cards in solo', () => {
      const s = roundBuildings({ players: 1, country: 'france', length: 'long' }, SettlementRound.S)
      const a = roundBuildings({ players: 1, country: 'france', length: 'long' }, SettlementRound.A)
      const b = roundBuildings({ players: 1, country: 'france', length: 'long' }, SettlementRound.B)
      const c = roundBuildings({ players: 1, country: 'france', length: 'long' }, SettlementRound.C)
      const d = roundBuildings({ players: 1, country: 'france', length: 'long' }, SettlementRound.D)
      expect(s).not.toContain('F10')
      expect(a).not.toContain('F10')
      expect(b).not.toContain('F10')
      expect(c).not.toContain('F10')
      expect(d).not.toContain('F10')
    })
  })
  describe('isCloisterBuilding', () => {
    it('considers Priory as a cloister', () => {
      expect(isCloisterBuilding(BuildingEnum.Priory)).toBeTruthy()
    })
    it('does not consider Market as a cloister', () => {
      expect(isCloisterBuilding(BuildingEnum.Market)).toBeFalsy()
    })
    it('does defines undefined as false', () => {
      expect(isCloisterBuilding(undefined)).toBeFalsy()
    })
  })
})

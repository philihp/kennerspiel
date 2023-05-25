import {
  BuildingEnum,
  Clergy,
  GameStatePlaying,
  GameStatusEnum,
  NextUseClergy,
  PlayerColor,
  SettlementRound,
  Tableau,
  Tile,
} from '../../types'
import { costForBuilding, introduceBuildings, isCloisterBuilding, roundBuildings } from '../buildings'
import { initialState } from '../../state'

describe('build/buildings', () => {
  describe('introduceBuildings', () => {
    const p0: Tableau = {
      color: PlayerColor.Blue,
      clergy: ['LB1B', 'LB2B', 'PRIB'] as Clergy[],
      settlements: [],
      landscape: [
        [[], [], ['P'], ['P'], ['P'], ['P'], ['P'], [], []],
        [[], [], ['P'], ['P'], ['P'], ['P'], ['P'], [], []],
      ] as Tile[][],
      wonders: 0,
      landscapeOffset: 0,
      peat: 0,
      penny: 100,
      clay: 0,
      wood: 0,
      grain: 0,
      sheep: 0,
      stone: 0,
      flour: 0,
      grape: 0,
      nickel: 0,
      malt: 0,
      coal: 0,
      book: 0,
      ceramic: 0,
      whiskey: 0,
      straw: 0,
      meat: 0,
      ornament: 0,
      bread: 0,
      wine: 0,
      beer: 0,
      reliquary: 0,
    }
    const s0: GameStatePlaying = {
      ...initialState,
      status: GameStatusEnum.PLAYING,
      config: {
        country: 'france',
        players: 3,
        length: 'long',
      },
      rondel: {
        pointingBefore: 0,
      },
      wonders: 0,
      players: [{ ...p0 }, { ...p0 }, { ...p0 }],
      buildings: [],
      plotPurchasePrices: [1, 1, 1, 1, 1, 1],
      districtPurchasePrices: [],
      frame: {
        next: 1,
        round: 1,
        startingPlayer: 1,
        settlementRound: SettlementRound.S,
        currentPlayerIndex: 0,
        activePlayerIndex: 0,
        neutralBuildingPhase: false,
        bonusRoundPlacement: false,
        mainActionUsed: false,
        bonusActions: [],
        canBuyLandscape: true,
        unusableBuildings: [],
        usableBuildings: [],
        nextUse: NextUseClergy.Any,
      },
    }

    it('retains undefined state', () => {
      const s1 = introduceBuildings(undefined)!
      expect(s1).toBeUndefined()
    })

    it('adds some buildings', () => {
      const s1 = introduceBuildings(s0)!
      expect(s0.buildings).toHaveLength(0)
      expect(s1.buildings).not.toHaveLength(0)
    })
  })

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
    it('has appropriate building materials for Grapevine A', () => {
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
    it('has appropriate building materials for Grapevine B', () => {
      expect(costForBuilding(BuildingEnum.GrapevineB)).toStrictEqual({ wood: 1 })
    })
    it('has appropriate building materials for Town Estate', () => {
      expect(costForBuilding(BuildingEnum.TownEstate)).toStrictEqual({ stone: 2, straw: 2 })
    })
    it('has appropriate building materials for Palace', () => {
      expect(costForBuilding(BuildingEnum.Palace)).toStrictEqual({ penny: 25 })
    })
    it('has appropriate building materials for Quarry B', () => {
      expect(costForBuilding(BuildingEnum.QuarryB)).toStrictEqual({ penny: 5 })
    })
    it('has appropriate building materials for Shipyard', () => {
      expect(costForBuilding(BuildingEnum.Shipyard)).toStrictEqual({ clay: 4, stone: 1 })
    })
    it('has appropriate building materials for Estate', () => {
      expect(costForBuilding(BuildingEnum.Estate)).toStrictEqual({ wood: 2, stone: 2 })
    })
    it("has appropriate building materials for Forgers' Workshop", () => {
      expect(costForBuilding(BuildingEnum.ForgersWorkshop)).toStrictEqual({ clay: 2, straw: 1 })
    })
    it('has appropriate building materials for PilgrimageSite', () => {
      expect(costForBuilding(BuildingEnum.PilgrimageSite)).toStrictEqual({ penny: 6 })
    })
    it('has appropriate building materials for Hospice', () => {
      expect(costForBuilding(BuildingEnum.Hospice)).toStrictEqual({ wood: 3, straw: 1 })
    })
    it('has appropriate building materials for House of the Brotherhood', () => {
      expect(costForBuilding(BuildingEnum.HouseOfTheBrotherhood)).toStrictEqual({ clay: 1, stone: 1 })
    })
    it('has appropriate building materials for Shipping Company', () => {
      expect(costForBuilding(BuildingEnum.ShippingCompany)).toStrictEqual({ wood: 3, clay: 3 })
    })
    it('has appropriate building materials for Bathhouse', () => {
      expect(costForBuilding(BuildingEnum.Bathhouse)).toStrictEqual({ stone: 1, straw: 1 })
    })
    it('has appropriate building materials for Chamber Of Wonders', () => {
      expect(costForBuilding(BuildingEnum.ChamberOfWonders)).toStrictEqual({ wood: 1, clay: 1 })
    })
    it('has appropriate building materials for Castle', () => {
      expect(costForBuilding(BuildingEnum.Castle)).toStrictEqual({ wood: 6, stone: 5 })
    })
    it('has appropriate building materials for Dormitory', () => {
      expect(costForBuilding(BuildingEnum.Dormitory)).toStrictEqual({ clay: 3 })
    })
    it('has appropriate building materials for Printing Office', () => {
      expect(costForBuilding(BuildingEnum.PrintingOffice)).toStrictEqual({ stone: 2, wood: 1 })
    })
    it('has appropriate building materials for Sacristy', () => {
      expect(costForBuilding(BuildingEnum.Sacristy)).toStrictEqual({ stone: 3, straw: 2 })
    })
    it('returns empty cost for unknown building', () => {
      expect(costForBuilding('XXX' as BuildingEnum)).toStrictEqual({})
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
    it('introduces priory', () => {
      expect(roundBuildings({ players: 1, country: 'france', length: 'short' }, SettlementRound.S)).toContain('G01')
      expect(roundBuildings({ players: 1, country: 'france', length: 'long' }, SettlementRound.S)).toContain('G01')
      expect(roundBuildings({ players: 2, country: 'france', length: 'short' }, SettlementRound.S)).not.toContain('G01')
      expect(roundBuildings({ players: 2, country: 'france', length: 'long' }, SettlementRound.S)).not.toContain('G01')
      expect(roundBuildings({ players: 3, country: 'france', length: 'short' }, SettlementRound.S)).toContain('G01')
      expect(roundBuildings({ players: 3, country: 'france', length: 'long' }, SettlementRound.S)).toContain('G01')
      expect(roundBuildings({ players: 4, country: 'france', length: 'short' }, SettlementRound.S)).toContain('G01')
      expect(roundBuildings({ players: 4, country: 'france', length: 'long' }, SettlementRound.S)).toContain('G01')
    })
    it('introduces cloister courtyard', () => {
      expect(roundBuildings({ players: 1, country: 'france', length: 'short' }, SettlementRound.S)).toContain('G02')
      expect(roundBuildings({ players: 1, country: 'france', length: 'long' }, SettlementRound.S)).toContain('G02')
      expect(roundBuildings({ players: 2, country: 'france', length: 'short' }, SettlementRound.S)).toContain('G02')
      expect(roundBuildings({ players: 2, country: 'france', length: 'long' }, SettlementRound.S)).toContain('G02')
      expect(roundBuildings({ players: 3, country: 'france', length: 'short' }, SettlementRound.S)).toContain('G02')
      expect(roundBuildings({ players: 3, country: 'france', length: 'long' }, SettlementRound.S)).toContain('G02')
      expect(roundBuildings({ players: 4, country: 'france', length: 'short' }, SettlementRound.S)).toContain('G02')
      expect(roundBuildings({ players: 4, country: 'france', length: 'long' }, SettlementRound.S)).toContain('G02')
    })
    it('introduces grain storage', () => {
      expect(roundBuildings({ players: 1, country: 'france', length: 'short' }, SettlementRound.S)).toContain('F03')
      expect(roundBuildings({ players: 1, country: 'france', length: 'long' }, SettlementRound.S)).toContain('F03')
      expect(roundBuildings({ players: 2, country: 'france', length: 'short' }, SettlementRound.S)).not.toContain('F03')
      expect(roundBuildings({ players: 2, country: 'france', length: 'long' }, SettlementRound.S)).not.toContain('F03')
      expect(roundBuildings({ players: 3, country: 'france', length: 'short' }, SettlementRound.S)).not.toContain('F03')
      expect(roundBuildings({ players: 3, country: 'france', length: 'long' }, SettlementRound.S)).not.toContain('F03')
      expect(roundBuildings({ players: 4, country: 'france', length: 'short' }, SettlementRound.S)).toContain('F03')
      expect(roundBuildings({ players: 4, country: 'france', length: 'long' }, SettlementRound.S)).toContain('F03')
    })
    it('introduces granary', () => {
      expect(roundBuildings({ players: 1, country: 'ireland', length: 'short' }, SettlementRound.S)).toContain('I03')
      expect(roundBuildings({ players: 1, country: 'ireland', length: 'long' }, SettlementRound.S)).toContain('I03')
      expect(roundBuildings({ players: 2, country: 'ireland', length: 'short' }, SettlementRound.S)).not.toContain(
        'I03'
      )
      expect(roundBuildings({ players: 2, country: 'ireland', length: 'long' }, SettlementRound.S)).not.toContain('I03')
      expect(roundBuildings({ players: 3, country: 'ireland', length: 'short' }, SettlementRound.S)).not.toContain(
        'I03'
      )
      expect(roundBuildings({ players: 3, country: 'ireland', length: 'long' }, SettlementRound.S)).not.toContain('I03')
      expect(roundBuildings({ players: 4, country: 'ireland', length: 'short' }, SettlementRound.S)).toContain('I03')
      expect(roundBuildings({ players: 4, country: 'ireland', length: 'long' }, SettlementRound.S)).toContain('I03')
    })
    it('introduces windmill', () => {
      expect(roundBuildings({ players: 1, country: 'france', length: 'short' }, SettlementRound.S)).toContain('F04')
      expect(roundBuildings({ players: 1, country: 'france', length: 'long' }, SettlementRound.S)).toContain('F04')
      expect(roundBuildings({ players: 2, country: 'france', length: 'short' }, SettlementRound.S)).toContain('F04')
      expect(roundBuildings({ players: 2, country: 'france', length: 'long' }, SettlementRound.S)).toContain('F04')
      expect(roundBuildings({ players: 3, country: 'france', length: 'short' }, SettlementRound.S)).toContain('F04')
      expect(roundBuildings({ players: 3, country: 'france', length: 'long' }, SettlementRound.S)).toContain('F04')
      expect(roundBuildings({ players: 4, country: 'france', length: 'short' }, SettlementRound.S)).toContain('F04')
      expect(roundBuildings({ players: 4, country: 'france', length: 'long' }, SettlementRound.S)).toContain('F04')
    })
    it('introduces malthouse', () => {
      expect(roundBuildings({ players: 1, country: 'ireland', length: 'short' }, SettlementRound.S)).toContain('I04')
      expect(roundBuildings({ players: 1, country: 'ireland', length: 'long' }, SettlementRound.S)).toContain('I04')
      expect(roundBuildings({ players: 2, country: 'ireland', length: 'short' }, SettlementRound.S)).toContain('I04')
      expect(roundBuildings({ players: 2, country: 'ireland', length: 'long' }, SettlementRound.S)).toContain('I04')
      expect(roundBuildings({ players: 3, country: 'ireland', length: 'short' }, SettlementRound.S)).toContain('I04')
      expect(roundBuildings({ players: 3, country: 'ireland', length: 'long' }, SettlementRound.S)).toContain('I04')
      expect(roundBuildings({ players: 4, country: 'ireland', length: 'short' }, SettlementRound.S)).toContain('I04')
      expect(roundBuildings({ players: 4, country: 'ireland', length: 'long' }, SettlementRound.S)).toContain('I04')
    })
    it('introduces bakery', () => {
      expect(roundBuildings({ players: 1, country: 'france', length: 'short' }, SettlementRound.S)).toContain('F05')
      expect(roundBuildings({ players: 1, country: 'france', length: 'long' }, SettlementRound.S)).toContain('F05')
      expect(roundBuildings({ players: 2, country: 'france', length: 'short' }, SettlementRound.S)).toContain('F05')
      expect(roundBuildings({ players: 2, country: 'france', length: 'long' }, SettlementRound.S)).toContain('F05')
      expect(roundBuildings({ players: 3, country: 'france', length: 'short' }, SettlementRound.S)).toContain('F05')
      expect(roundBuildings({ players: 3, country: 'france', length: 'long' }, SettlementRound.S)).toContain('F05')
      expect(roundBuildings({ players: 4, country: 'france', length: 'short' }, SettlementRound.S)).toContain('F05')
      expect(roundBuildings({ players: 4, country: 'france', length: 'long' }, SettlementRound.S)).toContain('F05')
    })
    it('introduces brewery', () => {
      expect(roundBuildings({ players: 1, country: 'ireland', length: 'short' }, SettlementRound.S)).toContain('I05')
      expect(roundBuildings({ players: 1, country: 'ireland', length: 'long' }, SettlementRound.S)).toContain('I05')
      expect(roundBuildings({ players: 2, country: 'ireland', length: 'short' }, SettlementRound.S)).toContain('I05')
      expect(roundBuildings({ players: 2, country: 'ireland', length: 'long' }, SettlementRound.S)).toContain('I05')
      expect(roundBuildings({ players: 3, country: 'ireland', length: 'short' }, SettlementRound.S)).toContain('I05')
      expect(roundBuildings({ players: 3, country: 'ireland', length: 'long' }, SettlementRound.S)).toContain('I05')
      expect(roundBuildings({ players: 4, country: 'ireland', length: 'short' }, SettlementRound.S)).toContain('I05')
      expect(roundBuildings({ players: 4, country: 'ireland', length: 'long' }, SettlementRound.S)).toContain('I05')
    })
    it('introduces fuel merchant', () => {
      expect(roundBuildings({ players: 1, country: 'france', length: 'short' }, SettlementRound.S)).toContain('G06')
      expect(roundBuildings({ players: 1, country: 'france', length: 'long' }, SettlementRound.S)).toContain('G06')
      expect(roundBuildings({ players: 2, country: 'france', length: 'short' }, SettlementRound.S)).not.toContain('G06')
      expect(roundBuildings({ players: 2, country: 'france', length: 'long' }, SettlementRound.S)).not.toContain('G06')
      expect(roundBuildings({ players: 3, country: 'france', length: 'short' }, SettlementRound.S)).toContain('G06')
      expect(roundBuildings({ players: 3, country: 'france', length: 'long' }, SettlementRound.S)).toContain('G06')
      expect(roundBuildings({ players: 4, country: 'france', length: 'short' }, SettlementRound.S)).toContain('G06')
      expect(roundBuildings({ players: 4, country: 'france', length: 'long' }, SettlementRound.S)).toContain('G06')
    })
    it('introduces peat coal kiln', () => {
      expect(roundBuildings({ players: 1, country: 'france', length: 'short' }, SettlementRound.S)).toContain('G07')
      expect(roundBuildings({ players: 1, country: 'france', length: 'long' }, SettlementRound.S)).toContain('G07')
      expect(roundBuildings({ players: 2, country: 'france', length: 'short' }, SettlementRound.S)).toContain('G07')
      expect(roundBuildings({ players: 2, country: 'france', length: 'long' }, SettlementRound.S)).toContain('G07')
      expect(roundBuildings({ players: 3, country: 'france', length: 'short' }, SettlementRound.S)).toContain('G07')
      expect(roundBuildings({ players: 3, country: 'france', length: 'long' }, SettlementRound.S)).toContain('G07')
      expect(roundBuildings({ players: 4, country: 'france', length: 'short' }, SettlementRound.S)).toContain('G07')
      expect(roundBuildings({ players: 4, country: 'france', length: 'long' }, SettlementRound.S)).toContain('G07')
    })
    it('introduces market', () => {
      expect(roundBuildings({ players: 1, country: 'france', length: 'short' }, SettlementRound.S)).toContain('F08')
      expect(roundBuildings({ players: 1, country: 'france', length: 'long' }, SettlementRound.S)).toContain('F08')
      expect(roundBuildings({ players: 2, country: 'france', length: 'short' }, SettlementRound.S)).toContain('F08')
      expect(roundBuildings({ players: 2, country: 'france', length: 'long' }, SettlementRound.S)).toContain('F08')
      expect(roundBuildings({ players: 3, country: 'france', length: 'short' }, SettlementRound.S)).toContain('F08')
      expect(roundBuildings({ players: 3, country: 'france', length: 'long' }, SettlementRound.S)).toContain('F08')
      expect(roundBuildings({ players: 4, country: 'france', length: 'short' }, SettlementRound.S)).toContain('F08')
      expect(roundBuildings({ players: 4, country: 'france', length: 'long' }, SettlementRound.S)).toContain('F08')
    })
    it('introduces false lighthouse', () => {
      expect(roundBuildings({ players: 1, country: 'ireland', length: 'short' }, SettlementRound.S)).toContain('I08')
      expect(roundBuildings({ players: 1, country: 'ireland', length: 'long' }, SettlementRound.S)).toContain('I08')
      expect(roundBuildings({ players: 2, country: 'ireland', length: 'short' }, SettlementRound.S)).toContain('I08')
      expect(roundBuildings({ players: 2, country: 'ireland', length: 'long' }, SettlementRound.S)).toContain('I08')
      expect(roundBuildings({ players: 3, country: 'ireland', length: 'short' }, SettlementRound.S)).toContain('I08')
      expect(roundBuildings({ players: 3, country: 'ireland', length: 'long' }, SettlementRound.S)).toContain('I08')
      expect(roundBuildings({ players: 4, country: 'ireland', length: 'short' }, SettlementRound.S)).toContain('I08')
      expect(roundBuildings({ players: 4, country: 'ireland', length: 'long' }, SettlementRound.S)).toContain('I08')
    })
    it('introduces cloister garden', () => {
      expect(roundBuildings({ players: 1, country: 'france', length: 'short' }, SettlementRound.S)).toContain('F09')
      expect(roundBuildings({ players: 1, country: 'france', length: 'long' }, SettlementRound.S)).toContain('F09')
      expect(roundBuildings({ players: 2, country: 'france', length: 'short' }, SettlementRound.S)).not.toContain('F09')
      expect(roundBuildings({ players: 2, country: 'france', length: 'long' }, SettlementRound.S)).not.toContain('F09')
      expect(roundBuildings({ players: 3, country: 'france', length: 'short' }, SettlementRound.S)).toContain('F09')
      expect(roundBuildings({ players: 3, country: 'france', length: 'long' }, SettlementRound.S)).toContain('F09')
      expect(roundBuildings({ players: 4, country: 'france', length: 'short' }, SettlementRound.S)).toContain('F09')
      expect(roundBuildings({ players: 4, country: 'france', length: 'long' }, SettlementRound.S)).toContain('F09')
    })
    it('introduces spinning mill', () => {
      expect(roundBuildings({ players: 1, country: 'ireland', length: 'short' }, SettlementRound.S)).toContain('I09')
      expect(roundBuildings({ players: 1, country: 'ireland', length: 'long' }, SettlementRound.S)).toContain('I09')
      expect(roundBuildings({ players: 2, country: 'ireland', length: 'short' }, SettlementRound.S)).not.toContain(
        'I09'
      )
      expect(roundBuildings({ players: 2, country: 'ireland', length: 'long' }, SettlementRound.S)).not.toContain('I09')
      expect(roundBuildings({ players: 3, country: 'ireland', length: 'short' }, SettlementRound.S)).toContain('I09')
      expect(roundBuildings({ players: 3, country: 'ireland', length: 'long' }, SettlementRound.S)).toContain('I09')
      expect(roundBuildings({ players: 4, country: 'ireland', length: 'short' }, SettlementRound.S)).toContain('I09')
      expect(roundBuildings({ players: 4, country: 'ireland', length: 'long' }, SettlementRound.S)).toContain('I09')
    })
    it('introduces carpentry', () => {
      expect(roundBuildings({ players: 1, country: 'france', length: 'short' }, SettlementRound.S)).not.toContain('F10')
      expect(roundBuildings({ players: 1, country: 'france', length: 'long' }, SettlementRound.S)).not.toContain('F10')
      expect(roundBuildings({ players: 2, country: 'france', length: 'short' }, SettlementRound.S)).not.toContain('F10')
      expect(roundBuildings({ players: 2, country: 'france', length: 'long' }, SettlementRound.S)).not.toContain('F10')
      expect(roundBuildings({ players: 3, country: 'france', length: 'short' }, SettlementRound.S)).not.toContain('F10')
      expect(roundBuildings({ players: 3, country: 'france', length: 'long' }, SettlementRound.S)).not.toContain('F10')
      expect(roundBuildings({ players: 4, country: 'france', length: 'short' }, SettlementRound.S)).toContain('F10')
      expect(roundBuildings({ players: 4, country: 'france', length: 'long' }, SettlementRound.S)).toContain('F10')
    })
    it('introduces cottage', () => {
      expect(roundBuildings({ players: 1, country: 'ireland', length: 'short' }, SettlementRound.S)).toContain('I10')
      expect(roundBuildings({ players: 1, country: 'ireland', length: 'long' }, SettlementRound.S)).toContain('I10')
      expect(roundBuildings({ players: 2, country: 'ireland', length: 'short' }, SettlementRound.S)).not.toContain(
        'I10'
      )
      expect(roundBuildings({ players: 2, country: 'ireland', length: 'long' }, SettlementRound.S)).not.toContain('I10')
      expect(roundBuildings({ players: 3, country: 'ireland', length: 'short' }, SettlementRound.S)).not.toContain(
        'I10'
      )
      expect(roundBuildings({ players: 3, country: 'ireland', length: 'long' }, SettlementRound.S)).not.toContain('I10')
      expect(roundBuildings({ players: 4, country: 'ireland', length: 'short' }, SettlementRound.S)).toContain('I10')
      expect(roundBuildings({ players: 4, country: 'ireland', length: 'long' }, SettlementRound.S)).toContain('I10')
    })
    it('introduces harbor promenade', () => {
      expect(roundBuildings({ players: 1, country: 'france', length: 'short' }, SettlementRound.S)).toContain('F11')
      expect(roundBuildings({ players: 1, country: 'france', length: 'long' }, SettlementRound.S)).toContain('F11')
      expect(roundBuildings({ players: 2, country: 'france', length: 'short' }, SettlementRound.S)).toContain('F11')
      expect(roundBuildings({ players: 2, country: 'france', length: 'long' }, SettlementRound.S)).toContain('F11')
      expect(roundBuildings({ players: 3, country: 'france', length: 'short' }, SettlementRound.S)).toContain('F11')
      expect(roundBuildings({ players: 3, country: 'france', length: 'long' }, SettlementRound.S)).toContain('F11')
      expect(roundBuildings({ players: 4, country: 'france', length: 'short' }, SettlementRound.S)).toContain('F11')
      expect(roundBuildings({ players: 4, country: 'france', length: 'long' }, SettlementRound.S)).toContain('F11')
    })
    it('introduces houseboat', () => {
      expect(roundBuildings({ players: 1, country: 'ireland', length: 'short' }, SettlementRound.S)).toContain('I11')
      expect(roundBuildings({ players: 1, country: 'ireland', length: 'long' }, SettlementRound.S)).toContain('I11')
      expect(roundBuildings({ players: 2, country: 'ireland', length: 'short' }, SettlementRound.S)).toContain('I11')
      expect(roundBuildings({ players: 2, country: 'ireland', length: 'long' }, SettlementRound.S)).toContain('I11')
      expect(roundBuildings({ players: 3, country: 'ireland', length: 'short' }, SettlementRound.S)).toContain('I11')
      expect(roundBuildings({ players: 3, country: 'ireland', length: 'long' }, SettlementRound.S)).toContain('I11')
      expect(roundBuildings({ players: 4, country: 'ireland', length: 'short' }, SettlementRound.S)).toContain('I11')
      expect(roundBuildings({ players: 4, country: 'ireland', length: 'long' }, SettlementRound.S)).toContain('I11')
    })
    it('introduces stone merchant', () => {
      expect(roundBuildings({ players: 1, country: 'france', length: 'short' }, SettlementRound.S)).toContain('G12')
      expect(roundBuildings({ players: 1, country: 'france', length: 'long' }, SettlementRound.S)).toContain('G12')
      expect(roundBuildings({ players: 2, country: 'france', length: 'short' }, SettlementRound.S)).toContain('G12')
      expect(roundBuildings({ players: 2, country: 'france', length: 'long' }, SettlementRound.S)).toContain('G12')
      expect(roundBuildings({ players: 3, country: 'france', length: 'short' }, SettlementRound.S)).toContain('G12')
      expect(roundBuildings({ players: 3, country: 'france', length: 'long' }, SettlementRound.S)).toContain('G12')
      expect(roundBuildings({ players: 4, country: 'france', length: 'short' }, SettlementRound.S)).toContain('G12')
      expect(roundBuildings({ players: 4, country: 'france', length: 'long' }, SettlementRound.S)).toContain('G12')
    })
    it("introduces builders' market", () => {
      expect(roundBuildings({ players: 1, country: 'france', length: 'short' }, SettlementRound.S)).not.toContain('G13')
      expect(roundBuildings({ players: 1, country: 'france', length: 'long' }, SettlementRound.S)).not.toContain('G13')
      expect(roundBuildings({ players: 2, country: 'france', length: 'short' }, SettlementRound.S)).not.toContain('G13')
      expect(roundBuildings({ players: 2, country: 'france', length: 'long' }, SettlementRound.S)).not.toContain('G13')
      expect(roundBuildings({ players: 3, country: 'france', length: 'short' }, SettlementRound.S)).not.toContain('G13')
      expect(roundBuildings({ players: 3, country: 'france', length: 'long' }, SettlementRound.S)).not.toContain('G13')
      expect(roundBuildings({ players: 4, country: 'france', length: 'short' }, SettlementRound.S)).toContain('G13')
      expect(roundBuildings({ players: 4, country: 'france', length: 'long' }, SettlementRound.S)).toContain('G13')
    })
    it('introduces grapevine A', () => {
      expect(roundBuildings({ players: 1, country: 'france', length: 'short' }, SettlementRound.A)).not.toContain('F14')
      expect(roundBuildings({ players: 1, country: 'france', length: 'long' }, SettlementRound.A)).not.toContain('F14')
      expect(roundBuildings({ players: 2, country: 'france', length: 'short' }, SettlementRound.A)).toContain('F14')
      expect(roundBuildings({ players: 2, country: 'france', length: 'long' }, SettlementRound.A)).toContain('F14')
      expect(roundBuildings({ players: 3, country: 'france', length: 'short' }, SettlementRound.A)).toContain('F14')
      expect(roundBuildings({ players: 3, country: 'france', length: 'long' }, SettlementRound.A)).toContain('F14')
      expect(roundBuildings({ players: 4, country: 'france', length: 'short' }, SettlementRound.A)).toContain('F14')
      expect(roundBuildings({ players: 4, country: 'france', length: 'long' }, SettlementRound.A)).toContain('F14')
    })
    it('introduces sacred site', () => {
      expect(roundBuildings({ players: 1, country: 'ireland', length: 'short' }, SettlementRound.A)).toContain('I14')
      expect(roundBuildings({ players: 1, country: 'ireland', length: 'long' }, SettlementRound.A)).toContain('I14')
      expect(roundBuildings({ players: 2, country: 'ireland', length: 'short' }, SettlementRound.A)).toContain('I14')
      expect(roundBuildings({ players: 2, country: 'ireland', length: 'long' }, SettlementRound.A)).toContain('I14')
      expect(roundBuildings({ players: 3, country: 'ireland', length: 'short' }, SettlementRound.A)).toContain('I14')
      expect(roundBuildings({ players: 3, country: 'ireland', length: 'long' }, SettlementRound.A)).toContain('I14')
      expect(roundBuildings({ players: 4, country: 'ireland', length: 'short' }, SettlementRound.A)).toContain('I14')
      expect(roundBuildings({ players: 4, country: 'ireland', length: 'long' }, SettlementRound.A)).toContain('I14')
    })
    it('introduces financed estate', () => {
      expect(roundBuildings({ players: 1, country: 'france', length: 'short' }, SettlementRound.A)).toContain('F15')
      expect(roundBuildings({ players: 1, country: 'france', length: 'long' }, SettlementRound.A)).toContain('F15')
      expect(roundBuildings({ players: 2, country: 'france', length: 'short' }, SettlementRound.A)).not.toContain('F15')
      expect(roundBuildings({ players: 2, country: 'france', length: 'long' }, SettlementRound.A)).not.toContain('F15')
      expect(roundBuildings({ players: 3, country: 'france', length: 'short' }, SettlementRound.A)).not.toContain('F15')
      expect(roundBuildings({ players: 3, country: 'france', length: 'long' }, SettlementRound.A)).not.toContain('F15')
      expect(roundBuildings({ players: 4, country: 'france', length: 'short' }, SettlementRound.A)).toContain('F15')
      expect(roundBuildings({ players: 4, country: 'france', length: 'long' }, SettlementRound.A)).toContain('F15')
    })
    it('introduces druids house', () => {
      expect(roundBuildings({ players: 1, country: 'ireland', length: 'short' }, SettlementRound.A)).toContain('I15')
      expect(roundBuildings({ players: 1, country: 'ireland', length: 'long' }, SettlementRound.A)).toContain('I15')
      expect(roundBuildings({ players: 2, country: 'ireland', length: 'short' }, SettlementRound.A)).not.toContain(
        'I15'
      )
      expect(roundBuildings({ players: 2, country: 'ireland', length: 'long' }, SettlementRound.A)).not.toContain('I15')
      expect(roundBuildings({ players: 3, country: 'ireland', length: 'short' }, SettlementRound.A)).not.toContain(
        'I15'
      )
      expect(roundBuildings({ players: 3, country: 'ireland', length: 'long' }, SettlementRound.A)).not.toContain('I15')
      expect(roundBuildings({ players: 4, country: 'ireland', length: 'short' }, SettlementRound.A)).toContain('I15')
      expect(roundBuildings({ players: 4, country: 'ireland', length: 'long' }, SettlementRound.A)).toContain('I15')
    })
    it('introduces cloister chapter house', () => {
      expect(roundBuildings({ players: 1, country: 'france', length: 'short' }, SettlementRound.A)).toContain('G16')
      expect(roundBuildings({ players: 1, country: 'france', length: 'long' }, SettlementRound.A)).toContain('G16')
      expect(roundBuildings({ players: 2, country: 'france', length: 'short' }, SettlementRound.A)).not.toContain('G16')
      expect(roundBuildings({ players: 2, country: 'france', length: 'long' }, SettlementRound.A)).not.toContain('G16')
      expect(roundBuildings({ players: 3, country: 'france', length: 'short' }, SettlementRound.A)).toContain('G16')
      expect(roundBuildings({ players: 3, country: 'france', length: 'long' }, SettlementRound.A)).toContain('G16')
      expect(roundBuildings({ players: 4, country: 'france', length: 'short' }, SettlementRound.A)).toContain('G16')
      expect(roundBuildings({ players: 4, country: 'france', length: 'long' }, SettlementRound.A)).toContain('G16')
    })
    it('introduces cloisterlibrary', () => {
      expect(roundBuildings({ players: 1, country: 'france', length: 'short' }, SettlementRound.A)).toContain('F17')
      expect(roundBuildings({ players: 1, country: 'france', length: 'long' }, SettlementRound.A)).toContain('F17')
      expect(roundBuildings({ players: 2, country: 'france', length: 'short' }, SettlementRound.A)).toContain('F17')
      expect(roundBuildings({ players: 2, country: 'france', length: 'long' }, SettlementRound.A)).toContain('F17')
      expect(roundBuildings({ players: 3, country: 'france', length: 'short' }, SettlementRound.A)).toContain('F17')
      expect(roundBuildings({ players: 3, country: 'france', length: 'long' }, SettlementRound.A)).toContain('F17')
      expect(roundBuildings({ players: 4, country: 'france', length: 'short' }, SettlementRound.A)).toContain('F17')
      expect(roundBuildings({ players: 4, country: 'france', length: 'long' }, SettlementRound.A)).toContain('F17')
    })
    it('introduces scriptorium', () => {
      expect(roundBuildings({ players: 1, country: 'ireland', length: 'short' }, SettlementRound.A)).toContain('I17')
      expect(roundBuildings({ players: 1, country: 'ireland', length: 'long' }, SettlementRound.A)).toContain('I17')
      expect(roundBuildings({ players: 2, country: 'ireland', length: 'short' }, SettlementRound.A)).toContain('I17')
      expect(roundBuildings({ players: 2, country: 'ireland', length: 'long' }, SettlementRound.A)).toContain('I17')
      expect(roundBuildings({ players: 3, country: 'ireland', length: 'short' }, SettlementRound.A)).toContain('I17')
      expect(roundBuildings({ players: 3, country: 'ireland', length: 'long' }, SettlementRound.A)).toContain('I17')
      expect(roundBuildings({ players: 4, country: 'ireland', length: 'short' }, SettlementRound.A)).toContain('I17')
      expect(roundBuildings({ players: 4, country: 'ireland', length: 'long' }, SettlementRound.A)).toContain('I17')
    })
    it('introduces cloister workshop', () => {
      expect(roundBuildings({ players: 1, country: 'france', length: 'short' }, SettlementRound.A)).toContain('G18')
      expect(roundBuildings({ players: 1, country: 'france', length: 'long' }, SettlementRound.A)).toContain('G18')
      expect(roundBuildings({ players: 2, country: 'france', length: 'short' }, SettlementRound.A)).toContain('G18')
      expect(roundBuildings({ players: 2, country: 'france', length: 'long' }, SettlementRound.A)).toContain('G18')
      expect(roundBuildings({ players: 3, country: 'france', length: 'short' }, SettlementRound.A)).toContain('G18')
      expect(roundBuildings({ players: 3, country: 'france', length: 'long' }, SettlementRound.A)).toContain('G18')
      expect(roundBuildings({ players: 4, country: 'france', length: 'short' }, SettlementRound.A)).toContain('G18')
      expect(roundBuildings({ players: 4, country: 'france', length: 'long' }, SettlementRound.A)).toContain('G18')
    })
    it('introduces slaughterhouse', () => {
      expect(roundBuildings({ players: 1, country: 'france', length: 'short' }, SettlementRound.A)).toContain('G19')
      expect(roundBuildings({ players: 1, country: 'france', length: 'long' }, SettlementRound.A)).toContain('G19')
      expect(roundBuildings({ players: 2, country: 'france', length: 'short' }, SettlementRound.A)).toContain('G19')
      expect(roundBuildings({ players: 2, country: 'france', length: 'long' }, SettlementRound.A)).toContain('G19')
      expect(roundBuildings({ players: 3, country: 'france', length: 'short' }, SettlementRound.A)).toContain('G19')
      expect(roundBuildings({ players: 3, country: 'france', length: 'long' }, SettlementRound.A)).toContain('G19')
      expect(roundBuildings({ players: 4, country: 'france', length: 'short' }, SettlementRound.A)).toContain('G19')
      expect(roundBuildings({ players: 4, country: 'france', length: 'long' }, SettlementRound.A)).toContain('G19')
    })
    it('introduces inn', () => {
      expect(roundBuildings({ players: 1, country: 'france', length: 'short' }, SettlementRound.B)).toContain('F20')
      expect(roundBuildings({ players: 1, country: 'france', length: 'long' }, SettlementRound.B)).toContain('F20')
      expect(roundBuildings({ players: 2, country: 'france', length: 'short' }, SettlementRound.B)).not.toContain('F20')
      expect(roundBuildings({ players: 2, country: 'france', length: 'long' }, SettlementRound.B)).not.toContain('F20')
      expect(roundBuildings({ players: 3, country: 'france', length: 'short' }, SettlementRound.B)).toContain('F20')
      expect(roundBuildings({ players: 3, country: 'france', length: 'long' }, SettlementRound.B)).toContain('F20')
      expect(roundBuildings({ players: 4, country: 'france', length: 'short' }, SettlementRound.B)).toContain('F20')
      expect(roundBuildings({ players: 4, country: 'france', length: 'long' }, SettlementRound.B)).toContain('F20')
    })
    it('introduces alehouse', () => {
      expect(roundBuildings({ players: 1, country: 'ireland', length: 'short' }, SettlementRound.B)).toContain('I20')
      expect(roundBuildings({ players: 1, country: 'ireland', length: 'long' }, SettlementRound.B)).toContain('I20')
      expect(roundBuildings({ players: 2, country: 'ireland', length: 'short' }, SettlementRound.B)).not.toContain(
        'I20'
      )
      expect(roundBuildings({ players: 2, country: 'ireland', length: 'long' }, SettlementRound.B)).not.toContain('I20')
      expect(roundBuildings({ players: 3, country: 'ireland', length: 'short' }, SettlementRound.B)).toContain('I20')
      expect(roundBuildings({ players: 3, country: 'ireland', length: 'long' }, SettlementRound.B)).toContain('I20')
      expect(roundBuildings({ players: 4, country: 'ireland', length: 'short' }, SettlementRound.B)).toContain('I20')
      expect(roundBuildings({ players: 4, country: 'ireland', length: 'long' }, SettlementRound.B)).toContain('I20')
    })
    it('introduces winery', () => {
      expect(roundBuildings({ players: 1, country: 'france', length: 'short' }, SettlementRound.B)).toContain('F21')
      expect(roundBuildings({ players: 1, country: 'france', length: 'long' }, SettlementRound.B)).toContain('F21')
      expect(roundBuildings({ players: 2, country: 'france', length: 'short' }, SettlementRound.B)).toContain('F21')
      expect(roundBuildings({ players: 2, country: 'france', length: 'long' }, SettlementRound.B)).toContain('F21')
      expect(roundBuildings({ players: 3, country: 'france', length: 'short' }, SettlementRound.B)).toContain('F21')
      expect(roundBuildings({ players: 3, country: 'france', length: 'long' }, SettlementRound.B)).toContain('F21')
      expect(roundBuildings({ players: 4, country: 'france', length: 'short' }, SettlementRound.B)).toContain('F21')
      expect(roundBuildings({ players: 4, country: 'france', length: 'long' }, SettlementRound.B)).toContain('F21')
    })
    it('introduces whiskey distillery', () => {
      expect(roundBuildings({ players: 1, country: 'ireland', length: 'short' }, SettlementRound.B)).toContain('I21')
      expect(roundBuildings({ players: 1, country: 'ireland', length: 'long' }, SettlementRound.B)).toContain('I21')
      expect(roundBuildings({ players: 2, country: 'ireland', length: 'short' }, SettlementRound.B)).toContain('I21')
      expect(roundBuildings({ players: 2, country: 'ireland', length: 'long' }, SettlementRound.B)).toContain('I21')
      expect(roundBuildings({ players: 3, country: 'ireland', length: 'short' }, SettlementRound.B)).toContain('I21')
      expect(roundBuildings({ players: 3, country: 'ireland', length: 'long' }, SettlementRound.B)).toContain('I21')
      expect(roundBuildings({ players: 4, country: 'ireland', length: 'short' }, SettlementRound.B)).toContain('I21')
      expect(roundBuildings({ players: 4, country: 'ireland', length: 'long' }, SettlementRound.B)).toContain('I21')
    })
    it('introduces quarry A', () => {
      expect(roundBuildings({ players: 1, country: 'france', length: 'short' }, SettlementRound.B)).toContain('G22')
      expect(roundBuildings({ players: 1, country: 'france', length: 'long' }, SettlementRound.B)).toContain('G22')
      expect(roundBuildings({ players: 2, country: 'france', length: 'short' }, SettlementRound.B)).toContain('G22')
      expect(roundBuildings({ players: 2, country: 'france', length: 'long' }, SettlementRound.B)).toContain('G22')
      expect(roundBuildings({ players: 3, country: 'france', length: 'short' }, SettlementRound.B)).toContain('G22')
      expect(roundBuildings({ players: 3, country: 'france', length: 'long' }, SettlementRound.B)).toContain('G22')
      expect(roundBuildings({ players: 4, country: 'france', length: 'short' }, SettlementRound.B)).toContain('G22')
      expect(roundBuildings({ players: 4, country: 'france', length: 'long' }, SettlementRound.B)).toContain('G22')
    })
    it('introduces bathhouse', () => {
      expect(roundBuildings({ players: 1, country: 'france', length: 'short' }, SettlementRound.B)).toContain('F23')
      expect(roundBuildings({ players: 1, country: 'france', length: 'long' }, SettlementRound.B)).toContain('F23')
      expect(roundBuildings({ players: 2, country: 'france', length: 'short' }, SettlementRound.B)).not.toContain('F23')
      expect(roundBuildings({ players: 2, country: 'france', length: 'long' }, SettlementRound.B)).not.toContain('F23')
      expect(roundBuildings({ players: 3, country: 'france', length: 'short' }, SettlementRound.B)).not.toContain('F23')
      expect(roundBuildings({ players: 3, country: 'france', length: 'long' }, SettlementRound.B)).not.toContain('F23')
      expect(roundBuildings({ players: 4, country: 'france', length: 'short' }, SettlementRound.B)).toContain('F23')
      expect(roundBuildings({ players: 4, country: 'france', length: 'long' }, SettlementRound.B)).toContain('F23')
    })
    it('introduces locutory', () => {
      expect(roundBuildings({ players: 1, country: 'ireland', length: 'short' }, SettlementRound.B)).toContain('I23')
      expect(roundBuildings({ players: 1, country: 'ireland', length: 'long' }, SettlementRound.B)).toContain('I23')
      expect(roundBuildings({ players: 2, country: 'ireland', length: 'short' }, SettlementRound.B)).not.toContain(
        'I23'
      )
      expect(roundBuildings({ players: 2, country: 'ireland', length: 'long' }, SettlementRound.B)).not.toContain('I23')
      expect(roundBuildings({ players: 3, country: 'ireland', length: 'short' }, SettlementRound.B)).not.toContain(
        'I23'
      )
      expect(roundBuildings({ players: 3, country: 'ireland', length: 'long' }, SettlementRound.B)).not.toContain('I23')
      expect(roundBuildings({ players: 4, country: 'ireland', length: 'short' }, SettlementRound.B)).toContain('I23')
      expect(roundBuildings({ players: 4, country: 'ireland', length: 'long' }, SettlementRound.B)).toContain('I23')
    })
    it('introduces cloister church', () => {
      expect(roundBuildings({ players: 1, country: 'france', length: 'short' }, SettlementRound.B)).toContain('F24')
      expect(roundBuildings({ players: 1, country: 'france', length: 'long' }, SettlementRound.B)).toContain('F24')
      expect(roundBuildings({ players: 2, country: 'france', length: 'short' }, SettlementRound.B)).toContain('F24')
      expect(roundBuildings({ players: 2, country: 'france', length: 'long' }, SettlementRound.B)).toContain('F24')
      expect(roundBuildings({ players: 3, country: 'france', length: 'short' }, SettlementRound.B)).toContain('F24')
      expect(roundBuildings({ players: 3, country: 'france', length: 'long' }, SettlementRound.B)).toContain('F24')
      expect(roundBuildings({ players: 4, country: 'france', length: 'short' }, SettlementRound.B)).toContain('F24')
      expect(roundBuildings({ players: 4, country: 'france', length: 'long' }, SettlementRound.B)).toContain('F24')
    })
    it('introduces chapel', () => {
      expect(roundBuildings({ players: 1, country: 'ireland', length: 'short' }, SettlementRound.B)).toContain('I24')
      expect(roundBuildings({ players: 1, country: 'ireland', length: 'long' }, SettlementRound.B)).toContain('I24')
      expect(roundBuildings({ players: 2, country: 'ireland', length: 'short' }, SettlementRound.B)).toContain('I24')
      expect(roundBuildings({ players: 2, country: 'ireland', length: 'long' }, SettlementRound.B)).toContain('I24')
      expect(roundBuildings({ players: 3, country: 'ireland', length: 'short' }, SettlementRound.B)).toContain('I24')
      expect(roundBuildings({ players: 3, country: 'ireland', length: 'long' }, SettlementRound.B)).toContain('I24')
      expect(roundBuildings({ players: 4, country: 'ireland', length: 'short' }, SettlementRound.B)).toContain('I24')
      expect(roundBuildings({ players: 4, country: 'ireland', length: 'long' }, SettlementRound.B)).toContain('I24')
    })
    it('introduces chamber of wonders', () => {
      expect(roundBuildings({ players: 1, country: 'france', length: 'short' }, SettlementRound.B)).toContain('F25')
      expect(roundBuildings({ players: 1, country: 'france', length: 'long' }, SettlementRound.B)).toContain('F25')
      expect(roundBuildings({ players: 2, country: 'france', length: 'short' }, SettlementRound.B)).not.toContain('F25')
      expect(roundBuildings({ players: 2, country: 'france', length: 'long' }, SettlementRound.B)).not.toContain('F25')
      expect(roundBuildings({ players: 3, country: 'france', length: 'short' }, SettlementRound.B)).not.toContain('F25')
      expect(roundBuildings({ players: 3, country: 'france', length: 'long' }, SettlementRound.B)).not.toContain('F25')
      expect(roundBuildings({ players: 4, country: 'france', length: 'short' }, SettlementRound.B)).toContain('F25')
      expect(roundBuildings({ players: 4, country: 'france', length: 'long' }, SettlementRound.B)).toContain('F25')
    })
    it('introduces portico', () => {
      expect(roundBuildings({ players: 1, country: 'ireland', length: 'short' }, SettlementRound.B)).toContain('I25')
      expect(roundBuildings({ players: 1, country: 'ireland', length: 'long' }, SettlementRound.B)).toContain('I25')
      expect(roundBuildings({ players: 2, country: 'ireland', length: 'short' }, SettlementRound.B)).not.toContain(
        'I25'
      )
      expect(roundBuildings({ players: 2, country: 'ireland', length: 'long' }, SettlementRound.B)).not.toContain('I25')
      expect(roundBuildings({ players: 3, country: 'ireland', length: 'short' }, SettlementRound.B)).not.toContain(
        'I25'
      )
      expect(roundBuildings({ players: 3, country: 'ireland', length: 'long' }, SettlementRound.B)).not.toContain('I25')
      expect(roundBuildings({ players: 4, country: 'ireland', length: 'short' }, SettlementRound.B)).toContain('I25')
      expect(roundBuildings({ players: 4, country: 'ireland', length: 'long' }, SettlementRound.B)).toContain('I25')
    })
    it('introduces shipyard', () => {
      expect(roundBuildings({ players: 1, country: 'france', length: 'short' }, SettlementRound.B)).toContain('G26')
      expect(roundBuildings({ players: 1, country: 'france', length: 'long' }, SettlementRound.B)).toContain('G26')
      expect(roundBuildings({ players: 2, country: 'france', length: 'short' }, SettlementRound.B)).toContain('G26')
      expect(roundBuildings({ players: 2, country: 'france', length: 'long' }, SettlementRound.B)).toContain('G26')
      expect(roundBuildings({ players: 3, country: 'france', length: 'short' }, SettlementRound.B)).toContain('G26')
      expect(roundBuildings({ players: 3, country: 'france', length: 'long' }, SettlementRound.B)).toContain('G26')
      expect(roundBuildings({ players: 4, country: 'france', length: 'short' }, SettlementRound.B)).toContain('G26')
      expect(roundBuildings({ players: 4, country: 'france', length: 'long' }, SettlementRound.B)).toContain('G26')
    })
    it('introduces palace', () => {
      expect(roundBuildings({ players: 1, country: 'france', length: 'short' }, SettlementRound.C)).toContain('F27')
      expect(roundBuildings({ players: 1, country: 'france', length: 'long' }, SettlementRound.C)).toContain('F27')
      expect(roundBuildings({ players: 2, country: 'france', length: 'short' }, SettlementRound.C)).toContain('F27')
      expect(roundBuildings({ players: 2, country: 'france', length: 'long' }, SettlementRound.C)).toContain('F27')
      expect(roundBuildings({ players: 3, country: 'france', length: 'short' }, SettlementRound.C)).toContain('F27')
      expect(roundBuildings({ players: 3, country: 'france', length: 'long' }, SettlementRound.C)).toContain('F27')
      expect(roundBuildings({ players: 4, country: 'france', length: 'short' }, SettlementRound.C)).toContain('F27')
      expect(roundBuildings({ players: 4, country: 'france', length: 'long' }, SettlementRound.C)).toContain('F27')
    })
    it('introduces grand manor', () => {
      expect(roundBuildings({ players: 1, country: 'ireland', length: 'short' }, SettlementRound.C)).toContain('I27')
      expect(roundBuildings({ players: 1, country: 'ireland', length: 'long' }, SettlementRound.C)).toContain('I27')
      expect(roundBuildings({ players: 2, country: 'ireland', length: 'short' }, SettlementRound.C)).toContain('I27')
      expect(roundBuildings({ players: 2, country: 'ireland', length: 'long' }, SettlementRound.C)).toContain('I27')
      expect(roundBuildings({ players: 3, country: 'ireland', length: 'short' }, SettlementRound.C)).toContain('I27')
      expect(roundBuildings({ players: 3, country: 'ireland', length: 'long' }, SettlementRound.C)).toContain('I27')
      expect(roundBuildings({ players: 4, country: 'ireland', length: 'short' }, SettlementRound.C)).toContain('I27')
      expect(roundBuildings({ players: 4, country: 'ireland', length: 'long' }, SettlementRound.C)).toContain('I27')
    })
    it('introduces castle', () => {
      expect(roundBuildings({ players: 1, country: 'france', length: 'short' }, SettlementRound.C)).toContain('G28')
      expect(roundBuildings({ players: 1, country: 'france', length: 'long' }, SettlementRound.C)).toContain('G28')
      expect(roundBuildings({ players: 2, country: 'france', length: 'short' }, SettlementRound.C)).toContain('G28')
      expect(roundBuildings({ players: 2, country: 'france', length: 'long' }, SettlementRound.C)).toContain('G28')
      expect(roundBuildings({ players: 3, country: 'france', length: 'short' }, SettlementRound.C)).toContain('G28')
      expect(roundBuildings({ players: 3, country: 'france', length: 'long' }, SettlementRound.C)).toContain('G28')
      expect(roundBuildings({ players: 4, country: 'france', length: 'short' }, SettlementRound.C)).toContain('G28')
      expect(roundBuildings({ players: 4, country: 'france', length: 'long' }, SettlementRound.C)).toContain('G28')
    })
    it('introduces quarry B', () => {
      expect(roundBuildings({ players: 1, country: 'france', length: 'short' }, SettlementRound.C)).not.toContain('F29')
      expect(roundBuildings({ players: 1, country: 'france', length: 'long' }, SettlementRound.C)).not.toContain('F29')
      expect(roundBuildings({ players: 2, country: 'france', length: 'short' }, SettlementRound.C)).not.toContain('F29')
      expect(roundBuildings({ players: 2, country: 'france', length: 'long' }, SettlementRound.C)).not.toContain('F29')
      expect(roundBuildings({ players: 3, country: 'france', length: 'short' }, SettlementRound.C)).toContain('F29')
      expect(roundBuildings({ players: 3, country: 'france', length: 'long' }, SettlementRound.C)).toContain('F29')
      expect(roundBuildings({ players: 4, country: 'france', length: 'short' }, SettlementRound.C)).toContain('F29')
      expect(roundBuildings({ players: 4, country: 'france', length: 'long' }, SettlementRound.C)).toContain('F29')
    })
    it('introduces forest hut', () => {
      expect(roundBuildings({ players: 1, country: 'ireland', length: 'short' }, SettlementRound.C)).toContain('I29')
      expect(roundBuildings({ players: 1, country: 'ireland', length: 'long' }, SettlementRound.C)).toContain('I29')
      expect(roundBuildings({ players: 2, country: 'ireland', length: 'short' }, SettlementRound.C)).not.toContain(
        'I29'
      )
      expect(roundBuildings({ players: 2, country: 'ireland', length: 'long' }, SettlementRound.C)).not.toContain('I29')
      expect(roundBuildings({ players: 3, country: 'ireland', length: 'short' }, SettlementRound.C)).toContain('I29')
      expect(roundBuildings({ players: 3, country: 'ireland', length: 'long' }, SettlementRound.C)).toContain('I29')
      expect(roundBuildings({ players: 4, country: 'ireland', length: 'short' }, SettlementRound.C)).toContain('I29')
      expect(roundBuildings({ players: 4, country: 'ireland', length: 'long' }, SettlementRound.C)).toContain('I29')
    })
    it('introduces town estate', () => {
      expect(roundBuildings({ players: 1, country: 'france', length: 'short' }, SettlementRound.C)).toContain('F30')
      expect(roundBuildings({ players: 1, country: 'france', length: 'long' }, SettlementRound.C)).toContain('F30')
      expect(roundBuildings({ players: 2, country: 'france', length: 'short' }, SettlementRound.C)).toContain('F30')
      expect(roundBuildings({ players: 2, country: 'france', length: 'long' }, SettlementRound.C)).toContain('F30')
      expect(roundBuildings({ players: 3, country: 'france', length: 'short' }, SettlementRound.C)).toContain('F30')
      expect(roundBuildings({ players: 3, country: 'france', length: 'long' }, SettlementRound.C)).toContain('F30')
      expect(roundBuildings({ players: 4, country: 'france', length: 'short' }, SettlementRound.C)).toContain('F30')
      expect(roundBuildings({ players: 4, country: 'france', length: 'long' }, SettlementRound.C)).toContain('F30')
    })
    it('introduces refectory', () => {
      expect(roundBuildings({ players: 1, country: 'ireland', length: 'short' }, SettlementRound.C)).toContain('I30')
      expect(roundBuildings({ players: 1, country: 'ireland', length: 'long' }, SettlementRound.C)).toContain('I30')
      expect(roundBuildings({ players: 2, country: 'ireland', length: 'short' }, SettlementRound.C)).toContain('I30')
      expect(roundBuildings({ players: 2, country: 'ireland', length: 'long' }, SettlementRound.C)).toContain('I30')
      expect(roundBuildings({ players: 3, country: 'ireland', length: 'short' }, SettlementRound.C)).toContain('I30')
      expect(roundBuildings({ players: 3, country: 'ireland', length: 'long' }, SettlementRound.C)).toContain('I30')
      expect(roundBuildings({ players: 4, country: 'ireland', length: 'short' }, SettlementRound.C)).toContain('I30')
      expect(roundBuildings({ players: 4, country: 'ireland', length: 'long' }, SettlementRound.C)).toContain('I30')
    })
    it('introduces grapevine B', () => {
      expect(roundBuildings({ players: 1, country: 'france', length: 'short' }, SettlementRound.C)).not.toContain('F31')
      expect(roundBuildings({ players: 1, country: 'france', length: 'long' }, SettlementRound.C)).not.toContain('F31')
      expect(roundBuildings({ players: 2, country: 'france', length: 'short' }, SettlementRound.C)).not.toContain('F31')
      expect(roundBuildings({ players: 2, country: 'france', length: 'long' }, SettlementRound.C)).not.toContain('F31')
      expect(roundBuildings({ players: 3, country: 'france', length: 'short' }, SettlementRound.C)).not.toContain('F31')
      expect(roundBuildings({ players: 3, country: 'france', length: 'long' }, SettlementRound.C)).not.toContain('F31')
      expect(roundBuildings({ players: 4, country: 'france', length: 'short' }, SettlementRound.C)).toContain('F31')
      expect(roundBuildings({ players: 4, country: 'france', length: 'long' }, SettlementRound.C)).toContain('F31')
    })
    it('introduces coal harbor', () => {
      expect(roundBuildings({ players: 1, country: 'ireland', length: 'short' }, SettlementRound.C)).toContain('I31')
      expect(roundBuildings({ players: 1, country: 'ireland', length: 'long' }, SettlementRound.C)).toContain('I31')
      expect(roundBuildings({ players: 2, country: 'ireland', length: 'short' }, SettlementRound.C)).not.toContain(
        'I31'
      )
      expect(roundBuildings({ players: 2, country: 'ireland', length: 'long' }, SettlementRound.C)).not.toContain('I31')
      expect(roundBuildings({ players: 3, country: 'ireland', length: 'short' }, SettlementRound.C)).not.toContain(
        'I31'
      )
      expect(roundBuildings({ players: 3, country: 'ireland', length: 'long' }, SettlementRound.C)).not.toContain('I31')
      expect(roundBuildings({ players: 4, country: 'ireland', length: 'short' }, SettlementRound.C)).toContain('I31')
      expect(roundBuildings({ players: 4, country: 'ireland', length: 'long' }, SettlementRound.C)).toContain('I31')
    })
    it('introduces calefactory', () => {
      expect(roundBuildings({ players: 1, country: 'france', length: 'short' }, SettlementRound.C)).toContain('F32')
      expect(roundBuildings({ players: 1, country: 'france', length: 'long' }, SettlementRound.C)).toContain('F32')
      expect(roundBuildings({ players: 2, country: 'france', length: 'short' }, SettlementRound.C)).not.toContain('F32')
      expect(roundBuildings({ players: 2, country: 'france', length: 'long' }, SettlementRound.C)).not.toContain('F32')
      expect(roundBuildings({ players: 3, country: 'france', length: 'short' }, SettlementRound.C)).toContain('F32')
      expect(roundBuildings({ players: 3, country: 'france', length: 'long' }, SettlementRound.C)).toContain('F32')
      expect(roundBuildings({ players: 4, country: 'france', length: 'short' }, SettlementRound.C)).toContain('F32')
      expect(roundBuildings({ players: 4, country: 'france', length: 'long' }, SettlementRound.C)).toContain('F32')
    })
    it('introduces filial church', () => {
      expect(roundBuildings({ players: 1, country: 'ireland', length: 'short' }, SettlementRound.C)).toContain('I32')
      expect(roundBuildings({ players: 1, country: 'ireland', length: 'long' }, SettlementRound.C)).toContain('I32')
      expect(roundBuildings({ players: 2, country: 'ireland', length: 'short' }, SettlementRound.C)).not.toContain(
        'I32'
      )
      expect(roundBuildings({ players: 2, country: 'ireland', length: 'long' }, SettlementRound.C)).not.toContain('I32')
      expect(roundBuildings({ players: 3, country: 'ireland', length: 'short' }, SettlementRound.C)).toContain('I32')
      expect(roundBuildings({ players: 3, country: 'ireland', length: 'long' }, SettlementRound.C)).toContain('I32')
      expect(roundBuildings({ players: 4, country: 'ireland', length: 'short' }, SettlementRound.C)).toContain('I32')
      expect(roundBuildings({ players: 4, country: 'ireland', length: 'long' }, SettlementRound.C)).toContain('I32')
    })
    it('introduces shipping company', () => {
      expect(roundBuildings({ players: 1, country: 'france', length: 'short' }, SettlementRound.C)).toContain('F33')
      expect(roundBuildings({ players: 1, country: 'france', length: 'long' }, SettlementRound.C)).toContain('F33')
      expect(roundBuildings({ players: 2, country: 'france', length: 'short' }, SettlementRound.C)).toContain('F33')
      expect(roundBuildings({ players: 2, country: 'france', length: 'long' }, SettlementRound.C)).toContain('F33')
      expect(roundBuildings({ players: 3, country: 'france', length: 'short' }, SettlementRound.C)).toContain('F33')
      expect(roundBuildings({ players: 3, country: 'france', length: 'long' }, SettlementRound.C)).toContain('F33')
      expect(roundBuildings({ players: 4, country: 'france', length: 'short' }, SettlementRound.C)).toContain('F33')
      expect(roundBuildings({ players: 4, country: 'france', length: 'long' }, SettlementRound.C)).toContain('F33')
    })
    it('introduces cooperage', () => {
      expect(roundBuildings({ players: 1, country: 'ireland', length: 'short' }, SettlementRound.C)).toContain('I33')
      expect(roundBuildings({ players: 1, country: 'ireland', length: 'long' }, SettlementRound.C)).toContain('I33')
      expect(roundBuildings({ players: 2, country: 'ireland', length: 'short' }, SettlementRound.C)).toContain('I33')
      expect(roundBuildings({ players: 2, country: 'ireland', length: 'long' }, SettlementRound.C)).toContain('I33')
      expect(roundBuildings({ players: 3, country: 'ireland', length: 'short' }, SettlementRound.C)).toContain('I33')
      expect(roundBuildings({ players: 3, country: 'ireland', length: 'long' }, SettlementRound.C)).toContain('I33')
      expect(roundBuildings({ players: 4, country: 'ireland', length: 'short' }, SettlementRound.C)).toContain('I33')
      expect(roundBuildings({ players: 4, country: 'ireland', length: 'long' }, SettlementRound.C)).toContain('I33')
    })
    it('introduces sacristy', () => {
      expect(roundBuildings({ players: 1, country: 'france', length: 'short' }, SettlementRound.D)).toContain('G34')
      expect(roundBuildings({ players: 1, country: 'france', length: 'long' }, SettlementRound.D)).toContain('G34')
      expect(roundBuildings({ players: 2, country: 'france', length: 'short' }, SettlementRound.D)).toContain('G34')
      expect(roundBuildings({ players: 2, country: 'france', length: 'long' }, SettlementRound.D)).toContain('G34')
      expect(roundBuildings({ players: 3, country: 'france', length: 'short' }, SettlementRound.D)).toContain('G34')
      expect(roundBuildings({ players: 3, country: 'france', length: 'long' }, SettlementRound.D)).toContain('G34')
      expect(roundBuildings({ players: 4, country: 'france', length: 'short' }, SettlementRound.D)).toContain('G34')
      expect(roundBuildings({ players: 4, country: 'france', length: 'long' }, SettlementRound.D)).toContain('G34')
    })
    it("introduces forgers' workshop", () => {
      expect(roundBuildings({ players: 1, country: 'france', length: 'short' }, SettlementRound.D)).toContain('F35')
      expect(roundBuildings({ players: 1, country: 'france', length: 'long' }, SettlementRound.D)).toContain('F35')
      expect(roundBuildings({ players: 2, country: 'france', length: 'short' }, SettlementRound.D)).toContain('F35')
      expect(roundBuildings({ players: 2, country: 'france', length: 'long' }, SettlementRound.D)).toContain('F35')
      expect(roundBuildings({ players: 3, country: 'france', length: 'short' }, SettlementRound.D)).toContain('F35')
      expect(roundBuildings({ players: 3, country: 'france', length: 'long' }, SettlementRound.D)).toContain('F35')
      expect(roundBuildings({ players: 4, country: 'france', length: 'short' }, SettlementRound.D)).toContain('F35')
      expect(roundBuildings({ players: 4, country: 'france', length: 'long' }, SettlementRound.D)).toContain('F35')
    })
    it('introduces round tower', () => {
      expect(roundBuildings({ players: 1, country: 'ireland', length: 'short' }, SettlementRound.D)).toContain('I35')
      expect(roundBuildings({ players: 1, country: 'ireland', length: 'long' }, SettlementRound.D)).toContain('I35')
      expect(roundBuildings({ players: 2, country: 'ireland', length: 'short' }, SettlementRound.D)).toContain('I35')
      expect(roundBuildings({ players: 2, country: 'ireland', length: 'long' }, SettlementRound.D)).toContain('I35')
      expect(roundBuildings({ players: 3, country: 'ireland', length: 'short' }, SettlementRound.D)).toContain('I35')
      expect(roundBuildings({ players: 3, country: 'ireland', length: 'long' }, SettlementRound.D)).toContain('I35')
      expect(roundBuildings({ players: 4, country: 'ireland', length: 'short' }, SettlementRound.D)).toContain('I35')
      expect(roundBuildings({ players: 4, country: 'ireland', length: 'long' }, SettlementRound.D)).toContain('I35')
    })
    it('introduces pilgrimage site', () => {
      expect(roundBuildings({ players: 1, country: 'france', length: 'short' }, SettlementRound.D)).toContain('F36')
      expect(roundBuildings({ players: 1, country: 'france', length: 'long' }, SettlementRound.D)).toContain('F36')
      expect(roundBuildings({ players: 2, country: 'france', length: 'short' }, SettlementRound.D)).not.toContain('F36')
      expect(roundBuildings({ players: 2, country: 'france', length: 'long' }, SettlementRound.D)).not.toContain('F36')
      expect(roundBuildings({ players: 3, country: 'france', length: 'short' }, SettlementRound.D)).toContain('F36')
      expect(roundBuildings({ players: 3, country: 'france', length: 'long' }, SettlementRound.D)).toContain('F36')
      expect(roundBuildings({ players: 4, country: 'france', length: 'short' }, SettlementRound.D)).toContain('F36')
      expect(roundBuildings({ players: 4, country: 'france', length: 'long' }, SettlementRound.D)).toContain('F36')
    })
    it('introduces camera', () => {
      expect(roundBuildings({ players: 1, country: 'ireland', length: 'short' }, SettlementRound.D)).toContain('I36')
      expect(roundBuildings({ players: 1, country: 'ireland', length: 'long' }, SettlementRound.D)).toContain('I36')
      expect(roundBuildings({ players: 2, country: 'ireland', length: 'short' }, SettlementRound.D)).not.toContain(
        'I36'
      )
      expect(roundBuildings({ players: 2, country: 'ireland', length: 'long' }, SettlementRound.D)).not.toContain('I36')
      expect(roundBuildings({ players: 3, country: 'ireland', length: 'short' }, SettlementRound.D)).toContain('I36')
      expect(roundBuildings({ players: 3, country: 'ireland', length: 'long' }, SettlementRound.D)).toContain('I36')
      expect(roundBuildings({ players: 4, country: 'ireland', length: 'short' }, SettlementRound.D)).toContain('I36')
      expect(roundBuildings({ players: 4, country: 'ireland', length: 'long' }, SettlementRound.D)).toContain('I36')
    })
    it('introduces dormitory', () => {
      expect(roundBuildings({ players: 1, country: 'france', length: 'short' }, SettlementRound.D)).toContain('F37')
      expect(roundBuildings({ players: 1, country: 'france', length: 'long' }, SettlementRound.D)).toContain('F37')
      expect(roundBuildings({ players: 2, country: 'france', length: 'short' }, SettlementRound.D)).toContain('F37')
      expect(roundBuildings({ players: 2, country: 'france', length: 'long' }, SettlementRound.D)).toContain('F37')
      expect(roundBuildings({ players: 3, country: 'france', length: 'short' }, SettlementRound.D)).toContain('F37')
      expect(roundBuildings({ players: 3, country: 'france', length: 'long' }, SettlementRound.D)).toContain('F37')
      expect(roundBuildings({ players: 4, country: 'france', length: 'short' }, SettlementRound.D)).toContain('F37')
      expect(roundBuildings({ players: 4, country: 'france', length: 'long' }, SettlementRound.D)).toContain('F37')
    })
    it('introduces bulwark', () => {
      expect(roundBuildings({ players: 1, country: 'ireland', length: 'short' }, SettlementRound.D)).toContain('I37')
      expect(roundBuildings({ players: 1, country: 'ireland', length: 'long' }, SettlementRound.D)).toContain('I37')
      expect(roundBuildings({ players: 2, country: 'ireland', length: 'short' }, SettlementRound.D)).toContain('I37')
      expect(roundBuildings({ players: 2, country: 'ireland', length: 'long' }, SettlementRound.D)).toContain('I37')
      expect(roundBuildings({ players: 3, country: 'ireland', length: 'short' }, SettlementRound.D)).toContain('I37')
      expect(roundBuildings({ players: 3, country: 'ireland', length: 'long' }, SettlementRound.D)).toContain('I37')
      expect(roundBuildings({ players: 4, country: 'ireland', length: 'short' }, SettlementRound.D)).toContain('I37')
      expect(roundBuildings({ players: 4, country: 'ireland', length: 'long' }, SettlementRound.D)).toContain('I37')
    })
    it('introduces printing office', () => {
      expect(roundBuildings({ players: 1, country: 'france', length: 'short' }, SettlementRound.D)).toContain('F38')
      expect(roundBuildings({ players: 1, country: 'france', length: 'long' }, SettlementRound.D)).toContain('F38')
      expect(roundBuildings({ players: 2, country: 'france', length: 'short' }, SettlementRound.D)).toContain('F38')
      expect(roundBuildings({ players: 2, country: 'france', length: 'long' }, SettlementRound.D)).toContain('F38')
      expect(roundBuildings({ players: 3, country: 'france', length: 'short' }, SettlementRound.D)).toContain('F38')
      expect(roundBuildings({ players: 3, country: 'france', length: 'long' }, SettlementRound.D)).toContain('F38')
      expect(roundBuildings({ players: 4, country: 'france', length: 'short' }, SettlementRound.D)).toContain('F38')
      expect(roundBuildings({ players: 4, country: 'france', length: 'long' }, SettlementRound.D)).toContain('F38')
    })
    it('introduces festival ground', () => {
      expect(roundBuildings({ players: 1, country: 'ireland', length: 'short' }, SettlementRound.D)).toContain('I38')
      expect(roundBuildings({ players: 1, country: 'ireland', length: 'long' }, SettlementRound.D)).toContain('I38')
      expect(roundBuildings({ players: 2, country: 'ireland', length: 'short' }, SettlementRound.D)).toContain('I38')
      expect(roundBuildings({ players: 2, country: 'ireland', length: 'long' }, SettlementRound.D)).toContain('I38')
      expect(roundBuildings({ players: 3, country: 'ireland', length: 'short' }, SettlementRound.D)).toContain('I38')
      expect(roundBuildings({ players: 3, country: 'ireland', length: 'long' }, SettlementRound.D)).toContain('I38')
      expect(roundBuildings({ players: 4, country: 'ireland', length: 'short' }, SettlementRound.D)).toContain('I38')
      expect(roundBuildings({ players: 4, country: 'ireland', length: 'long' }, SettlementRound.D)).toContain('I38')
    })
    it('introduces estate', () => {
      expect(roundBuildings({ players: 1, country: 'france', length: 'short' }, SettlementRound.D)).toContain('G39')
      expect(roundBuildings({ players: 1, country: 'france', length: 'long' }, SettlementRound.D)).toContain('G39')
      expect(roundBuildings({ players: 2, country: 'france', length: 'short' }, SettlementRound.D)).not.toContain('G39')
      expect(roundBuildings({ players: 2, country: 'france', length: 'long' }, SettlementRound.D)).not.toContain('G39')
      expect(roundBuildings({ players: 3, country: 'france', length: 'short' }, SettlementRound.D)).not.toContain('G39')
      expect(roundBuildings({ players: 3, country: 'france', length: 'long' }, SettlementRound.D)).not.toContain('G39')
      expect(roundBuildings({ players: 4, country: 'france', length: 'short' }, SettlementRound.D)).toContain('G39')
      expect(roundBuildings({ players: 4, country: 'france', length: 'long' }, SettlementRound.D)).toContain('G39')
    })
    it('introduces hospice', () => {
      expect(roundBuildings({ players: 1, country: 'france', length: 'short' }, SettlementRound.D)).toContain('F40')
      expect(roundBuildings({ players: 1, country: 'france', length: 'long' }, SettlementRound.D)).toContain('F40')
      expect(roundBuildings({ players: 2, country: 'france', length: 'short' }, SettlementRound.D)).not.toContain('F40')
      expect(roundBuildings({ players: 2, country: 'france', length: 'long' }, SettlementRound.D)).not.toContain('F40')
      expect(roundBuildings({ players: 3, country: 'france', length: 'short' }, SettlementRound.D)).toContain('F40')
      expect(roundBuildings({ players: 3, country: 'france', length: 'long' }, SettlementRound.D)).toContain('F40')
      expect(roundBuildings({ players: 4, country: 'france', length: 'short' }, SettlementRound.D)).toContain('F40')
      expect(roundBuildings({ players: 4, country: 'france', length: 'long' }, SettlementRound.D)).toContain('F40')
    })
    it('introduces guesthouse', () => {
      expect(roundBuildings({ players: 1, country: 'ireland', length: 'short' }, SettlementRound.D)).toContain('I40')
      expect(roundBuildings({ players: 1, country: 'ireland', length: 'long' }, SettlementRound.D)).toContain('I40')
      expect(roundBuildings({ players: 2, country: 'ireland', length: 'short' }, SettlementRound.D)).not.toContain(
        'I40'
      )
      expect(roundBuildings({ players: 2, country: 'ireland', length: 'long' }, SettlementRound.D)).not.toContain('I40')
      expect(roundBuildings({ players: 3, country: 'ireland', length: 'short' }, SettlementRound.D)).toContain('I40')
      expect(roundBuildings({ players: 3, country: 'ireland', length: 'long' }, SettlementRound.D)).toContain('I40')
      expect(roundBuildings({ players: 4, country: 'ireland', length: 'short' }, SettlementRound.D)).toContain('I40')
      expect(roundBuildings({ players: 4, country: 'ireland', length: 'long' }, SettlementRound.D)).toContain('I40')
    })
    it('introduces house of the brotherhood', () => {
      expect(roundBuildings({ players: 1, country: 'france', length: 'short' }, SettlementRound.D)).toContain('G41')
      expect(roundBuildings({ players: 1, country: 'france', length: 'long' }, SettlementRound.D)).toContain('G41')
      expect(roundBuildings({ players: 2, country: 'france', length: 'short' }, SettlementRound.D)).toContain('G41')
      expect(roundBuildings({ players: 2, country: 'france', length: 'long' }, SettlementRound.D)).toContain('G41')
      expect(roundBuildings({ players: 3, country: 'france', length: 'short' }, SettlementRound.D)).toContain('G41')
      expect(roundBuildings({ players: 3, country: 'france', length: 'long' }, SettlementRound.D)).toContain('G41')
      expect(roundBuildings({ players: 4, country: 'france', length: 'short' }, SettlementRound.D)).toContain('G41')
      expect(roundBuildings({ players: 4, country: 'france', length: 'long' }, SettlementRound.D)).toContain('G41')
    })
    it('returns empty otherwise', () => {
      expect(roundBuildings({ players: 1, country: 'france', length: 'short' }, SettlementRound.E)).toHaveLength(0)
    })
  })
  describe('isCloisterBuilding', () => {
    it('considers Priory as a cloister', () => {
      expect(isCloisterBuilding(BuildingEnum.Priory)).toBeTruthy()
    })
    it('considers CloisterLibrary as a cloister', () => {
      expect(isCloisterBuilding(BuildingEnum.CloisterLibrary)).toBeTruthy()
    })
    it('considers Scriptorium as a cloister', () => {
      expect(isCloisterBuilding(BuildingEnum.Scriptorium)).toBeTruthy()
    })
    it('does not consider Market as a cloister', () => {
      expect(isCloisterBuilding(BuildingEnum.Market)).toBeFalsy()
    })
    it('does defines undefined as false', () => {
      expect(isCloisterBuilding(undefined)).toBeFalsy()
    })
  })
})

import { identity } from 'ramda'
import { initialState } from '../../state'
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
import {
  alehouse,
  bakery,
  bathhouse,
  brewery,
  buildersMarket,
  calefactory,
  carpentry,
  castle,
  chamberOfWonders,
  chapel,
  clayMound,
  cloisterChapterHouse,
  cloisterChurch,
  cloisterCourtyard,
  cloisterGarden,
  cloisterLibrary,
  cloisterOffice,
  cloisterWorkshop,
  cooperage,
  cottage,
  dormitory,
  druidsHouse,
  estate,
  farmyard,
  falseLighthouse,
  financedEstate,
  forestHut,
  forgersWorkshop,
  fuelMerchant,
  grainStorage,
  granary,
  grandManor,
  grapevine,
  harborPromenade,
  hospice,
  houseboat,
  houseOfTheBrotherhood,
  inn,
  locutory,
  malthouse,
  market,
  palace,
  peatCoalKiln,
  pilgrimageSite,
  portico,
  printingOffice,
  priory,
  quarry,
  refectory,
  sacristy,
  scriptorium,
  sacredSite,
  shippingCompany,
  shipyard,
  slaughterhouse,
  spinningMill,
  stoneMerchant,
  townEstate,
  whiskeyDistillery,
  windmill,
  winery,
  filialChurch,
} from '../../buildings'

import { use } from '../use'

jest.mock('../../buildings', () => {
  return {
    ...jest.requireActual('../../buildings'),
    alehouse: jest.fn().mockReturnValue(identity),
    bakery: jest.fn().mockReturnValue(identity),
    bathhouse: jest.fn().mockReturnValue(identity),
    brewery: jest.fn().mockReturnValue(identity),
    buildersMarket: jest.fn().mockReturnValue(identity),
    calefactory: jest.fn().mockReturnValue(identity),
    carpentry: jest.fn().mockReturnValue(identity),
    castle: jest.fn().mockReturnValue(identity),
    cooperage: jest.fn().mockReturnValue(identity),
    cottage: jest.fn().mockReturnValue(identity),
    chamberOfWonders: jest.fn().mockReturnValue(identity),
    chapel: jest.fn().mockReturnValue(identity),
    clayMound: jest.fn().mockReturnValue(identity),
    cloisterChapterHouse: jest.fn().mockReturnValue(identity),
    cloisterChurch: jest.fn().mockReturnValue(identity),
    cloisterCourtyard: jest.fn().mockReturnValue(identity),
    cloisterGarden: jest.fn().mockReturnValue(identity),
    cloisterLibrary: jest.fn().mockReturnValue(identity),
    cloisterOffice: jest.fn().mockReturnValue(identity),
    cloisterWorkshop: jest.fn().mockReturnValue(identity),
    dormitory: jest.fn().mockReturnValue(identity),
    druidsHouse: jest.fn().mockReturnValue(identity),
    estate: jest.fn().mockReturnValue(identity),
    farmyard: jest.fn().mockReturnValue(identity),
    falseLighthouse: jest.fn().mockReturnValue(identity),
    filialChurch: jest.fn().mockReturnValue(identity),
    financedEstate: jest.fn().mockReturnValue(identity),
    forestHut: jest.fn().mockReturnValue(identity),
    forgersWorkshop: jest.fn().mockReturnValue(identity),
    fuelMerchant: jest.fn().mockReturnValue(identity),
    grainStorage: jest.fn().mockReturnValue(identity),
    granary: jest.fn().mockReturnValue(identity),
    grandManor: jest.fn().mockReturnValue(identity),
    grapevine: jest.fn().mockReturnValue(identity),
    harborPromenade: jest.fn().mockReturnValue(identity),
    hospice: jest.fn().mockReturnValue(identity),
    houseboat: jest.fn().mockReturnValue(identity),
    houseOfTheBrotherhood: jest.fn().mockReturnValue(identity),
    inn: jest.fn().mockReturnValue(identity),
    locutory: jest.fn().mockReturnValue(identity),
    malthouse: jest.fn().mockReturnValue(identity),
    market: jest.fn().mockReturnValue(identity),
    palace: jest.fn().mockReturnValue(identity),
    peatCoalKiln: jest.fn().mockReturnValue(identity),
    pilgrimageSite: jest.fn().mockReturnValue(identity),
    portico: jest.fn().mockReturnValue(identity),
    printingOffice: jest.fn().mockReturnValue(identity),
    priory: jest.fn().mockReturnValue(identity),
    quarry: jest.fn().mockReturnValue(identity),
    refectory: jest.fn().mockReturnValue(identity),
    sacristy: jest.fn().mockReturnValue(identity),
    scriptorium: jest.fn().mockReturnValue(identity),
    sacredSite: jest.fn().mockReturnValue(identity),
    shippingCompany: jest.fn().mockReturnValue(identity),
    shipyard: jest.fn().mockReturnValue(identity),
    slaughterhouse: jest.fn().mockReturnValue(identity),
    spinningMill: jest.fn().mockReturnValue(identity),
    stoneMerchant: jest.fn().mockReturnValue(identity),
    townEstate: jest.fn().mockReturnValue(identity),
    whiskeyDistillery: jest.fn().mockReturnValue(identity),
    windmill: jest.fn().mockReturnValue(identity),
    winery: jest.fn().mockReturnValue(identity),
  }
})

describe('commands/use', () => {
  const p0: Tableau = {
    color: PlayerColor.Blue,
    clergy: [],
    settlements: [],
    landscape: [
      [['W'], ['C'], [], [], [], [], [], [], []],
      [['W'], ['C'], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['P'], [], []],
      [[], [], ['P'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['P'], [], []],
    ] as Tile[][],
    wonders: 0,
    landscapeOffset: 1,
    peat: 0,
    penny: 1,
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
      pointingBefore: 3,
      joker: 2,
      sheep: 1,
      grain: 0,
    },
    wonders: 0,
    players: [
      {
        ...p0,
        color: PlayerColor.Red,
        clergy: ['LB1R', 'LB2R', 'PRIR'] as Clergy[],
        landscape: [
          [['W'], ['C'], [], [], [], [], [], [], []],
          [['W'], ['C'], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['P', 'LR1'], [], []],
          [[], [], ['P'], ['P', 'LFO'], ['P', 'LR2'], ['P'], ['P', 'LR3'], [], []],
        ] as Tile[][],
        landscapeOffset: 1,
      },
      {
        ...p0,
        color: PlayerColor.Green,
        clergy: ['LB1G', 'LB2G', 'PRIG'] as Clergy[],
        landscape: [
          [['W'], ['C'], [], [], [], [], [], [], []],
          [['W'], ['C'], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['P', 'LG1'], [], []],
          [[], [], ['P'], ['P', 'LFO'], ['P', 'LG2'], ['P'], ['P', 'LG3'], [], []],
        ] as Tile[][],
        landscapeOffset: 1,
      },
      {
        ...p0,
        color: PlayerColor.Blue,
        clergy: ['LB1B', 'LB2B', 'PRIB'] as Clergy[],
        landscape: [
          [['W'], ['C'], [], [], [], [], [], [], []],
          [['W'], ['C'], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['P', 'LB1'], [], []],
          [[], [], ['P'], ['P', 'LFO'], ['P', 'LB2'], ['P'], ['P', 'LB3'], [], []],
        ] as Tile[][],
        landscapeOffset: 1,
      },
    ],
    buildings: [],
    plotPurchasePrices: [1, 1, 1, 1, 1, 1],
    districtPurchasePrices: [],
    frame: {
      next: 1,
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

  describe('use', () => {
    it('throws errors on invalid building', () => {
      expect(() => use('XXX' as unknown as BuildingEnum, [])(s0)).toThrow()
    })
    it('retains undefined state', () => {
      const s1 = use(BuildingEnum.ClayMoundR, ['Jo'])(undefined)!
      expect(s1).toBeUndefined()
    })
    it('moves next clergyman to the building', () => {
      const s1 = {
        ...s0,
      }
      const s2 = use(BuildingEnum.FarmYardR, ['Sh'])(s1)!
      expect(s1.frame.activePlayerIndex).toBe(0)
      expect(s1.players[0].clergy).toStrictEqual(['LB1R', 'LB2R', 'PRIR'])
      expect(s2.players[0].clergy).toStrictEqual(['LB2R', 'PRIR'])
      expect(s2.players[0].landscape[2][4]).toStrictEqual(['P', 'LR2', 'LB1R'])
    })
    it('fallback to prior if laypeople are used', () => {
      const s1 = {
        ...s0,
        players: [{ ...s0.players[0], clergy: [Clergy.PriorR] }, ...s0.players.slice(1)],
      }
      const s2 = use(BuildingEnum.FarmYardR, ['ShJo'])(s1)!
      expect(s1.frame.activePlayerIndex).toBe(0)
      expect(s1.players[0].landscape[2][4]).toStrictEqual(['P', 'LR2'])
      expect(s1.players[0].clergy).toStrictEqual(['PRIR'])
      expect(s2.players[0].clergy).toStrictEqual([])
      expect(s2.players[0].landscape[2][4]).toStrictEqual(['P', 'LR2', 'PRIR'])
    })
    it('gathers the goods', () => {
      const s1 = {
        ...s0,
      }
      use(BuildingEnum.FarmYardR, ['Sh'])(s1)!
      expect(farmyard).toHaveBeenCalled()
    })
    it('can not use if nextUse=any and mainActionUsed and no bonus actions', () => {
      const s1 = {
        ...s0,
        frame: {
          ...s0.frame,
          mainActionUsed: true,
          bonusActions: [],
          usableBuildings: [],
          nextUse: NextUseClergy.Any,
        },
      }
      use(BuildingEnum.ClayMoundR, [])(s1)!
      expect(clayMound).toHaveBeenCalledWith(undefined)
    })
    it('can use a building if it is in usableBuildings and nextUse is free and building not forbidden', () => {
      const s1 = {
        ...s0,
        frame: {
          ...s0.frame,
          mainActionUsed: true,
          bonusActions: [],
          usableBuildings: [BuildingEnum.Brewery],
          nextUse: NextUseClergy.Free,
        },
      }
      use(BuildingEnum.Brewery, [])(s1)!
      expect(brewery).toHaveBeenCalled()
    })
    it('does not allow forbidden buildings', () => {
      const s1 = {
        ...s0,
        frame: {
          ...s0.frame,
          mainActionUsed: true,
          bonusActions: [],
          usableBuildings: [BuildingEnum.CloisterGarden],
          unusableBuildings: [BuildingEnum.CloisterGarden],
          nextUse: NextUseClergy.Free,
        },
      }
      use(BuildingEnum.CloisterGarden, [])(s1)!
      expect(cloisterGarden).toHaveBeenCalledWith()
    })
    it('does not allow usage if mainActionUsed and no bonus actions', () => {
      const s1 = {
        ...s0,
        frame: {
          ...s0.frame,
          mainActionUsed: true,
          bonusActions: [],
          usableBuildings: [],
        },
      }
      use(BuildingEnum.CloisterOfficeG, [])(s1)!
      expect(cloisterOffice).toHaveBeenCalledWith(undefined)
    })

    it('calls the bakery', () => {
      use(BuildingEnum.Bakery, [])(s0)!
      expect(bakery).toHaveBeenCalled()
    })
    it('calls the alehouse', () => {
      use(BuildingEnum.Alehouse, [])(s0)!
      expect(alehouse).toHaveBeenCalled()
    })
    it('calls the bathhouse', () => {
      use(BuildingEnum.Bathhouse, [])(s0)!
      expect(bathhouse).toHaveBeenCalled()
    })
    it('calls the buildersMarket', () => {
      use(BuildingEnum.BuildersMarket, [])(s0)!
      expect(buildersMarket).toHaveBeenCalled()
    })
    it('calls the calefactory', () => {
      use(BuildingEnum.Calefactory, [])(s0)!
      expect(calefactory).toHaveBeenCalled()
    })
    it('calls the carpentry', () => {
      use(BuildingEnum.Carpentry, ['2', '-1'])(s0)!
      expect(carpentry).toHaveBeenCalledWith(2, -1)
    })
    it('calls the castle', () => {
      use(BuildingEnum.Castle, [])(s0)!
      expect(castle).toHaveBeenCalled()
    })
    it('calls the chamberOfWonders', () => {
      use(BuildingEnum.ChamberOfWonders, [])(s0)!
      expect(chamberOfWonders).toHaveBeenCalled()
    })
    it('calls the chapel', () => {
      use(BuildingEnum.Chapel, [])(s0)!
      expect(chapel).toHaveBeenCalled()
    })
    it('calls the cloisterChapterHouse', () => {
      use(BuildingEnum.CloisterChapterHouse, [])(s0)!
      expect(cloisterChapterHouse).toHaveBeenCalled()
    })
    it('calls the cloisterChurch', () => {
      use(BuildingEnum.CloisterChurch, [])(s0)!
      expect(cloisterChurch).toHaveBeenCalled()
    })
    it('calls the cloisterCourtyard', () => {
      use(BuildingEnum.CloisterCourtyard, [])(s0)!
      expect(cloisterCourtyard).toHaveBeenCalled()
    })
    it('calls the cloisterGarden', () => {
      use(BuildingEnum.CloisterGarden, [])(s0)!
      expect(cloisterGarden).toHaveBeenCalled()
    })
    it('calls the cloisterLibrary', () => {
      use(BuildingEnum.CloisterLibrary, [])(s0)!
      expect(cloisterLibrary).toHaveBeenCalled()
    })
    it('calls the cloisterWorkshop', () => {
      use(BuildingEnum.CloisterWorkshop, [])(s0)!
      expect(cloisterWorkshop).toHaveBeenCalled()
    })
    it('calls the cooperage', () => {
      use(BuildingEnum.Cooperage, ['WoWoWo', 'Wh'])(s0)!
      expect(cooperage).toHaveBeenCalled()
    })
    it('calls the cottage', () => {
      use(BuildingEnum.Cottage, [])(s0)!
      expect(cottage).toHaveBeenCalled()
    })
    it('calls the dormitory', () => {
      use(BuildingEnum.Dormitory, [])(s0)!
      expect(dormitory).toHaveBeenCalled()
    })
    it('calls the druidsHouse', () => {
      use(BuildingEnum.DruidsHouse, ['Bo', 'PnPnPnPnPnGnGnGn'])(s0)!
      expect(druidsHouse).toHaveBeenCalled()
    })
    it('calls the estate', () => {
      use(BuildingEnum.Estate, [])(s0)!
      expect(estate).toHaveBeenCalled()
    })
    it('calls the falseLighthouse', () => {
      use(BuildingEnum.FalseLighthouse, ['Be'])(s0)!
      expect(falseLighthouse).toHaveBeenCalledWith('Be')
    })
    it('calls the filialChurch', () => {
      use(BuildingEnum.FilialChurch, [])(s0)!
      expect(filialChurch).toHaveBeenCalled()
    })
    it('calls the financedEstate', () => {
      use(BuildingEnum.FinancedEstate, [])(s0)!
      expect(financedEstate).toHaveBeenCalled()
    })
    it('calls the forestHut', () => {
      use(BuildingEnum.ForestHut, [])(s0)!
      expect(forestHut).toHaveBeenCalled()
    })
    it('calls the forgersWorkshop', () => {
      use(BuildingEnum.ForgersWorkshop, [])(s0)!
      expect(forgersWorkshop).toHaveBeenCalled()
    })
    it('calls the fuelMerchant', () => {
      use(BuildingEnum.FuelMerchant, [])(s0)!
      expect(fuelMerchant).toHaveBeenCalled()
    })
    it('calls the grainStorage', () => {
      use(BuildingEnum.GrainStorage, [])(s0)!
      expect(grainStorage).toHaveBeenCalled()
    })
    it('calls the granary', () => {
      use(BuildingEnum.Granary, [])(s0)!
      expect(granary).toHaveBeenCalled()
    })
    it('calls the grandManor', () => {
      use(BuildingEnum.GrandManor, [])(s0)!
      expect(grandManor).toHaveBeenCalled()
    })
    it('calls the grapevine A', () => {
      use(BuildingEnum.GrapevineA, [])(s0)!
      expect(grapevine).toHaveBeenCalled()
    })
    it('calls the grapevine B', () => {
      use(BuildingEnum.GrapevineB, [])(s0)!
      expect(grapevine).toHaveBeenCalled()
    })
    it('calls the harborPromenade', () => {
      use(BuildingEnum.HarborPromenade, [])(s0)!
      expect(harborPromenade).toHaveBeenCalled()
    })
    it('calls the hospice', () => {
      use(BuildingEnum.Hospice, [])(s0)!
      expect(hospice).toHaveBeenCalled()
    })
    it('calls the houseOfTheBrotherhood', () => {
      use(BuildingEnum.HouseOfTheBrotherhood, [])(s0)!
      expect(houseOfTheBrotherhood).toHaveBeenCalled()
    })
    it('calls the houseboat', () => {
      use(BuildingEnum.Houseboat, [])(s0)!
      expect(houseboat).toHaveBeenCalled()
    })
    it('calls the inn', () => {
      use(BuildingEnum.Inn, [])(s0)!
      expect(inn).toHaveBeenCalled()
    })
    it('calls the locutory', () => {
      use(BuildingEnum.Locutory, ['PnPn'])(s0)!
      expect(locutory).toHaveBeenCalled()
    })
    it('calls the malthouse', () => {
      use(BuildingEnum.Malthouse, ['GnGn'])(s0)!
      expect(malthouse).toHaveBeenCalledWith('GnGn')
    })
    it('calls the market', () => {
      use(BuildingEnum.Market, [])(s0)!
      expect(market).toHaveBeenCalled()
    })
    it('calls the palace', () => {
      use(BuildingEnum.Palace, [])(s0)!
      expect(palace).toHaveBeenCalled()
    })
    it('calls the peatCoalKiln', () => {
      use(BuildingEnum.PeatCoalKiln, [])(s0)!
      expect(peatCoalKiln).toHaveBeenCalled()
    })
    it('calls the pilgrimageSite', () => {
      use(BuildingEnum.PilgrimageSite, [])(s0)!
      expect(pilgrimageSite).toHaveBeenCalled()
    })
    it('calls the portico', () => {
      use(BuildingEnum.Portico, ['Rq'])(s0)!
      expect(portico).toHaveBeenCalled()
    })
    it('calls the printingOffice', () => {
      use(BuildingEnum.PrintingOffice, [])(s0)!
      expect(printingOffice).toHaveBeenCalled()
    })
    it('calls the priory', () => {
      use(BuildingEnum.Priory, [])(s0)!
      expect(priory).toHaveBeenCalled()
    })
    it('calls the quarry A', () => {
      use(BuildingEnum.QuarryA, [])(s0)!
      expect(quarry).toHaveBeenCalled()
    })
    it('calls the quarry B', () => {
      use(BuildingEnum.QuarryB, [])(s0)!
      expect(quarry).toHaveBeenCalled()
    })
    it('calls the refectory', () => {
      use(BuildingEnum.Refectory, [])(s0)!
      expect(refectory).toHaveBeenCalled()
    })
    it('calls the scriptorium', () => {
      use(BuildingEnum.Scriptorium, ['Wh'])(s0)!
      expect(scriptorium).toHaveBeenCalledWith('Wh')
    })
    it('calls the sacristy', () => {
      use(BuildingEnum.Sacristy, [])(s0)!
      expect(sacristy).toHaveBeenCalled()
    })
    it('calls the sacredSite', () => {
      use(BuildingEnum.SacredSite, ['MaWh'])(s0)!
      expect(sacredSite).toHaveBeenCalledWith('MaWh')
    })
    it('calls the shippingCompany', () => {
      use(BuildingEnum.ShippingCompany, [])(s0)!
      expect(shippingCompany).toHaveBeenCalled()
    })
    it('calls the shipyard', () => {
      use(BuildingEnum.Shipyard, [])(s0)!
      expect(shipyard).toHaveBeenCalled()
    })
    it('calls the slaughterhouse', () => {
      use(BuildingEnum.Slaughterhouse, [])(s0)!
      expect(slaughterhouse).toHaveBeenCalled()
    })
    it('calls the spinningMill', () => {
      use(BuildingEnum.SpinningMill, [])(s0)!
      expect(spinningMill).toHaveBeenCalled()
    })
    it('calls the stoneMerchant', () => {
      use(BuildingEnum.StoneMerchant, [])(s0)!
      expect(stoneMerchant).toHaveBeenCalled()
    })
    it('calls the townEstate', () => {
      use(BuildingEnum.TownEstate, [])(s0)!
      expect(townEstate).toHaveBeenCalled()
    })
    it('calls the whiskeyDistillery', () => {
      use(BuildingEnum.WhiskeyDistillery, ['WoPtMa'])(s0)!
      expect(whiskeyDistillery).toHaveBeenCalled()
    })
    it('calls the windmill', () => {
      use(BuildingEnum.Windmill, [])(s0)!
      expect(windmill).toHaveBeenCalled()
    })
    it('calls the winery', () => {
      use(BuildingEnum.Winery, [])(s0)!
      expect(winery).toHaveBeenCalled()
    })
  })
})

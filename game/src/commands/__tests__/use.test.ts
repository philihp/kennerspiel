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
  bulwark,
  calefactory,
  camera,
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
  coalHarbor,
  cooperage,
  cottage,
  dormitory,
  druidsHouse,
  estate,
  farmyard,
  falseLighthouse,
  festivalGround,
  filialChurch,
  financedEstate,
  forestHut,
  forgersWorkshop,
  fuelMerchant,
  grainStorage,
  granary,
  grandManor,
  grapevine,
  guesthouse,
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
  roundTower,
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
} from '../../buildings'
import { complete as clayMoundComplete } from '../../buildings/clayMound'

import { complete, use } from '../use'

jest.mock('../../buildings/clayMound', () => {
  return {
    complete: jest.fn().mockReturnValue(() => ['foo']),
  }
})

jest.mock('../../buildings', () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return {
    ...jest.requireActual('../../buildings'),
    alehouse: jest.fn().mockReturnValue(identity),
    bakery: jest.fn().mockReturnValue(identity),
    bathhouse: jest.fn().mockReturnValue(identity),
    brewery: jest.fn().mockReturnValue(identity),
    buildersMarket: jest.fn().mockReturnValue(identity),
    bulwark: jest.fn().mockReturnValue(identity),
    calefactory: jest.fn().mockReturnValue(identity),
    camera: jest.fn().mockReturnValue(identity),
    carpentry: jest.fn().mockReturnValue(identity),
    castle: jest.fn().mockReturnValue(identity),
    coalHarbor: jest.fn().mockReturnValue(identity),
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
    festivalGround: jest.fn().mockReturnValue(identity),
    filialChurch: jest.fn().mockReturnValue(identity),
    financedEstate: jest.fn().mockReturnValue(identity),
    forestHut: jest.fn().mockReturnValue(identity),
    forgersWorkshop: jest.fn().mockReturnValue(identity),
    fuelMerchant: jest.fn().mockReturnValue(identity),
    grainStorage: jest.fn().mockReturnValue(identity),
    granary: jest.fn().mockReturnValue(identity),
    grandManor: jest.fn().mockReturnValue(identity),
    grapevine: jest.fn().mockReturnValue(identity),
    guesthouse: jest.fn().mockReturnValue(identity),
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
    roundTower: jest.fn().mockReturnValue(identity),
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
      [['W'], ['C'], ['P', 'LMO'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['P'], [], []],
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
          [['W'], ['C'], ['P', 'LMO'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['P', 'LR1'], [], []],
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
          [['W'], ['C'], ['P', 'LMO'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['P', 'LG1'], [], []],
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
          [['W'], ['C'], ['P', 'LMO'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['P', 'LB1'], [], []],
          [[], [], ['P'], ['P', 'LFO'], ['P', 'LB2'], ['P'], ['P', 'LB3'], [], []],
        ] as Tile[][],
        landscapeOffset: 1,
      },
    ],
    buildings: [],
    plotPurchasePrices: [1, 1, 1, 1, 1, 1],
    districtPurchasePrices: [],
    frame: {
      round: 1,
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
  const s1Bonus = {
    ...s0,
    config: {
      ...s0.config,
      country: 'france',
      length: 'long',
      players: 3,
    },
    players: [
      {
        ...s0.players[0],
        color: PlayerColor.Red,
        clergy: ['PRIR', 'LB2R'],
        landscape: [
          [[], [], ['P', 'G07'], ['P', 'LFO'], ['P', 'LFO'], ['P', 'SR3'], ['H', 'LR1'], [], []],
          [[], [], ['P', 'LMO'], ['P', 'G06'], ['P', 'LR2', 'LB1R'], ['P', 'F40'], ['P', 'LR3'], ['H'], ['M']],
          [[], [], ['P', 'LFO'], ['P', 'SR6'], ['P', 'F21'], ['P', 'SR2'], ['H', 'F27'], ['H'], ['.']],
          [[], [], ['P'], ['P'], ['P', 'SR5'], ['H', 'F14'], ['H', 'SR1'], ['H', 'G28'], ['M', 'G22']],
          [[], [], [], [], [], [], [], ['H'], ['.']],
        ],
        landscapeOffset: 0,
        sheep: 10,
        straw: 2,
        meat: 0,
      },
      {
        ...s0.players[0],
        color: PlayerColor.Blue,
        clergy: ['PRIB'],
        landscape: [
          [[], [], ['P'], ['P', 'F36'], ['P', 'SB6'], ['P', 'F30', 'LB2B'], ['H'], [], []],
          [[], [], ['P', 'F38'], ['P', 'SB2'], ['P', 'F24'], ['P', 'SB3'], ['H', 'F04'], [], []],
          [
            [],
            [],
            ['P', 'SB5'],
            ['P', 'F05'],
            ['P', 'F09'],
            ['P', 'G02'],
            ['H', 'LB1'],
            ['H', 'F32', 'LB1B'],
            ['M', 'F29'],
          ],
          [[], [], ['P', 'LMO'], ['P'], ['P', 'LB2'], ['P', 'G01'], ['P', 'LB3'], ['H', 'G16'], ['.']],
          [[], [], ['P', 'LMO'], ['P'], ['P'], ['H'], ['H'], [], []],
        ],
        landscapeOffset: 2,
      },
      {
        ...s0.players[0],
        color: PlayerColor.Green,
        clergy: ['PRIG'],
        landscape: [
          [[], [], ['P'], ['P', 'LFO'], ['P'], ['H'], ['H'], [], []],
          [['W'], ['C', 'F11'], ['P', 'SG3'], ['P', 'F20'], ['P', 'SG1'], ['P', 'G34', 'LB1G'], ['H'], [], []],
          [['W'], ['C', 'SG4'], ['P', 'F08'], ['P', 'SG6'], ['P', 'G12'], ['P', 'G18'], ['H', 'LG1'], [], []],
          [['W'], ['C', 'F33'], ['P', 'G19'], ['P', 'LFO'], ['P', 'LG2'], ['P', 'F17', 'LB2G'], ['P', 'LG3'], [], []],
          [['W'], ['C', 'G26'], [], [], [], [], [], [], []],
        ],
        landscapeOffset: 2,
        sheep: 1,
        meat: 1,
        straw: 1,
      },
    ],
    frame: {
      ...s0.frame,
      startingPlayer: 0,
      settlementRound: 'D',
      currentPlayerIndex: 0,
      activePlayerIndex: 0,
      bonusRoundPlacement: true,
      mainActionUsed: false,
      bonusActions: [],
      canBuyLandscape: true,
      unusableBuildings: [],
      usableBuildings: [],
      nextUse: 'only-prior',
    },
  } as GameStatePlaying

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
    it('calls the bulwark', () => {
      use(BuildingEnum.Bulwark, ['Bo'])(s0)!
      expect(bulwark).toHaveBeenCalled()
    })
    it('calls the calefactory', () => {
      use(BuildingEnum.Calefactory, [])(s0)!
      expect(calefactory).toHaveBeenCalled()
    })
    it('calls the camera', () => {
      use(BuildingEnum.Camera, ['BoBoCeCe'])(s0)!
      expect(camera).toHaveBeenCalled()
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
    it('calls the coalHarbor', () => {
      use(BuildingEnum.CoalHarbor, ['PtPtPt'])(s0)!
      expect(coalHarbor).toHaveBeenCalled()
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
    it('calls the festivalGround', () => {
      use(BuildingEnum.FestivalGround, ['Be', 'Bo'])(s0)!
      expect(festivalGround).toHaveBeenCalled()
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
    it('calls the guesthouse', () => {
      use(BuildingEnum.Guesthouse, [])(s0)!
      expect(guesthouse).toHaveBeenCalled()
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
    it('calls the roundTower', () => {
      use(BuildingEnum.RoundTower, [])(s0)!
      expect(roundTower).toHaveBeenCalled()
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
    it('can use anothers building during extra round', () => {
      expect(s1Bonus.players[0]).toMatchObject({
        clergy: ['PRIR', 'LB2R'],
      })
      const s2 = use(BuildingEnum.Slaughterhouse, ['ShShSwSw'])(s1Bonus)!
      expect(slaughterhouse).toHaveBeenCalled()
      expect(s2.players[0]).toMatchObject({
        clergy: ['LB2R'],
      })
      expect(s2.players[2].landscape[3][2]).toStrictEqual(['P', 'G19', 'PRIR'])
    })
  })

  describe('complete', () => {
    it('allows USE when main action available', () => {
      const c0 = complete(s0)([])
      expect(c0).toStrictEqual(['USE'])
    })
    it('does not allow use main action already used', () => {
      const s1 = {
        ...s0,
        frame: {
          ...s0.frame,
          mainActionUsed: true,
        },
      }
      const c0 = complete(s1)([])
      expect(c0).toStrictEqual([])
    })

    it('does not allow use when main action free but no clergy', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            clergy: [],
          },
          ...s0.players.slice(1),
        ],
        frame: {
          ...s0.frame,
          mainActionUsed: false,
          nextUse: NextUseClergy.Any,
        },
      }
      const c0 = complete(s1)([])
      expect(c0).toStrictEqual([])
    })

    it('allows when main action unavailable, but next use is onlyPrior, maybe from being constructed', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            clergy: [Clergy.PriorB],
          },
          ...s0.players,
        ],
        frame: {
          ...s0.frame,
          mainActionUsed: true,
          nextUse: NextUseClergy.OnlyPrior,
          usableBuildings: [BuildingEnum.Priory],
        },
      }
      const c0 = complete(s1)([])
      expect(c0).toStrictEqual(['USE'])
    })

    it('disallows when main action unavailable, but next use is onlyPrior, but no prior', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            clergy: [Clergy.LayBrother1B],
          },
          ...s0.players,
        ],
        frame: {
          ...s0.frame,
          mainActionUsed: true,
          nextUse: NextUseClergy.OnlyPrior,
          usableBuildings: [BuildingEnum.Priory],
        },
      }
      const c0 = complete(s1)([])
      expect(c0).toStrictEqual([])
    })

    it('allows when main action unavailable, but next use is free, due to ability of another building', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            clergy: [Clergy.LayBrother1B],
          },
          ...s0.players,
        ],
        frame: {
          ...s0.frame,
          mainActionUsed: true,
          nextUse: NextUseClergy.Free,
          usableBuildings: [BuildingEnum.CloisterGarden],
        },
      }
      const c0 = complete(s1)([])
      expect(c0).toStrictEqual(['USE'])
    })

    it('disallows when main action unavailable, but next use is free, because there are no clergy', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            clergy: [],
          },
          ...s0.players,
        ],
        frame: {
          ...s0.frame,
          mainActionUsed: true,
          nextUse: NextUseClergy.Free,
          usableBuildings: [BuildingEnum.CloisterGarden],
        },
      }
      const c0 = complete(s1)([])
      expect(c0).toStrictEqual(['USE'])
    })

    it('disallows when main action unavailable, prior use but no prior', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            clergy: [Clergy.LayBrother1R, Clergy.LayBrother2R],
          },
          ...s0.players.slice(1),
        ],
        frame: {
          ...s0.frame,
          mainActionUsed: true,
          nextUse: NextUseClergy.OnlyPrior,
          usableBuildings: [BuildingEnum.Priory],
        },
      }
      const c0 = complete(s1)([])
      expect(c0).toStrictEqual([])
    })
    it('allows only use of usableBuildings when nextUse is OnlyPrior', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            clergy: [Clergy.PriorR, Clergy.LayBrother1R],
          },
          ...s0.players.slice(1),
        ],
        frame: {
          ...s0.frame,
          mainActionUsed: true,
          nextUse: NextUseClergy.OnlyPrior,
          usableBuildings: [BuildingEnum.Priory],
        },
      }
      const c0 = complete(s1)(['USE'])
      expect(c0).toStrictEqual(['G01'])
    })

    it('allows when main action unavailable, but usage is allowed maybe from Priory, but no clergy', () => {
      const s1 = {
        ...s0,
        players: s0.players.map((p) => ({
          ...p,
          clergy: [],
        })),
        frame: {
          ...s0.frame,
          mainActionUsed: true,
          nextUse: NextUseClergy.Free,
          usableBuildings: [BuildingEnum.GrainStorage, BuildingEnum.BuildersMarket],
        },
      }
      const c0 = complete(s1)([])
      expect(c0).toStrictEqual(['USE'])
    })

    it('gives a list of buildings that are free', () => {
      const c0 = complete(s0)(['USE'])
      expect(c0).toStrictEqual(['LR1', 'LR2', 'LR3'])
    })
    it('during bonus round, can use all buildings', () => {
      const c0 = complete(s1Bonus)(['USE'])
      expect(c0).toStrictEqual([
        'G01',
        'G02',
        'F04',
        'F05',
        'G06',
        'G07',
        'F08',
        'F09',
        'F11',
        'G12',
        'F14',
        'G16',
        'F17',
        'G18',
        'G19',
        'F20',
        'F21',
        'G22',
        'F24',
        'G26',
        'F27',
        'G28',
        'F29',
        'F30',
        'F32',
        'F33',
        'G34',
        'F36',
        'F38',
        'F40',
        'LB1',
        'LB2',
        'LB3',
        'LG1',
        'LG2',
        'LG3',
        'LR1',
        'LR2',
        'LR3',
      ])
    })

    it('calls the buildingComplete with all the params', () => {
      const c0 = complete(s0)(['USE', 'LR1', 'Jo'])
      expect(clayMoundComplete).toHaveBeenCalledWith(['Jo'])
    })

    it('gives back [] if weird building being used', () => {
      const c0 = complete(s0)(['USE', 'PRIR'])
      expect(c0).toStrictEqual([])
    })

    it('gives back [] if weird command, how did we get here?', () => {
      const c0 = complete(s0)(['YUZU'])
      expect(c0).toStrictEqual([])
    })

    describe('single player', () => {
      const s1 = {
        ...s0,
        config: {
          players: 1,
          country: 'france',
          length: 'long',
        },
        players: [s0.players[0], s0.players[1]],
        buildings: ['G18', 'G19'],
        frame: {
          ...s0.frame,
          mainActionUsed: true,
          neutralBuildingPhase: true,
          canBuyLandscape: true,
          currentPlayerIndex: 0,
          activePlayerIndex: 0,
          bonusActions: ['BUILD'],
          usableBuildings: ['F15'],
          nextUse: 'only-prior',
        },
      } as GameStatePlaying
      it('does not complete USE', () => {
        const c1 = complete(s1)([])
        expect(c1).not.toContain('USE')
      })
    })
  })
})

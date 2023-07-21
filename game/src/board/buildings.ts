import { filter, union } from 'ramda'
import { match } from 'ts-pattern'
import {
  BuildingEnum,
  Cost,
  ErectionEnum,
  GameCommandConfigParams,
  SettlementEnum,
  SettlementRound,
  StateReducer,
} from '../types'

export const costForBuilding = (building: BuildingEnum): Cost =>
  match<BuildingEnum, Cost>(building)
    .with(BuildingEnum.Bakery, () => ({ clay: 2, straw: 1 }))
    .with(BuildingEnum.CloisterCourtyard, () => ({ wood: 2 }))
    .with(BuildingEnum.HarborPromenade, () => ({ wood: 1, stone: 1 }))
    .with(BuildingEnum.Market, () => ({ stone: 2 }))
    .with(BuildingEnum.PeatCoalKiln, () => ({ clay: 1 }))
    .with(BuildingEnum.StoneMerchant, () => ({ wood: 1 }))
    .with(BuildingEnum.Windmill, () => ({ wood: 3, clay: 2 }))
    .with(BuildingEnum.CloisterGarden, () => ({ penny: 3 }))
    .with(BuildingEnum.FuelMerchant, () => ({ clay: 1, straw: 1 }))
    .with(BuildingEnum.Priory, () => ({ wood: 1, clay: 1 }))
    .with(BuildingEnum.BuildersMarket, () => ({ clay: 2 }))
    .with(BuildingEnum.Carpentry, () => ({ wood: 2, clay: 1 }))
    .with(BuildingEnum.GrainStorage, () => ({ wood: 1, straw: 1 }))
    .with(BuildingEnum.CloisterLibrary, () => ({ stone: 2, straw: 1 }))
    .with(BuildingEnum.CloisterWorkshop, () => ({ wood: 3 }))
    .with(BuildingEnum.GrapevineA, () => ({ wood: 1 }))
    .with(BuildingEnum.Slaughterhouse, () => ({ wood: 2, clay: 2 }))
    .with(BuildingEnum.CloisterChapterHouse, () => ({ clay: 3, straw: 1 }))
    .with(BuildingEnum.FinancedEstate, () => ({ clay: 1, stone: 1 }))
    .with(BuildingEnum.CloisterChurch, () => ({ clay: 5, stone: 3 }))
    .with(BuildingEnum.QuarryA, () => ({ penny: 5 }))
    .with(BuildingEnum.Shipyard, () => ({ clay: 4, stone: 1 }))
    .with(BuildingEnum.Winery, () => ({ clay: 2, straw: 2 }))
    .with(BuildingEnum.Inn, () => ({ wood: 2, straw: 2 }))
    .with(BuildingEnum.Bathhouse, () => ({ stone: 1, straw: 1 }))
    .with(BuildingEnum.ChamberOfWonders, () => ({ wood: 1, clay: 1 }))
    .with(BuildingEnum.Castle, () => ({ wood: 6, stone: 5 }))
    .with(BuildingEnum.Palace, () => ({ penny: 25 }))
    .with(BuildingEnum.ShippingCompany, () => ({ wood: 3, clay: 3 }))
    .with(BuildingEnum.TownEstate, () => ({ stone: 2, straw: 2 }))
    .with(BuildingEnum.Calefactory, () => ({ stone: 1 }))
    .with(BuildingEnum.QuarryB, () => ({ penny: 5 }))
    .with(BuildingEnum.GrapevineB, () => ({ wood: 1 }))
    .with(BuildingEnum.Dormitory, () => ({ clay: 3 }))
    .with(BuildingEnum.ForgersWorkshop, () => ({ clay: 2, straw: 1 }))
    .with(BuildingEnum.HouseOfTheBrotherhood, () => ({ clay: 1, stone: 1 }))
    .with(BuildingEnum.PrintingOffice, () => ({ wood: 1, stone: 2 }))
    .with(BuildingEnum.Sacristy, () => ({ stone: 3, straw: 2 }))
    .with(BuildingEnum.Hospice, () => ({ wood: 3, straw: 1 }))
    .with(BuildingEnum.PilgrimageSite, () => ({ penny: 6 }))
    .with(BuildingEnum.Estate, () => ({ wood: 2, stone: 2 }))
    .with(BuildingEnum.Granary, () => ({ wood: 1 }))
    .with(BuildingEnum.Malthouse, () => ({ clay: 2 }))
    .with(BuildingEnum.Brewery, () => ({ stone: 2, straw: 1 }))
    .with(BuildingEnum.FalseLighthouse, () => ({ wood: 2, clay: 1 }))
    .with(BuildingEnum.SpinningMill, () => ({ wood: 1, straw: 1 }))
    .with(BuildingEnum.Cottage, () => ({ stone: 1, straw: 1 }))
    .with(BuildingEnum.Houseboat, () => ({ wood: 1 }))
    .with(BuildingEnum.SacredSite, () => ({ stone: 1 }))
    .with(BuildingEnum.DruidsHouse, () => ({ clay: 1, stone: 1 }))
    .with(BuildingEnum.Scriptorium, () => ({ wood: 1, straw: 1 }))
    .with(BuildingEnum.Alehouse, () => ({ wood: 1, stone: 1 }))
    .with(BuildingEnum.Locutory, () => ({ wood: 3, clay: 2 }))
    .with(BuildingEnum.Chapel, () => ({ clay: 3, stone: 3 }))
    .with(BuildingEnum.Portico, () => ({ clay: 2 }))
    .with(BuildingEnum.GrandManor, () => ({ penny: 20 }))
    .with(BuildingEnum.ForestHut, () => ({ clay: 1, straw: 1 }))
    .with(BuildingEnum.Refectory, () => ({ wood: 1, clay: 2 }))
    .with(BuildingEnum.CoalHarbor, () => ({ clay: 1, stone: 2 }))
    .with(BuildingEnum.FilialChurch, () => ({ wood: 3, clay: 4 }))
    .with(BuildingEnum.Cooperage, () => ({ clay: 3, straw: 1 }))
    .with(BuildingEnum.RoundTower, () => ({ stone: 4 }))
    .with(BuildingEnum.Camera, () => ({ clay: 2 }))
    .with(BuildingEnum.Bulwark, () => ({ wood: 2, clay: 4 }))
    .with(BuildingEnum.FestivalGround, () => ({ penny: 10 }))
    .with(BuildingEnum.Guesthouse, () => ({ wood: 3, straw: 1 }))
    .otherwise(() => ({}))

const SETTLEMENTS = Object.values(SettlementEnum)

export const isSettlement = (building?: ErectionEnum): boolean =>
  SETTLEMENTS.includes(building as unknown as SettlementEnum)

export const isCloisterBuilding = (building?: ErectionEnum): boolean => {
  if (building === undefined) return false
  return (
    [
      BuildingEnum.CloisterOfficeR,
      BuildingEnum.CloisterOfficeG,
      BuildingEnum.CloisterOfficeB,
      BuildingEnum.CloisterOfficeW,
      BuildingEnum.CloisterCourtyard,
      BuildingEnum.CloisterGarden,
      BuildingEnum.Priory,
      BuildingEnum.CloisterLibrary,
      BuildingEnum.CloisterWorkshop,
      BuildingEnum.CloisterChapterHouse,
      BuildingEnum.CloisterChurch,
      BuildingEnum.Bathhouse,
      BuildingEnum.Calefactory,
      BuildingEnum.Dormitory,
      BuildingEnum.HouseOfTheBrotherhood,
      BuildingEnum.Sacristy,
      BuildingEnum.Hospice,
      BuildingEnum.Camera,
      BuildingEnum.FilialChurch,
      BuildingEnum.Refectory,
      BuildingEnum.Portico,
      BuildingEnum.Chapel,
      BuildingEnum.Locutory,
      BuildingEnum.Scriptorium,
      BuildingEnum.Granary,
    ] as ErectionEnum[]
  ).includes(building)
}

export const roundBuildings = (config: GameCommandConfigParams, round: SettlementRound): BuildingEnum[] =>
  match<[GameCommandConfigParams, SettlementRound], BuildingEnum[]>([config, round])
    .with([{ country: 'france', players: 4 }, SettlementRound.S], () => [
      BuildingEnum.Priory,
      BuildingEnum.CloisterCourtyard,
      BuildingEnum.GrainStorage,
      BuildingEnum.Windmill,
      BuildingEnum.Bakery,
      BuildingEnum.FuelMerchant,
      BuildingEnum.PeatCoalKiln,
      BuildingEnum.Market,
      BuildingEnum.CloisterGarden,
      BuildingEnum.Carpentry,
      BuildingEnum.HarborPromenade,
      BuildingEnum.StoneMerchant,
      BuildingEnum.BuildersMarket,
    ])
    .with([{ country: 'france', players: 3 }, SettlementRound.S], () => [
      BuildingEnum.Priory,
      BuildingEnum.CloisterCourtyard,
      BuildingEnum.Windmill,
      BuildingEnum.Bakery,
      BuildingEnum.FuelMerchant,
      BuildingEnum.PeatCoalKiln,
      BuildingEnum.Market,
      BuildingEnum.CloisterGarden,
      BuildingEnum.HarborPromenade,
      BuildingEnum.StoneMerchant,
    ])
    .with([{ country: 'france', players: 2 }, SettlementRound.S], () => [
      BuildingEnum.CloisterCourtyard,
      BuildingEnum.Windmill,
      BuildingEnum.Bakery,
      BuildingEnum.PeatCoalKiln,
      BuildingEnum.Market,
      BuildingEnum.HarborPromenade,
      BuildingEnum.StoneMerchant,
    ])
    .with([{ country: 'france', players: 1 }, SettlementRound.S], () => [
      BuildingEnum.Priory,
      BuildingEnum.CloisterCourtyard,
      BuildingEnum.GrainStorage,
      BuildingEnum.Windmill,
      BuildingEnum.Bakery,
      BuildingEnum.FuelMerchant,
      BuildingEnum.PeatCoalKiln,
      BuildingEnum.Market,
      BuildingEnum.CloisterGarden,
      BuildingEnum.HarborPromenade,
      BuildingEnum.StoneMerchant,
      // BuildingEnum.BuildersMarket, // this automatically gets spawned on neutral player
    ])
    .with([{ country: 'ireland', players: 4 }, SettlementRound.S], () => [
      BuildingEnum.Priory,
      BuildingEnum.CloisterCourtyard,
      BuildingEnum.Granary,
      BuildingEnum.Malthouse,
      BuildingEnum.Brewery,
      BuildingEnum.FuelMerchant,
      BuildingEnum.PeatCoalKiln,
      BuildingEnum.FalseLighthouse,
      BuildingEnum.SpinningMill,
      BuildingEnum.Cottage,
      BuildingEnum.Houseboat,
      BuildingEnum.StoneMerchant,
      BuildingEnum.BuildersMarket,
    ])
    .with([{ country: 'ireland', players: 3 }, SettlementRound.S], () => [
      BuildingEnum.Priory,
      BuildingEnum.CloisterCourtyard,
      BuildingEnum.Malthouse,
      BuildingEnum.Brewery,
      BuildingEnum.FuelMerchant,
      BuildingEnum.PeatCoalKiln,
      BuildingEnum.FalseLighthouse,
      BuildingEnum.SpinningMill,
      BuildingEnum.Houseboat,
      BuildingEnum.StoneMerchant,
    ])
    .with([{ country: 'ireland', players: 2 }, SettlementRound.S], () => [
      BuildingEnum.CloisterCourtyard,
      BuildingEnum.Malthouse,
      BuildingEnum.Brewery,
      BuildingEnum.PeatCoalKiln,
      BuildingEnum.FalseLighthouse,
      BuildingEnum.Houseboat,
      BuildingEnum.StoneMerchant,
    ])
    .with([{ country: 'ireland', players: 1 }, SettlementRound.S], () => [
      BuildingEnum.Priory,
      BuildingEnum.CloisterCourtyard,
      BuildingEnum.Granary,
      BuildingEnum.Malthouse,
      BuildingEnum.Brewery,
      BuildingEnum.FuelMerchant,
      BuildingEnum.PeatCoalKiln,
      BuildingEnum.FalseLighthouse,
      BuildingEnum.SpinningMill,
      BuildingEnum.Cottage,
      BuildingEnum.Houseboat,
      BuildingEnum.StoneMerchant,
      // BuildingEnum.BuildersMarket, // this gets automatically spawned on neutral player
    ])
    .with([{ country: 'france', players: 4 }, SettlementRound.A], () => [
      BuildingEnum.GrapevineA,
      BuildingEnum.FinancedEstate,
      BuildingEnum.CloisterChapterHouse,
      BuildingEnum.CloisterLibrary,
      BuildingEnum.CloisterWorkshop,
      BuildingEnum.Slaughterhouse,
    ])
    .with([{ country: 'france', players: 3 }, SettlementRound.A], () => [
      BuildingEnum.GrapevineA,
      BuildingEnum.CloisterChapterHouse,
      BuildingEnum.CloisterLibrary,
      BuildingEnum.CloisterWorkshop,
      BuildingEnum.Slaughterhouse,
    ])
    .with([{ country: 'france', players: 2 }, SettlementRound.A], () => [
      BuildingEnum.GrapevineA,
      BuildingEnum.CloisterLibrary,
      BuildingEnum.CloisterWorkshop,
      BuildingEnum.Slaughterhouse,
    ])
    .with([{ country: 'france', players: 1 }, SettlementRound.A], () => [
      BuildingEnum.FinancedEstate,
      BuildingEnum.CloisterChapterHouse,
      BuildingEnum.CloisterLibrary,
      BuildingEnum.CloisterWorkshop,
      BuildingEnum.Slaughterhouse,
    ])
    .with([{ country: 'ireland', players: 4 }, SettlementRound.A], () => [
      BuildingEnum.SacredSite,
      BuildingEnum.DruidsHouse,
      BuildingEnum.CloisterChapterHouse,
      BuildingEnum.Scriptorium,
      BuildingEnum.CloisterWorkshop,
      BuildingEnum.Slaughterhouse,
    ])
    .with([{ country: 'ireland', players: 3 }, SettlementRound.A], () => [
      BuildingEnum.SacredSite,
      BuildingEnum.CloisterChapterHouse,
      BuildingEnum.Scriptorium,
      BuildingEnum.CloisterWorkshop,
      BuildingEnum.Slaughterhouse,
    ])
    .with([{ country: 'ireland', players: 2 }, SettlementRound.A], () => [
      BuildingEnum.SacredSite,
      BuildingEnum.Scriptorium,
      BuildingEnum.CloisterWorkshop,
      BuildingEnum.Slaughterhouse,
    ])
    .with([{ country: 'ireland', players: 1 }, SettlementRound.A], () => [
      BuildingEnum.SacredSite,
      BuildingEnum.DruidsHouse,
      BuildingEnum.CloisterChapterHouse,
      BuildingEnum.Scriptorium,
      BuildingEnum.CloisterWorkshop,
      BuildingEnum.Slaughterhouse,
    ])
    .with([{ country: 'france', players: 4 }, SettlementRound.B], () => [
      BuildingEnum.Inn,
      BuildingEnum.Winery,
      BuildingEnum.QuarryA,
      BuildingEnum.Bathhouse,
      BuildingEnum.CloisterChurch,
      BuildingEnum.ChamberOfWonders,
      BuildingEnum.Shipyard,
    ])
    .with([{ country: 'france', players: 3 }, SettlementRound.B], () => [
      BuildingEnum.Inn,
      BuildingEnum.Winery,
      BuildingEnum.QuarryA,
      BuildingEnum.CloisterChurch,
      BuildingEnum.Shipyard,
    ])
    .with([{ country: 'france', players: 2 }, SettlementRound.B], () => [
      BuildingEnum.Winery,
      BuildingEnum.QuarryA,
      BuildingEnum.CloisterChurch,
      BuildingEnum.Shipyard,
    ])
    .with([{ country: 'france', players: 1 }, SettlementRound.B], () => [
      BuildingEnum.Inn,
      BuildingEnum.Winery,
      BuildingEnum.QuarryA,
      BuildingEnum.Bathhouse,
      BuildingEnum.CloisterChurch,
      BuildingEnum.ChamberOfWonders,
      BuildingEnum.Shipyard,
    ])
    .with([{ country: 'ireland', players: 4 }, SettlementRound.B], () => [
      BuildingEnum.Alehouse,
      BuildingEnum.WhiskeyDistillery,
      BuildingEnum.QuarryA,
      BuildingEnum.Locutory,
      BuildingEnum.Chapel,
      BuildingEnum.Portico,
      BuildingEnum.Shipyard,
    ])
    .with([{ country: 'ireland', players: 3 }, SettlementRound.B], () => [
      BuildingEnum.Alehouse,
      BuildingEnum.WhiskeyDistillery,
      BuildingEnum.QuarryA,
      BuildingEnum.Chapel,
      BuildingEnum.Shipyard,
    ])
    .with([{ country: 'ireland', players: 2 }, SettlementRound.B], () => [
      BuildingEnum.WhiskeyDistillery,
      BuildingEnum.QuarryA,
      BuildingEnum.Chapel,
      BuildingEnum.Shipyard,
    ])
    .with([{ country: 'ireland', players: 1 }, SettlementRound.B], () => [
      BuildingEnum.Alehouse,
      BuildingEnum.WhiskeyDistillery,
      BuildingEnum.QuarryA,
      BuildingEnum.Locutory,
      BuildingEnum.Chapel,
      BuildingEnum.Portico,
      BuildingEnum.Shipyard,
    ])
    .with([{ country: 'france', players: 4 }, SettlementRound.C], () => [
      BuildingEnum.Palace,
      BuildingEnum.Castle,
      BuildingEnum.QuarryB,
      BuildingEnum.TownEstate,
      BuildingEnum.GrapevineB,
      BuildingEnum.Calefactory,
      BuildingEnum.ShippingCompany,
    ])
    .with([{ country: 'france', players: 3 }, SettlementRound.C], () => [
      BuildingEnum.Palace,
      BuildingEnum.Castle,
      BuildingEnum.QuarryB,
      BuildingEnum.TownEstate,
      BuildingEnum.Calefactory,
      BuildingEnum.ShippingCompany,
    ])
    .with([{ country: 'france', players: 2 }, SettlementRound.C], () => [
      BuildingEnum.Palace,
      BuildingEnum.Castle,
      BuildingEnum.TownEstate,
      BuildingEnum.ShippingCompany,
    ])
    .with([{ country: 'france', players: 1 }, SettlementRound.C], () => [
      BuildingEnum.Palace,
      BuildingEnum.Castle,
      BuildingEnum.TownEstate,
      BuildingEnum.Calefactory,
      BuildingEnum.ShippingCompany,
    ])
    .with([{ country: 'ireland', players: 4 }, SettlementRound.C], () => [
      BuildingEnum.GrandManor,
      BuildingEnum.Castle,
      BuildingEnum.ForestHut,
      BuildingEnum.Refectory,
      BuildingEnum.CoalHarbor,
      BuildingEnum.Cooperage,
      BuildingEnum.FilialChurch,
    ])
    .with([{ country: 'ireland', players: 3 }, SettlementRound.C], () => [
      BuildingEnum.GrandManor,
      BuildingEnum.Castle,
      BuildingEnum.ForestHut,
      BuildingEnum.Refectory,
      BuildingEnum.Cooperage,
      BuildingEnum.FilialChurch,
    ])
    .with([{ country: 'ireland', players: 2 }, SettlementRound.C], () => [
      BuildingEnum.GrandManor,
      BuildingEnum.Castle,
      BuildingEnum.Refectory,
      BuildingEnum.Cooperage,
    ])
    .with([{ country: 'ireland', players: 1 }, SettlementRound.C], () => [
      BuildingEnum.GrandManor,
      BuildingEnum.Castle,
      BuildingEnum.ForestHut,
      BuildingEnum.Refectory,
      BuildingEnum.CoalHarbor,
      BuildingEnum.Cooperage,
      BuildingEnum.FilialChurch,
    ])
    .with([{ country: 'france', players: 4 }, SettlementRound.D], () => [
      BuildingEnum.Sacristy,
      BuildingEnum.ForgersWorkshop,
      BuildingEnum.PilgrimageSite,
      BuildingEnum.Dormitory,
      BuildingEnum.PrintingOffice,
      BuildingEnum.Estate,
      BuildingEnum.Hospice,
      BuildingEnum.HouseOfTheBrotherhood,
    ])
    .with([{ country: 'france', players: 3 }, SettlementRound.D], () => [
      BuildingEnum.Sacristy,
      BuildingEnum.ForgersWorkshop,
      BuildingEnum.PilgrimageSite,
      BuildingEnum.Dormitory,
      BuildingEnum.PrintingOffice,
      BuildingEnum.Hospice,
      BuildingEnum.HouseOfTheBrotherhood,
    ])
    .with([{ country: 'france', players: 2 }, SettlementRound.D], () => [
      BuildingEnum.Sacristy,
      BuildingEnum.ForgersWorkshop,
      BuildingEnum.Dormitory,
      BuildingEnum.PrintingOffice,
      BuildingEnum.HouseOfTheBrotherhood,
    ])
    .with([{ country: 'france', players: 1 }, SettlementRound.D], () => [
      BuildingEnum.Sacristy,
      BuildingEnum.ForgersWorkshop,
      BuildingEnum.PilgrimageSite,
      BuildingEnum.Dormitory,
      BuildingEnum.PrintingOffice,
      BuildingEnum.Estate,
      BuildingEnum.Hospice,
      BuildingEnum.HouseOfTheBrotherhood,
    ])
    .with([{ country: 'ireland', players: 4 }, SettlementRound.D], () => [
      BuildingEnum.Sacristy,
      BuildingEnum.RoundTower,
      BuildingEnum.Camera,
      BuildingEnum.Bulwark,
      BuildingEnum.FestivalGround,
      BuildingEnum.Estate,
      BuildingEnum.Guesthouse,
      BuildingEnum.HouseOfTheBrotherhood,
    ])
    .with([{ country: 'ireland', players: 3 }, SettlementRound.D], () => [
      BuildingEnum.Sacristy,
      BuildingEnum.RoundTower,
      BuildingEnum.Camera,
      BuildingEnum.Bulwark,
      BuildingEnum.FestivalGround,
      BuildingEnum.Guesthouse,
      BuildingEnum.HouseOfTheBrotherhood,
    ])
    .with([{ country: 'ireland', players: 2 }, SettlementRound.D], () => [
      BuildingEnum.Sacristy,
      BuildingEnum.RoundTower,
      BuildingEnum.Bulwark,
      BuildingEnum.FestivalGround,
      BuildingEnum.HouseOfTheBrotherhood,
    ])
    .with([{ country: 'ireland', players: 1 }, SettlementRound.D], () => [
      BuildingEnum.Sacristy,
      BuildingEnum.RoundTower,
      BuildingEnum.Camera,
      BuildingEnum.Bulwark,
      BuildingEnum.FestivalGround,
      BuildingEnum.Estate,
      BuildingEnum.Guesthouse,
      BuildingEnum.HouseOfTheBrotherhood,
    ])
    .otherwise(() => [])

export const introduceBuildings: StateReducer = (state) => {
  if (state === undefined) return undefined
  return {
    ...state,
    buildings: union(state.buildings, roundBuildings(state.config, state.frame.settlementRound)),
  }
}

export const removeBuildingFromUnbuilt =
  (building: BuildingEnum): StateReducer =>
  (state) => {
    if (state === undefined) return undefined
    if (!state.buildings.includes(building)) return undefined
    return (
      state && {
        ...state,
        buildings: filter((b) => b !== building, state?.buildings),
      }
    )
  }

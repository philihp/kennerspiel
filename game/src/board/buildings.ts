import { match, P } from 'ts-pattern'
import { BuildingEnum, GameCommandConfigParams, SettlementRound } from '../types'

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
    .with([{ country: 'france' }, SettlementRound.S], () => [
      BuildingEnum.CloisterCourtyard,
      BuildingEnum.Windmill,
      BuildingEnum.Bakery,
      BuildingEnum.PeatCoalKiln,
      BuildingEnum.Market,
      BuildingEnum.HarborPromenade,
      BuildingEnum.StoneMerchant,
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
    .with([{ country: 'ireland' }, SettlementRound.S], () => [
      BuildingEnum.CloisterCourtyard,
      BuildingEnum.Malthouse,
      BuildingEnum.Brewery,
      BuildingEnum.PeatCoalKiln,
      BuildingEnum.FalseLighthouse,
      BuildingEnum.Houseboat,
      BuildingEnum.StoneMerchant,
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
    .with([{ country: 'france' }, SettlementRound.A], () => [
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
    .with([{ country: 'ireland' }, SettlementRound.A], () => [
      BuildingEnum.SacredSite,
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
    .with([{ country: 'france' }, SettlementRound.B], () => [
      BuildingEnum.Winery,
      BuildingEnum.QuarryA,
      BuildingEnum.CloisterChurch,
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
    .with([{ country: 'ireland' }, SettlementRound.B], () => [
      BuildingEnum.WhiskeyDistillery,
      BuildingEnum.QuarryA,
      BuildingEnum.Chapel,
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
    .with([{ country: 'france' }, SettlementRound.C], () => [
      BuildingEnum.Palace,
      BuildingEnum.Castle,
      BuildingEnum.TownEstate,
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
    .with([{ country: 'ireland' }, SettlementRound.C], () => [
      BuildingEnum.GrandManor,
      BuildingEnum.Castle,
      BuildingEnum.Refectory,
      BuildingEnum.Cooperage,
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
    .with([{ country: 'france' }, SettlementRound.D], () => [
      BuildingEnum.Sacristy,
      BuildingEnum.ForgersWorkshop,
      BuildingEnum.Dormitory,
      BuildingEnum.PrintingOffice,
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
    .with([{ country: 'ireland' }, SettlementRound.D], () => [
      BuildingEnum.Sacristy,
      BuildingEnum.RoundTower,
      BuildingEnum.Bulwark,
      BuildingEnum.FestivalGround,
      BuildingEnum.HouseOfTheBrotherhood,
    ])
    .otherwise(() => [])

import { BuildingEnum, ErectionEnum } from 'hathora-et-labora-game/dist/types'
import { Farmyard } from './farmyard'
import { match } from 'ts-pattern'
import { createElement, ReactNode } from 'react'
import { PeatCoalKiln } from './peatCoalKiln'
import { FuelMerchant } from './fuelMerchant'
import { PlaceholderForUse } from './placeholderForUse'
import { BuildersMarket } from './buildersMarket'
import { GrainStorage } from './grainStorage'
import { Windmill } from './windmill'

type ErectionModalParams = {
  id: ErectionEnum
}

export const ErectionModal: (params: ErectionModalParams) => ReactNode = ({ id }) => {
  const building = id as BuildingEnum
  if (false === Object.values(BuildingEnum).includes(building)) return
  return createElement(
    match(building)
      .with(BuildingEnum.Moor, () => PlaceholderForUse)
      .with(BuildingEnum.Forest, () => PlaceholderForUse)
      .with(BuildingEnum.ClayMoundR, () => PlaceholderForUse)
      .with(BuildingEnum.ClayMoundG, () => PlaceholderForUse)
      .with(BuildingEnum.ClayMoundB, () => PlaceholderForUse)
      .with(BuildingEnum.ClayMoundW, () => PlaceholderForUse)
      .with(BuildingEnum.FarmYardR, () => Farmyard)
      .with(BuildingEnum.FarmYardG, () => Farmyard)
      .with(BuildingEnum.FarmYardB, () => Farmyard)
      .with(BuildingEnum.FarmYardW, () => Farmyard)
      .with(BuildingEnum.CloisterOfficeR, () => PlaceholderForUse)
      .with(BuildingEnum.CloisterOfficeG, () => PlaceholderForUse)
      .with(BuildingEnum.CloisterOfficeB, () => PlaceholderForUse)
      .with(BuildingEnum.CloisterOfficeW, () => PlaceholderForUse)
      .with(BuildingEnum.Priory, () => PlaceholderForUse)
      .with(BuildingEnum.CloisterCourtyard, () => PlaceholderForUse)
      .with(BuildingEnum.GrainStorage, () => GrainStorage)
      .with(BuildingEnum.Granary, () => PlaceholderForUse)
      .with(BuildingEnum.Windmill, () => Windmill)
      .with(BuildingEnum.Malthouse, () => PlaceholderForUse)
      .with(BuildingEnum.Bakery, () => PlaceholderForUse)
      .with(BuildingEnum.Brewery, () => PlaceholderForUse)
      .with(BuildingEnum.FuelMerchant, () => FuelMerchant)
      .with(BuildingEnum.PeatCoalKiln, () => PeatCoalKiln)
      .with(BuildingEnum.Market, () => PlaceholderForUse)
      .with(BuildingEnum.FalseLighthouse, () => PlaceholderForUse)
      .with(BuildingEnum.CloisterGarden, () => PlaceholderForUse)
      .with(BuildingEnum.SpinningMill, () => PlaceholderForUse)
      .with(BuildingEnum.Carpentry, () => PlaceholderForUse)
      .with(BuildingEnum.Cottage, () => PlaceholderForUse)
      .with(BuildingEnum.HarborPromenade, () => PlaceholderForUse)
      .with(BuildingEnum.Houseboat, () => PlaceholderForUse)
      .with(BuildingEnum.StoneMerchant, () => PlaceholderForUse)
      .with(BuildingEnum.BuildersMarket, () => BuildersMarket)
      .with(BuildingEnum.GrapevineA, () => PlaceholderForUse)
      .with(BuildingEnum.SacredSite, () => PlaceholderForUse)
      .with(BuildingEnum.FinancedEstate, () => PlaceholderForUse)
      .with(BuildingEnum.DruidsHouse, () => PlaceholderForUse)
      .with(BuildingEnum.CloisterChapterHouse, () => PlaceholderForUse)
      .with(BuildingEnum.CloisterLibrary, () => PlaceholderForUse)
      .with(BuildingEnum.Scriptorium, () => PlaceholderForUse)
      .with(BuildingEnum.CloisterWorkshop, () => PlaceholderForUse)
      .with(BuildingEnum.Slaughterhouse, () => PlaceholderForUse)
      .with(BuildingEnum.Inn, () => PlaceholderForUse)
      .with(BuildingEnum.Alehouse, () => PlaceholderForUse)
      .with(BuildingEnum.Winery, () => PlaceholderForUse)
      .with(BuildingEnum.WhiskeyDistillery, () => PlaceholderForUse)
      .with(BuildingEnum.QuarryA, () => PlaceholderForUse)
      .with(BuildingEnum.Bathhouse, () => PlaceholderForUse)
      .with(BuildingEnum.Locutory, () => PlaceholderForUse)
      .with(BuildingEnum.CloisterChurch, () => PlaceholderForUse)
      .with(BuildingEnum.Chapel, () => PlaceholderForUse)
      .with(BuildingEnum.ChamberOfWonders, () => PlaceholderForUse)
      .with(BuildingEnum.Portico, () => PlaceholderForUse)
      .with(BuildingEnum.Shipyard, () => PlaceholderForUse)
      .with(BuildingEnum.Palace, () => PlaceholderForUse)
      .with(BuildingEnum.GrandManor, () => PlaceholderForUse)
      .with(BuildingEnum.Castle, () => PlaceholderForUse)
      .with(BuildingEnum.QuarryB, () => PlaceholderForUse)
      .with(BuildingEnum.ForestHut, () => PlaceholderForUse)
      .with(BuildingEnum.TownEstate, () => PlaceholderForUse)
      .with(BuildingEnum.Refectory, () => PlaceholderForUse)
      .with(BuildingEnum.GrapevineB, () => PlaceholderForUse)
      .with(BuildingEnum.CoalHarbor, () => PlaceholderForUse)
      .with(BuildingEnum.Calefactory, () => PlaceholderForUse)
      .with(BuildingEnum.FilialChurch, () => PlaceholderForUse)
      .with(BuildingEnum.ShippingCompany, () => PlaceholderForUse)
      .with(BuildingEnum.Cooperage, () => PlaceholderForUse)
      .with(BuildingEnum.Sacristy, () => PlaceholderForUse)
      .with(BuildingEnum.ForgersWorkshop, () => PlaceholderForUse)
      .with(BuildingEnum.RoundTower, () => PlaceholderForUse)
      .with(BuildingEnum.PilgrimageSite, () => PlaceholderForUse)
      .with(BuildingEnum.Camera, () => PlaceholderForUse)
      .with(BuildingEnum.Dormitory, () => PlaceholderForUse)
      .with(BuildingEnum.Bulwark, () => PlaceholderForUse)
      .with(BuildingEnum.PrintingOffice, () => PlaceholderForUse)
      .with(BuildingEnum.FestivalGround, () => PlaceholderForUse)
      .with(BuildingEnum.Estate, () => PlaceholderForUse)
      .with(BuildingEnum.Hospice, () => PlaceholderForUse)
      .with(BuildingEnum.Guesthouse, () => PlaceholderForUse)
      .with(BuildingEnum.HouseOfTheBrotherhood, () => PlaceholderForUse)
      .exhaustive() // we want this to fail if someone adds new buildings
  )
}

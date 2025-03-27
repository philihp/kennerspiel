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
import { Bakery } from './bakery'
import { CloisterCourtyard } from './cloisterCourtyard'
import { Market } from './market'
import { StoneMerchant } from './stoneMerchant'
import { FinancedEstate } from './financedEstate'
import { Slaughterhouse } from './slaughterhouse'
import { CloisterWorkshop } from './cloisterWorkshop'
import { CloisterLibrary } from './cloisterLibrary'
import { Inn } from './inn'
import { Winery } from './winery'
import { CloisterChurch } from './cloisterChurch'
import { Bathhouse } from './bathhouse'
import { ChamberOfWonders } from './chamberOfWonders'
import { ShippingCompany } from './shippingCompany'
import { Shipyard } from './shipyard'
import { Quarry } from './quarry'
import { PilgrimageSite } from './pilgrimageSite'
import { ClayMound } from './clayMound'
import { CloisterOffice } from './cloisterOffice'
import { Grapevine } from './grapevine'
import { Sacristy } from './sacristy'
import { ForgersWorkshop } from './forgersWorkshop'
import { HouseOfTheBrotherhood } from './houseOfTheBrotherhood'
import { Palace } from './palace'
import { Dormitory } from './dormitory'
import { Estate } from './estate'
import { TownEstate } from './townEstate'

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
      .with(BuildingEnum.ClayMoundR, () => ClayMound)
      .with(BuildingEnum.ClayMoundG, () => ClayMound)
      .with(BuildingEnum.ClayMoundB, () => ClayMound)
      .with(BuildingEnum.ClayMoundW, () => ClayMound)
      .with(BuildingEnum.FarmYardR, () => Farmyard)
      .with(BuildingEnum.FarmYardG, () => Farmyard)
      .with(BuildingEnum.FarmYardB, () => Farmyard)
      .with(BuildingEnum.FarmYardW, () => Farmyard)
      .with(BuildingEnum.CloisterOfficeR, () => CloisterOffice)
      .with(BuildingEnum.CloisterOfficeG, () => CloisterOffice)
      .with(BuildingEnum.CloisterOfficeB, () => CloisterOffice)
      .with(BuildingEnum.CloisterOfficeW, () => CloisterOffice)
      .with(BuildingEnum.Priory, () => PlaceholderForUse)
      .with(BuildingEnum.CloisterCourtyard, () => CloisterCourtyard)
      .with(BuildingEnum.GrainStorage, () => GrainStorage)
      .with(BuildingEnum.Granary, () => PlaceholderForUse)
      .with(BuildingEnum.Windmill, () => Windmill)
      .with(BuildingEnum.Malthouse, () => PlaceholderForUse)
      .with(BuildingEnum.Bakery, () => Bakery)
      .with(BuildingEnum.Brewery, () => PlaceholderForUse)
      .with(BuildingEnum.FuelMerchant, () => FuelMerchant)
      .with(BuildingEnum.PeatCoalKiln, () => PeatCoalKiln)
      .with(BuildingEnum.Market, () => Market)
      .with(BuildingEnum.FalseLighthouse, () => PlaceholderForUse)
      .with(BuildingEnum.CloisterGarden, () => PlaceholderForUse)
      .with(BuildingEnum.SpinningMill, () => PlaceholderForUse)
      .with(BuildingEnum.Carpentry, () => PlaceholderForUse)
      .with(BuildingEnum.Cottage, () => PlaceholderForUse)
      .with(BuildingEnum.HarborPromenade, () => PlaceholderForUse)
      .with(BuildingEnum.Houseboat, () => PlaceholderForUse)
      .with(BuildingEnum.StoneMerchant, () => StoneMerchant)
      .with(BuildingEnum.BuildersMarket, () => BuildersMarket)
      .with(BuildingEnum.GrapevineA, () => Grapevine)
      .with(BuildingEnum.SacredSite, () => PlaceholderForUse)
      .with(BuildingEnum.FinancedEstate, () => FinancedEstate)
      .with(BuildingEnum.DruidsHouse, () => PlaceholderForUse)
      .with(BuildingEnum.CloisterChapterHouse, () => PlaceholderForUse)
      .with(BuildingEnum.CloisterLibrary, () => CloisterLibrary)
      .with(BuildingEnum.Scriptorium, () => PlaceholderForUse)
      .with(BuildingEnum.CloisterWorkshop, () => CloisterWorkshop)
      .with(BuildingEnum.Slaughterhouse, () => Slaughterhouse)
      .with(BuildingEnum.Inn, () => Inn)
      .with(BuildingEnum.Alehouse, () => PlaceholderForUse)
      .with(BuildingEnum.Winery, () => Winery)
      .with(BuildingEnum.WhiskeyDistillery, () => PlaceholderForUse)
      .with(BuildingEnum.QuarryA, () => Quarry)
      .with(BuildingEnum.Bathhouse, () => Bathhouse)
      .with(BuildingEnum.Locutory, () => PlaceholderForUse)
      .with(BuildingEnum.CloisterChurch, () => CloisterChurch)
      .with(BuildingEnum.Chapel, () => PlaceholderForUse)
      .with(BuildingEnum.ChamberOfWonders, () => ChamberOfWonders)
      .with(BuildingEnum.Portico, () => PlaceholderForUse)
      .with(BuildingEnum.Shipyard, () => Shipyard)
      .with(BuildingEnum.Palace, () => Palace)
      .with(BuildingEnum.GrandManor, () => PlaceholderForUse)
      .with(BuildingEnum.Castle, () => PlaceholderForUse)
      .with(BuildingEnum.QuarryB, () => Quarry)
      .with(BuildingEnum.ForestHut, () => PlaceholderForUse)
      .with(BuildingEnum.TownEstate, () => TownEstate)
      .with(BuildingEnum.Refectory, () => PlaceholderForUse)
      .with(BuildingEnum.GrapevineB, () => Grapevine)
      .with(BuildingEnum.CoalHarbor, () => PlaceholderForUse)
      .with(BuildingEnum.Calefactory, () => PlaceholderForUse)
      .with(BuildingEnum.FilialChurch, () => PlaceholderForUse)
      .with(BuildingEnum.ShippingCompany, () => ShippingCompany)
      .with(BuildingEnum.Cooperage, () => PlaceholderForUse)
      .with(BuildingEnum.Sacristy, () => Sacristy)
      .with(BuildingEnum.ForgersWorkshop, () => ForgersWorkshop)
      .with(BuildingEnum.RoundTower, () => PlaceholderForUse)
      .with(BuildingEnum.PilgrimageSite, () => PilgrimageSite)
      .with(BuildingEnum.Camera, () => PlaceholderForUse)
      .with(BuildingEnum.Dormitory, () => Dormitory)
      .with(BuildingEnum.Bulwark, () => PlaceholderForUse)
      .with(BuildingEnum.PrintingOffice, () => PlaceholderForUse)
      .with(BuildingEnum.FestivalGround, () => PlaceholderForUse)
      .with(BuildingEnum.Estate, () => Estate)
      .with(BuildingEnum.Hospice, () => PlaceholderForUse)
      .with(BuildingEnum.Guesthouse, () => PlaceholderForUse)
      .with(BuildingEnum.HouseOfTheBrotherhood, () => HouseOfTheBrotherhood)
      .exhaustive() // we want this to fail if someone adds new buildings
  )
}

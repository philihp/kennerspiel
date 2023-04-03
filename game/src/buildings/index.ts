import { always } from 'ramda'
import { BuildingEnum, GameStatePlaying } from '../types'
import { complete as completeClayMound } from './clayMound'

export { alehouse } from './alehouse'
export { bakery } from './bakery'
export { bathhouse } from './bathhouse'
export { brewery } from './brewery'
export { buildersMarket } from './buildersMarket'
export { bulwark } from './bulwark'
export { calefactory } from './calefactory'
export { camera } from './camera'
export { carpentry } from './carpentry'
export { castle } from './castle'
export { chamberOfWonders } from './chamberOfWonders'
export { chapel } from './chapel'
export { clayMound } from './clayMound'
export { cloisterChapterHouse } from './cloisterChapterHouse'
export { cloisterChurch } from './cloisterChurch'
export { cloisterCourtyard } from './cloisterCourtyard'
export { cloisterGarden } from './cloisterGarden'
export { cloisterLibrary } from './cloisterLibrary'
export { cloisterOffice } from './cloisterOffice'
export { cloisterWorkshop } from './cloisterWorkshop'
export { coalHarbor } from './coalHarbor'
export { cooperage } from './cooperage'
export { cottage } from './cottage'
export { dormitory } from './dormitory'
export { druidsHouse } from './druidsHouse'
export { estate } from './estate'
export { farmyard } from './farmyard'
export { falseLighthouse } from './falseLighthouse'
export { festivalGround } from './festivalGround'
export { filialChurch } from './filialChurch'
export { financedEstate } from './financedEstate'
export { forestHut } from './forestHut'
export { forgersWorkshop } from './forgersWorkshop'
export { fuelMerchant } from './fuelMerchant'
export { guesthouse } from './guesthouse'
export { grainStorage } from './grainStorage'
export { granary } from './granary'
export { grapevine } from './grapevine'
export { grandManor } from './grandManor'
export { harborPromenade } from './harborPromenade'
export { hospice } from './hospice'
export { houseboat } from './houseboat'
export { houseOfTheBrotherhood } from './houseOfTheBrotherhood'
export { inn } from './inn'
export { locutory } from './locutory'
export { market } from './market'
export { malthouse } from './malthouse'
export { palace } from './palace'
export { peatCoalKiln } from './peatCoalKiln'
export { pilgrimageSite } from './pilgrimageSite'
export { portico } from './portico'
export { printingOffice } from './printingOffice'
export { priory } from './priory'
export { quarry } from './quarry'
export { refectory } from './refectory'
export { roundTower } from './roundTower'
export { sacristy } from './sacristy'
export { sacredSite } from './sacredSite'
export { scriptorium } from './scriptorium'
export { shippingCompany } from './shippingCompany'
export { shipyard } from './shipyard'
export { slaughterhouse } from './slaughterhouse'
export { spinningMill } from './spinningMill'
export { stoneMerchant } from './stoneMerchant'
export { townEstate } from './townEstate'
export { whiskeyDistillery } from './whiskeyDistillery'
export { windmill } from './windmill'
export { winery } from './winery'

// could just have an array, but this will make sure every command is covered, and
// direct lookups are faster, and i could just directly import, too, i guess
export const complete: Record<BuildingEnum, (state: GameStatePlaying) => (partial: string[]) => string[]> = {
  [BuildingEnum.Peat]: always(always([])),
  [BuildingEnum.Forest]: always(always([])),
  [BuildingEnum.ClayMoundR]: completeClayMound,
  [BuildingEnum.ClayMoundG]: completeClayMound,
  [BuildingEnum.ClayMoundB]: completeClayMound,
  [BuildingEnum.ClayMoundW]: completeClayMound,
  [BuildingEnum.FarmYardR]: always(always([])),
  [BuildingEnum.FarmYardG]: always(always([])),
  [BuildingEnum.FarmYardB]: always(always([])),
  [BuildingEnum.FarmYardW]: always(always([])),
  [BuildingEnum.CloisterOfficeR]: always(always([])),
  [BuildingEnum.CloisterOfficeG]: always(always([])),
  [BuildingEnum.CloisterOfficeB]: always(always([])),
  [BuildingEnum.CloisterOfficeW]: always(always([])),
  [BuildingEnum.Priory]: always(always([])),
  [BuildingEnum.CloisterCourtyard]: always(always([])),
  [BuildingEnum.GrainStorage]: always(always([])),
  [BuildingEnum.Granary]: always(always([])),
  [BuildingEnum.Windmill]: always(always([])),
  [BuildingEnum.Malthouse]: always(always([])),
  [BuildingEnum.Bakery]: always(always([])),
  [BuildingEnum.Brewery]: always(always([])),
  [BuildingEnum.FuelMerchant]: always(always([])),
  [BuildingEnum.PeatCoalKiln]: always(always([])),
  [BuildingEnum.Market]: always(always([])),
  [BuildingEnum.FalseLighthouse]: always(always([])),
  [BuildingEnum.CloisterGarden]: always(always([])),
  [BuildingEnum.SpinningMill]: always(always([])),
  [BuildingEnum.Carpentry]: always(always([])),
  [BuildingEnum.Cottage]: always(always([])),
  [BuildingEnum.HarborPromenade]: always(always([])),
  [BuildingEnum.Houseboat]: always(always([])),
  [BuildingEnum.StoneMerchant]: always(always([])),
  [BuildingEnum.BuildersMarket]: always(always([])),
  [BuildingEnum.GrapevineA]: always(always([])),
  [BuildingEnum.SacredSite]: always(always([])),
  [BuildingEnum.FinancedEstate]: always(always([])),
  [BuildingEnum.DruidsHouse]: always(always([])),
  [BuildingEnum.CloisterChapterHouse]: always(always([])),
  [BuildingEnum.CloisterLibrary]: always(always([])),
  [BuildingEnum.Scriptorium]: always(always([])),
  [BuildingEnum.CloisterWorkshop]: always(always([])),
  [BuildingEnum.Slaughterhouse]: always(always([])),
  [BuildingEnum.Inn]: always(always([])),
  [BuildingEnum.Alehouse]: always(always([])),
  [BuildingEnum.Winery]: always(always([])),
  [BuildingEnum.WhiskeyDistillery]: always(always([])),
  [BuildingEnum.QuarryA]: always(always([])),
  [BuildingEnum.Bathhouse]: always(always([])),
  [BuildingEnum.Locutory]: always(always([])),
  [BuildingEnum.CloisterChurch]: always(always([])),
  [BuildingEnum.Chapel]: always(always([])),
  [BuildingEnum.ChamberOfWonders]: always(always([])),
  [BuildingEnum.Portico]: always(always([])),
  [BuildingEnum.Shipyard]: always(always([])),
  [BuildingEnum.Palace]: always(always([])),
  [BuildingEnum.GrandManor]: always(always([])),
  [BuildingEnum.Castle]: always(always([])),
  [BuildingEnum.QuarryB]: always(always([])),
  [BuildingEnum.ForestHut]: always(always([])),
  [BuildingEnum.TownEstate]: always(always([])),
  [BuildingEnum.Refectory]: always(always([])),
  [BuildingEnum.GrapevineB]: always(always([])),
  [BuildingEnum.CoalHarbor]: always(always([])),
  [BuildingEnum.Calefactory]: always(always([])),
  [BuildingEnum.FilialChurch]: always(always([])),
  [BuildingEnum.ShippingCompany]: always(always([])),
  [BuildingEnum.Cooperage]: always(always([])),
  [BuildingEnum.Sacristy]: always(always([])),
  [BuildingEnum.ForgersWorkshop]: always(always([])),
  [BuildingEnum.RoundTower]: always(always([])),
  [BuildingEnum.PilgrimageSite]: always(always([])),
  [BuildingEnum.Camera]: always(always([])),
  [BuildingEnum.Dormitory]: always(always([])),
  [BuildingEnum.Bulwark]: always(always([])),
  [BuildingEnum.PrintingOffice]: always(always([])),
  [BuildingEnum.FestivalGround]: always(always([])),
  [BuildingEnum.Estate]: always(always([])),
  [BuildingEnum.Hospice]: always(always([])),
  [BuildingEnum.Guesthouse]: always(always([])),
  [BuildingEnum.HouseOfTheBrotherhood]: always(always([])),
}

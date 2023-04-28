import { always } from 'ramda'
import { BuildingEnum, GameStatePlaying } from '../types'
import { complete as completeAlehouse } from './alehouse'
import { complete as completeBakery } from './bakery'
import { complete as completeBathhouse } from './bathhouse'
import { complete as completeBrewery } from './brewery'
import { complete as completeBuildersMarket } from './buildersMarket'
import { complete as completeBulwark } from './bulwark'
import { complete as completeCalefactory } from './calefactory'
import { complete as completeCamera } from './camera'
import { complete as completeCarpentry } from './carpentry'
import { complete as completeCastle } from './castle'
import { complete as completeChamberOfWonders } from './chamberOfWonders'
import { complete as completeChapel } from './chapel'
import { complete as completeClayMound } from './clayMound'
import { complete as completeCloisterChapterHouse } from './cloisterChapterHouse'
import { complete as completeCloisterChurch } from './cloisterChurch'
import { complete as completeCloisterCourtyard } from './cloisterCourtyard'
import { complete as completeCloisterGarden } from './cloisterGarden'
import { complete as completeCloisterLibrary } from './cloisterLibrary'
import { complete as completeCloisterOffice } from './cloisterOffice'
import { complete as completeCloisterWorkshop } from './cloisterWorkshop'
import { complete as completeCoalHarbor } from './coalHarbor'
import { complete as completeCooperage } from './cooperage'
import { complete as completeCottage } from './cottage'
import { complete as completeDormitory } from './dormitory'
import { complete as completeDruidsHouse } from './druidsHouse'
import { complete as completeEstate } from './estate'
import { complete as completeFarmyard } from './farmyard'
import { complete as completeFalseLighthouse } from './falseLighthouse'
import { complete as completeFestivalGround } from './festivalGround'
import { complete as completeFilialChurch } from './filialChurch'
import { complete as completeFinancedEstate } from './financedEstate'
import { complete as completeForestHut } from './forestHut'
import { complete as completeForgersWorkshop } from './forgersWorkshop'
import { complete as completeFuelMerchant } from './fuelMerchant'
import { complete as completeGuesthouse } from './guesthouse'
import { complete as completeGrainStorage } from './grainStorage'
import { complete as completeGranary } from './granary'
import { complete as completeGrapevine } from './grapevine'
import { complete as completeGrandManor } from './grandManor'
import { complete as completeHarborPromenade } from './harborPromenade'
import { complete as completeHospice } from './hospice'
import { complete as completeHouseboat } from './houseboat'
import { complete as completeHouseOfTheBrotherhood } from './houseOfTheBrotherhood'
import { complete as completeInn } from './inn'
import { complete as completeLocutory } from './locutory'
import { complete as completeMarket } from './market'
import { complete as completeMalthouse } from './malthouse'
import { complete as completePalace } from './palace'
import { complete as completePeatCoalKiln } from './peatCoalKiln'
import { complete as completePilgrimageSite } from './pilgrimageSite'
import { complete as completePortico } from './portico'
import { complete as completePrintingOffice } from './printingOffice'
import { complete as completePriory } from './priory'
import { complete as completeQuarry } from './quarry'
import { complete as completeRefectory } from './refectory'
import { complete as completeRoundTower } from './roundTower'
import { complete as completeSacristy } from './sacristy'
import { complete as completeSacredSite } from './sacredSite'
import { complete as completeScriptorium } from './scriptorium'
import { complete as completeShippingCompany } from './shippingCompany'
import { complete as completeShipyard } from './shipyard'
import { complete as completeSlaughterhouse } from './slaughterhouse'
import { complete as completeSpinningMill } from './spinningMill'
import { complete as completeStoneMerchant } from './stoneMerchant'
import { complete as completeTownEstate } from './townEstate'
import { complete as completeWhiskeyDistillery } from './whiskeyDistillery'
import { complete as completeWindmill } from './windmill'
import { complete as completeWinery } from './winery'

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
export const complete: Record<BuildingEnum, (partial: string[]) => (state: GameStatePlaying) => string[]> = {
  [BuildingEnum.Peat]: always(always([])),
  [BuildingEnum.Forest]: always(always([])),
  [BuildingEnum.ClayMoundR]: completeClayMound,
  [BuildingEnum.ClayMoundG]: completeClayMound,
  [BuildingEnum.ClayMoundB]: completeClayMound,
  [BuildingEnum.ClayMoundW]: completeClayMound,
  [BuildingEnum.FarmYardR]: completeFarmyard,
  [BuildingEnum.FarmYardG]: completeFarmyard,
  [BuildingEnum.FarmYardB]: completeFarmyard,
  [BuildingEnum.FarmYardW]: completeFarmyard,
  [BuildingEnum.CloisterOfficeR]: completeCloisterOffice,
  [BuildingEnum.CloisterOfficeG]: completeCloisterOffice,
  [BuildingEnum.CloisterOfficeB]: completeCloisterOffice,
  [BuildingEnum.CloisterOfficeW]: completeCloisterOffice,
  [BuildingEnum.Priory]: completePriory,
  [BuildingEnum.CloisterCourtyard]: completeCloisterCourtyard,
  [BuildingEnum.GrainStorage]: completeGrainStorage,
  [BuildingEnum.Granary]: completeGranary,
  [BuildingEnum.Windmill]: completeWindmill,
  [BuildingEnum.Malthouse]: completeMalthouse,
  [BuildingEnum.Bakery]: completeBakery,
  [BuildingEnum.Brewery]: completeBrewery,
  [BuildingEnum.FuelMerchant]: completeFuelMerchant,
  [BuildingEnum.PeatCoalKiln]: completePeatCoalKiln,
  [BuildingEnum.Market]: completeMarket,
  [BuildingEnum.FalseLighthouse]: completeFalseLighthouse,
  [BuildingEnum.CloisterGarden]: completeCloisterGarden,
  [BuildingEnum.SpinningMill]: completeSpinningMill,
  [BuildingEnum.Carpentry]: completeCarpentry,
  [BuildingEnum.Cottage]: completeCottage,
  [BuildingEnum.HarborPromenade]: completeHarborPromenade,
  [BuildingEnum.Houseboat]: completeHouseboat,
  [BuildingEnum.StoneMerchant]: completeStoneMerchant,
  [BuildingEnum.BuildersMarket]: completeBuildersMarket,
  [BuildingEnum.GrapevineA]: completeGrapevine,
  [BuildingEnum.SacredSite]: completeSacredSite,
  [BuildingEnum.FinancedEstate]: completeFinancedEstate,
  [BuildingEnum.DruidsHouse]: completeDruidsHouse,
  [BuildingEnum.CloisterChapterHouse]: completeCloisterChapterHouse,
  [BuildingEnum.CloisterLibrary]: completeCloisterLibrary,
  [BuildingEnum.Scriptorium]: completeScriptorium,
  [BuildingEnum.CloisterWorkshop]: completeCloisterWorkshop,
  [BuildingEnum.Slaughterhouse]: completeSlaughterhouse,
  [BuildingEnum.Inn]: completeInn,
  [BuildingEnum.Alehouse]: completeAlehouse,
  [BuildingEnum.Winery]: completeWinery,
  [BuildingEnum.WhiskeyDistillery]: completeWhiskeyDistillery,
  [BuildingEnum.QuarryA]: completeQuarry,
  [BuildingEnum.Bathhouse]: completeBathhouse,
  [BuildingEnum.Locutory]: completeLocutory,
  [BuildingEnum.CloisterChurch]: completeCloisterChurch,
  [BuildingEnum.Chapel]: completeChapel,
  [BuildingEnum.ChamberOfWonders]: completeChamberOfWonders,
  [BuildingEnum.Portico]: completePortico,
  [BuildingEnum.Shipyard]: completeShipyard,
  [BuildingEnum.Palace]: completePalace,
  [BuildingEnum.GrandManor]: completeGrandManor,
  [BuildingEnum.Castle]: completeCastle,
  [BuildingEnum.QuarryB]: completeQuarry,
  [BuildingEnum.ForestHut]: completeForestHut,
  [BuildingEnum.TownEstate]: completeTownEstate,
  [BuildingEnum.Refectory]: completeRefectory,
  [BuildingEnum.GrapevineB]: completeGrapevine,
  [BuildingEnum.CoalHarbor]: completeCoalHarbor,
  [BuildingEnum.Calefactory]: completeCalefactory,
  [BuildingEnum.FilialChurch]: completeFilialChurch,
  [BuildingEnum.ShippingCompany]: completeShippingCompany,
  [BuildingEnum.Cooperage]: completeCooperage,
  [BuildingEnum.Sacristy]: completeSacristy,
  [BuildingEnum.ForgersWorkshop]: completeForgersWorkshop,
  [BuildingEnum.RoundTower]: completeRoundTower,
  [BuildingEnum.PilgrimageSite]: completePilgrimageSite,
  [BuildingEnum.Camera]: completeCamera,
  [BuildingEnum.Dormitory]: completeDormitory,
  [BuildingEnum.Bulwark]: completeBulwark,
  [BuildingEnum.PrintingOffice]: completePrintingOffice,
  [BuildingEnum.FestivalGround]: completeFestivalGround,
  [BuildingEnum.Estate]: completeEstate,
  [BuildingEnum.Hospice]: completeHospice,
  [BuildingEnum.Guesthouse]: completeGuesthouse,
  [BuildingEnum.HouseOfTheBrotherhood]: completeHouseOfTheBrotherhood,
}

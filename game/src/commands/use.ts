import { pipe } from 'ramda'
import { match, P } from 'ts-pattern'
import { oncePerFrame, withFrame } from '../board/frame'
import { moveClergyInBonusRoundTo, moveClergyToOwnBuilding } from '../board/landscape'
import { bakery } from '../buildings/bakery'
import { bathhouse } from '../buildings/bathhouse'
import { buildersMarket } from '../buildings/buildersMarket'
import { calefactory } from '../buildings/calefactory'
import { carpentry } from '../buildings/carpentry'
import { castle } from '../buildings/castle'
import { chamberOfWonders } from '../buildings/chamberOfWonders'
import { clayMound } from '../buildings/clayMound'
import { cloisterChapterHouse } from '../buildings/cloisterChapterHouse'
import { cloisterChurch } from '../buildings/cloisterChurch'
import { cloisterCourtyard } from '../buildings/cloisterCourtyard'
import { cloisterGarden } from '../buildings/cloisterGarden'
import { cloisterLibrary } from '../buildings/cloisterLibrary'
import { cloisterOffice } from '../buildings/cloisterOffice'
import { cloisterWorkshop } from '../buildings/cloisterWorkshop'
import { dormitory } from '../buildings/dormitory'
import { estate } from '../buildings/estate'
import { farmyard } from '../buildings/farmyard'
import { financedEstate } from '../buildings/financedEstate'
import { forgersWorkshop } from '../buildings/forgersWorkshop'
import { fuelMerchant } from '../buildings/fuelMerchant'
import { grainStorage } from '../buildings/grainStorage'
import { grapevine } from '../buildings/grapevine'
import { harborPromenade } from '../buildings/harborPromenade'
import { hospice } from '../buildings/hospice'
import { houseOfTheBrotherhood } from '../buildings/houseOfTheBrotherhood'
import { inn } from '../buildings/inn'
import { market } from '../buildings/market'
import { palace } from '../buildings/palace'
import { peatCoalKiln } from '../buildings/peatCoalKiln'
import { pilgrimageSite } from '../buildings/pilgrimageSite'
import { printingOffice } from '../buildings/printingOffice'
import { priory } from '../buildings/priory'
import { quarry } from '../buildings/quarry'
import { sacristy } from '../buildings/sacristy'
import { shippingCompany } from '../buildings/shippingCompany'
import { shipyard } from '../buildings/shipyard'
import { slaughterhouse } from '../buildings/slaughterhouse'
import { stoneMerchant } from '../buildings/stoneMerchant'
import { townEstate } from '../buildings/townEstate'
import { windmill } from '../buildings/windmill'
import { winery } from '../buildings/winery'
import { BuildingEnum, GameCommandEnum, NextUseClergy, StateReducer } from '../types'

const checkIfUseCanHappen =
  (building: BuildingEnum): StateReducer =>
  (state) => {
    if (state === undefined) return undefined

    // try to consume bonusAction and mainAction first
    const usedAction = oncePerFrame(GameCommandEnum.USE)(state)
    if (usedAction) return usedAction

    // but if mainActionUsed and bonusAction don't allow, still it is possible to use if
    // usableBuildings allows AND the building in question isn't in unusableBuildings
    if (
      state.frame.usableBuildings.includes(building) === true &&
      state.frame.unusableBuildings.includes(building) === false
    ) {
      return match(state.frame.nextUse)
        .with(NextUseClergy.Free, () => state)
        .with(NextUseClergy.OnlyPrior, () => state)
        .with(NextUseClergy.Any, () => undefined)
        .exhaustive()
    }

    // otherwise dont allow
    return undefined
  }

const clearUsableBuildings: StateReducer = withFrame((frame) => ({
  ...frame,
  usableBuildings: [],
}))

const BuildingFarmyard = P.union(
  BuildingEnum.FarmYardR,
  BuildingEnum.FarmYardG,
  BuildingEnum.FarmYardB,
  BuildingEnum.FarmYardW
)

const BuildingClaymound = P.union(
  BuildingEnum.ClayMoundR,
  BuildingEnum.ClayMoundG,
  BuildingEnum.ClayMoundB,
  BuildingEnum.ClayMoundW
)

const BuildingCloisterOffice = P.union(
  BuildingEnum.CloisterOfficeR,
  BuildingEnum.CloisterOfficeG,
  BuildingEnum.CloisterOfficeB,
  BuildingEnum.CloisterOfficeW
)

export const use =
  (building: BuildingEnum, params: string[]): StateReducer =>
  (state) => {
    if (state === undefined) return undefined
    return pipe(
      checkIfUseCanHappen(building),
      state.frame.bonusRoundPlacement //
        ? moveClergyInBonusRoundTo(building)
        : moveClergyToOwnBuilding(building),
      clearUsableBuildings,
      match<BuildingEnum, StateReducer>(building)
        .with(BuildingEnum.Bakery, () => bakery(params[0]))
        .with(BuildingEnum.Bathhouse, () => bathhouse(params[0]))
        .with(BuildingEnum.BuildersMarket, () => buildersMarket(params[0]))
        .with(BuildingEnum.Calefactory, () => calefactory(params[0]))
        .with(BuildingEnum.Carpentry, () =>
          carpentry(Number.parseInt(params[0] ?? '', 10), Number.parseInt(params[1] ?? '', 10))
        )
        .with(BuildingEnum.Castle, castle)
        .with(BuildingEnum.ChamberOfWonders, () => chamberOfWonders(params[0]))
        .with(BuildingClaymound, () => clayMound(params[0]))
        .with(BuildingEnum.CloisterChapterHouse, cloisterChapterHouse)
        .with(BuildingEnum.CloisterChurch, () => cloisterChurch(params[0]))
        .with(BuildingEnum.CloisterCourtyard, () => cloisterCourtyard(params[0], params[1]))
        .with(BuildingEnum.CloisterGarden, cloisterGarden)
        .with(BuildingEnum.CloisterLibrary, () => cloisterLibrary(params[0], params[1]))
        .with(BuildingCloisterOffice, () => cloisterOffice(params[0]))
        .with(BuildingEnum.CloisterWorkshop, () => cloisterWorkshop(params[0]))
        .with(BuildingEnum.Dormitory, () => dormitory(params[0]))
        .with(BuildingEnum.Estate, () => estate(params[0]))
        .with(BuildingFarmyard, () => farmyard(params[0]))
        .with(BuildingEnum.FinancedEstate, () => {
          return financedEstate(params[0])
        })
        .with(BuildingEnum.ForgersWorkshop, () => forgersWorkshop(params[0]))
        .with(BuildingEnum.FuelMerchant, () => fuelMerchant(params[0]))
        .with(BuildingEnum.GrainStorage, () => grainStorage(params[0]))
        .with(BuildingEnum.GrapevineA, BuildingEnum.GrapevineA, () => grapevine(params[0]))
        .with(BuildingEnum.GrapevineB, BuildingEnum.GrapevineB, () => grapevine(params[0]))
        .with(BuildingEnum.HarborPromenade, harborPromenade)
        .with(BuildingEnum.Hospice, hospice)
        .with(BuildingEnum.HouseOfTheBrotherhood, () => houseOfTheBrotherhood(params[0], params[1]))
        .with(BuildingEnum.Inn, () => inn(params[0]))
        .with(BuildingEnum.Market, () => market(params[0]))
        .with(BuildingEnum.Palace, () => palace(params[0]))
        .with(BuildingEnum.PeatCoalKiln, BuildingEnum.PeatCoalKiln, () => peatCoalKiln(params[0]))
        .with(BuildingEnum.PilgrimageSite, () => pilgrimageSite(params[0], params[1]))
        .with(BuildingEnum.PrintingOffice, () => printingOffice(...params))
        .with(BuildingEnum.Priory, priory)
        .with(BuildingEnum.QuarryA, BuildingEnum.QuarryB, () => quarry(params[0]))
        .with(BuildingEnum.Sacristy, () => sacristy(params[0]))
        .with(BuildingEnum.ShippingCompany, () => shippingCompany(params[0], params[1]))
        .with(BuildingEnum.Shipyard, () => shipyard(params[0]))
        .with(BuildingEnum.Slaughterhouse, () => slaughterhouse(params[0]))
        .with(BuildingEnum.StoneMerchant, () => stoneMerchant(params[0]))
        .with(BuildingEnum.TownEstate, () => townEstate(params[0]))
        .with(BuildingEnum.Windmill, () => windmill(params[0]))
        .with(BuildingEnum.Winery, () => winery(params[0], params[1]))
        .otherwise(() => () => {
          throw new Error(`Invalid params [${params}] for building ${building}`)
        })
    )(state)
  }

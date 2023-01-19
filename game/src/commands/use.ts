import { pipe } from 'ramda'
import { match, P } from 'ts-pattern'
import { getPlayer, isLayBrother, isPrior, setPlayer } from '../board/player'
import { bakery } from '../buildings/bakery'
import { bathhouse } from '../buildings/bathhouse'
import { buildersMarket } from '../buildings/buildersMarket'
import { calefactory } from '../buildings/calefactory'
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
import { pilgrimmageSite } from '../buildings/pilgrimageSite'
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
import { BuildingEnum, GameStatePlaying, NextUseClergy, Tile } from '../types'

const checkBuildingUsable =
  (building: BuildingEnum) =>
  (state: GameStatePlaying | undefined): GameStatePlaying | undefined => {
    if (state === undefined) return undefined
    if (state.usableBuildings && !state.usableBuildings.includes(building)) return undefined
    return state
  }

export const findBuilding = (landscape: Tile[][], building: BuildingEnum): { row?: number; col?: number } => {
  let row
  let col
  landscape.forEach((landRow, r) => {
    landRow.forEach(([_l, b, _c], c) => {
      if (building === b) {
        row = r
        col = c
      }
    })
  })
  return { row, col }
}

export const moveClergyToOwnBuilding =
  (building: BuildingEnum) =>
  (state: GameStatePlaying | undefined): GameStatePlaying | undefined => {
    if (state === undefined) return undefined
    if (state.nextUse === NextUseClergy.Free) return state
    const player = getPlayer(state)
    const { row, col } = findBuilding(player.landscape, building)
    if (row === undefined || col === undefined) return undefined
    const [land] = player.landscape[row][col]

    const priors = player.clergy.filter(isPrior)
    if (state.nextUse === NextUseClergy.OnlyPrior && priors.length === 0) return undefined

    const nextClergy = match(state.nextUse)
      .with(NextUseClergy.Any, () => player.clergy[0])
      .with(NextUseClergy.None, () => undefined)
      .with(NextUseClergy.OnlyPrior, () => priors[0])
      .exhaustive()

    if (nextClergy === undefined) return undefined

    return setPlayer(state, {
      ...player,
      landscape: [
        ...player.landscape.slice(0, row),
        [
          ...player.landscape[row].slice(0, col),
          [land, building, nextClergy] as Tile,
          ...player.landscape[row].slice(col + 1),
        ],
        ...player.landscape.slice(row + 1),
      ],
      clergy: player.clergy.filter((c) => c !== nextClergy),
    })
  }

const clearUsableBuildings = (state: GameStatePlaying | undefined): GameStatePlaying | undefined =>
  state && {
    ...state,
    usableBuildings: [],
  }

const clearNextUse = (state: GameStatePlaying | undefined): GameStatePlaying | undefined =>
  state && {
    ...state,
    nextUse: NextUseClergy.None,
  }

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

export const use = (building: BuildingEnum, params: string[]) =>
  pipe(
    checkBuildingUsable(building),
    moveClergyToOwnBuilding(building),
    clearUsableBuildings,
    clearNextUse,
    match<[BuildingEnum, string[]], (state: GameStatePlaying | undefined) => GameStatePlaying | undefined>([
      building,
      params,
    ])
      .with([BuildingEnum.Bakery, [P._]], ([_, params]) => bakery(params[0]))
      .with([BuildingEnum.Bathhouse, []], bathhouse)
      .with([BuildingEnum.BuildersMarket, []], buildersMarket)
      .with([BuildingEnum.Calefactory, []], calefactory)
      .with([BuildingEnum.Castle, []], castle)
      .with([BuildingEnum.ChamberOfWonders, []], chamberOfWonders)
      .with([BuildingClaymound, [P._]], [BuildingClaymound, []], ([_, params]) => clayMound(params[0]))
      .with([BuildingEnum.CloisterChapterHouse, []], cloisterChapterHouse)
      .with([BuildingEnum.CloisterChurch, []], cloisterChurch)
      .with([BuildingEnum.CloisterCourtyard, [P._, P._]], ([_, params]) => cloisterCourtyard(params[0], params[1]))
      .with([BuildingEnum.CloisterGarden, []], cloisterGarden)
      .with([BuildingEnum.CloisterLibrary, []], cloisterLibrary)
      .with([BuildingCloisterOffice, [P._]], [BuildingCloisterOffice, []], ([_, params]) => cloisterOffice(params[0]))
      .with([BuildingEnum.CloisterWorkshop, []], cloisterWorkshop)
      .with([BuildingEnum.Dormitory, []], dormitory)
      .with([BuildingEnum.Estate, []], estate)
      .with([BuildingFarmyard, [P.select()]], farmyard)
      .with([BuildingEnum.FinancedEstate, []], financedEstate)
      .with([BuildingEnum.ForgersWorkshop, []], forgersWorkshop)
      .with([BuildingEnum.FuelMerchant, [P._]], ([_, params]) => fuelMerchant(params[0]))
      .with([BuildingEnum.GrainStorage, []], grainStorage)
      .with([BuildingEnum.GrapevineA, []], grapevine)
      .with([BuildingEnum.GrapevineB, []], grapevine)
      .with([BuildingEnum.HarborPromenade, []], harborPromenade)
      .with([BuildingEnum.Hospice, []], hospice)
      .with([BuildingEnum.HouseOfTheBrotherhood, []], houseOfTheBrotherhood)
      .with([BuildingEnum.Inn, []], inn)
      .with([BuildingEnum.Market, [P._]], ([_, params]) => market(params[0]))
      .with([BuildingEnum.Palace, []], palace)
      .with([BuildingEnum.PeatCoalKiln, []], [BuildingEnum.PeatCoalKiln, [P._]], ([_, params]) =>
        peatCoalKiln(params[0])
      )
      .with([BuildingEnum.PilgrimageSite, []], pilgrimmageSite)
      .with([BuildingEnum.PrintingOffice, []], printingOffice)
      .with([BuildingEnum.Priory, []], priory)
      .with([BuildingEnum.QuarryA, []], quarry)
      .with([BuildingEnum.QuarryB, []], quarry)
      .with([BuildingEnum.Sacristy, []], sacristy)
      .with([BuildingEnum.ShippingCompany, []], shippingCompany)
      .with([BuildingEnum.Shipyard, []], shipyard)
      .with([BuildingEnum.Slaughterhouse, []], slaughterhouse)
      .with([BuildingEnum.StoneMerchant, [P._]], ([_, params]) => stoneMerchant(params[0]))
      .with([BuildingEnum.TownEstate, []], townEstate)
      .with([BuildingEnum.Windmill, [P._]], ([_, params]) => windmill(params[0]))
      .with([BuildingEnum.Winery, []], winery)
      .otherwise(() => () => {
        throw new Error(`Invalid params [${params}] for building ${building}`)
      })
  )

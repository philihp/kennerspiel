import { filter, pipe } from 'ramda'
import { match, P } from 'ts-pattern'
import { isPrior, withActivePlayer } from '../board/player'
import { consumeMainAction } from '../board/state'
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
import { BuildingEnum, GameCommandEnum, GameStatePlaying, NextUseClergy, Tile } from '../types'

const checkStateAllowsUse = (building: BuildingEnum) => (state: GameStatePlaying | undefined) => {
  if (state === undefined) return undefined
  if (state.frame.mainActionUsed === false) return state
  if (state.frame.bonusActions.includes(GameCommandEnum.USE)) return state
  if (
    state.frame.usableBuildings.includes(building) === true &&
    state.frame.unusableBuildings.includes(building) === false
  ) {
    return match(state.frame.nextUse)
      .with(NextUseClergy.Free, () => state)
      .with(NextUseClergy.OnlyPrior, () => state)
      .with(NextUseClergy.Any, () => undefined)
      .with(NextUseClergy.None, () => undefined)
      .exhaustive()
  }
  return undefined
}

export const findBuilding = (
  landscape: Tile[][],
  landscapeOffset: number,
  building: BuildingEnum
): { row?: number; col?: number } => {
  let row
  let col
  landscape.forEach((landRow, r) => {
    landRow.forEach(([_l, b, _c], c) => {
      if (building === b) {
        row = r - landscapeOffset
        col = c
      }
    })
  })
  return { row, col }
}

const moveClergyToOwnBuilding =
  (building: BuildingEnum) =>
  (state: GameStatePlaying | undefined): GameStatePlaying | undefined => {
    if (state === undefined) return undefined
    if (state.frame.nextUse === NextUseClergy.Free) return state
    const player = state.players[state.frame.activePlayerIndex]
    const { row, col } = findBuilding(player.landscape, player.landscapeOffset, building)
    if (row === undefined || col === undefined) return undefined
    const [land] = player.landscape[row][col]

    const priors = player.clergy.filter(isPrior)
    if (state.frame.nextUse === NextUseClergy.OnlyPrior && priors.length === 0) return undefined

    const nextClergy = match(state.frame.nextUse)
      .with(NextUseClergy.Any, () => player.clergy[0])
      .with(NextUseClergy.None, () => undefined)
      .with(NextUseClergy.OnlyPrior, () => priors[0])
      .exhaustive()

    if (nextClergy === undefined) return undefined

    return withActivePlayer((player) => ({
      ...player,
      landscape: [
        ...player.landscape.slice(0, row + player.landscapeOffset),
        [
          ...player.landscape[row + player.landscapeOffset].slice(0, col),
          [land, building, nextClergy] as Tile,
          ...player.landscape[row + player.landscapeOffset].slice(col + 1),
        ],
        ...player.landscape.slice(row + player.landscapeOffset + 1),
      ],
      clergy: filter((c) => c !== nextClergy)(player.clergy),
    }))(state)
  }

const clearUsableBuildings = (state: GameStatePlaying | undefined): GameStatePlaying | undefined => {
  return (
    state && {
      ...state,
      frame: {
        ...state.frame,
        usableBuildings: [],
      },
    }
  )
}

const clearNextUse = (state: GameStatePlaying | undefined): GameStatePlaying | undefined => {
  return (
    state && {
      ...state,
      frame: {
        ...state.frame,
        nextUse: NextUseClergy.None,
      },
    }
  )
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
    checkStateAllowsUse(building),
    moveClergyToOwnBuilding(building),
    consumeMainAction,
    clearUsableBuildings,
    clearNextUse,
    match<[BuildingEnum, string[]], (state: GameStatePlaying | undefined) => GameStatePlaying | undefined>([
      building,
      params,
    ])
      .with([BuildingEnum.Bakery, [P._]], ([_, params]) => bakery(params[0]))
      .with([BuildingEnum.Bathhouse, []], bathhouse)
      .with([BuildingEnum.BuildersMarket, [P._]], ([_, params]) => buildersMarket(params[0]))
      .with([BuildingEnum.Calefactory, [P._]], ([_, params]) => calefactory(params[0]))
      .with([BuildingEnum.Carpentry, [P._, P._]], ([_, [row, col]]) =>
        carpentry(Number.parseInt(row ?? '', 10), Number.parseInt(col ?? '', 10))
      )
      .with([BuildingEnum.Castle, []], castle)
      .with([BuildingEnum.ChamberOfWonders, [P._]], ([_, params]) => chamberOfWonders(params[0]))
      .with([BuildingClaymound, [P._]], [BuildingClaymound, []], ([_, params]) => clayMound(params[0]))
      .with([BuildingEnum.CloisterChapterHouse, []], cloisterChapterHouse)
      .with([BuildingEnum.CloisterChurch, [P._]], ([_, params]) => cloisterChurch(params[0]))
      .with([BuildingEnum.CloisterCourtyard, [P._, P._]], ([_, params]) => cloisterCourtyard(params[0], params[1]))
      .with([BuildingEnum.CloisterGarden, []], cloisterGarden)
      .with([BuildingEnum.CloisterLibrary, [P._, P._]], ([_, params]) => cloisterLibrary(params[0], params[1]))
      .with([BuildingCloisterOffice, [P._]], [BuildingCloisterOffice, []], ([_, params]) => cloisterOffice(params[0]))
      .with([BuildingEnum.CloisterWorkshop, [P._]], ([_, params]) => cloisterWorkshop(params[0]))
      .with([BuildingEnum.Dormitory, [P._]], ([_, params]) => dormitory(params[0]))
      .with([BuildingEnum.Estate, [P._]], ([_, params]) => estate(params[0]))
      .with([BuildingFarmyard, [P.select()]], farmyard)
      .with([BuildingEnum.FinancedEstate, [P._]], ([_, params]) => financedEstate(params[0]))
      .with([BuildingEnum.ForgersWorkshop, [P._]], ([_, params]) => forgersWorkshop(params[0]))
      .with([BuildingEnum.FuelMerchant, [P._]], ([_, params]) => fuelMerchant(params[0]))
      .with([BuildingEnum.GrainStorage, [P._]], ([_, params]) => grainStorage(params[0]))
      .with([BuildingEnum.GrapevineA, [P._]], ([_, params]) => grapevine(params[0]))
      .with([BuildingEnum.GrapevineB, [P._]], ([_, params]) => grapevine(params[0]))
      .with([BuildingEnum.HarborPromenade, []], harborPromenade)
      .with([BuildingEnum.Hospice, []], hospice)
      .with([BuildingEnum.HouseOfTheBrotherhood, [P._, P._]], ([_, params]) =>
        houseOfTheBrotherhood(params[0], params[1])
      )
      .with([BuildingEnum.Inn, [P._]], ([_, params]) => inn(params[0]))
      .with([BuildingEnum.Market, [P._]], ([_, params]) => market(params[0]))
      .with([BuildingEnum.Palace, [P._]], ([_, params]) => palace(params[0]))
      .with([BuildingEnum.PeatCoalKiln, []], [BuildingEnum.PeatCoalKiln, [P._]], ([_, params]) =>
        peatCoalKiln(params[0])
      )
      .with([BuildingEnum.PilgrimageSite, [P._]], ([_, params]) => pilgrimageSite(params[0]))
      .with(
        [BuildingEnum.PrintingOffice, []],
        [BuildingEnum.PrintingOffice, [P._, P._]],
        [BuildingEnum.PrintingOffice, [P._, P._, P._, P._]],
        [BuildingEnum.PrintingOffice, [P._, P._, P._, P._, P._, P._]],
        [BuildingEnum.PrintingOffice, [P._, P._, P._, P._, P._, P._, P._, P._]],
        ([_, params]) => printingOffice(...params)
      )
      .with([BuildingEnum.Priory, []], priory)
      .with([BuildingEnum.QuarryA, [P._]], [BuildingEnum.QuarryA, []], ([_, params]) => quarry(params[0]))
      .with([BuildingEnum.QuarryB, [P._]], [BuildingEnum.QuarryB, []], ([_, params]) => quarry(params[0]))
      .with([BuildingEnum.Sacristy, [P._]], ([_, params]) => sacristy(params[0]))
      .with([BuildingEnum.ShippingCompany, [P._, P._]], ([_, params]) => shippingCompany(params[0], params[1]))
      .with([BuildingEnum.Shipyard, [P._]], ([_, params]) => shipyard(params[0]))
      .with([BuildingEnum.Slaughterhouse, [P._]], ([_, params]) => slaughterhouse(params[0]))
      .with([BuildingEnum.StoneMerchant, [P._]], ([_, params]) => stoneMerchant(params[0]))
      .with([BuildingEnum.TownEstate, [P._]], ([_, params]) => townEstate(params[0]))
      .with([BuildingEnum.Windmill, [P._]], ([_, params]) => windmill(params[0]))
      .with([BuildingEnum.Winery, [P._, P._]], ([_, params]) => winery(params[0], params[1]))
      .otherwise(() => () => {
        throw new Error(`Invalid params [${params}] for building ${building}`)
      })
  )

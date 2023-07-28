import { any, identity, includes, isEmpty, lensPath, map, pipe, reduce, set, values, view, without } from 'ramda'
import { P, match } from 'ts-pattern'
import { oncePerFrame, withFrame } from '../board/frame'
import {
  allVacantUsableBuildings,
  moveClergyInBonusRoundTo,
  moveClergyToNeutralBuilding,
  moveClergyToOwnBuilding,
} from '../board/landscape'
import {
  alehouse,
  bakery,
  bathhouse,
  brewery,
  buildersMarket,
  bulwark,
  calefactory,
  carpentry,
  castle,
  camera,
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
  falseLighthouse,
  farmyard,
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
  houseOfTheBrotherhood,
  houseboat,
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
  sacredSite,
  sacristy,
  scriptorium,
  shippingCompany,
  shipyard,
  slaughterhouse,
  spinningMill,
  stoneMerchant,
  townEstate,
  whiskeyDistillery,
  windmill,
  winery,
  complete as completeBuilding,
} from '../buildings'
import { BuildingEnum, GameCommandEnum, GameStatePlaying, NextUseClergy, StateReducer } from '../types'
import { activeLens, isPrior } from '../board/player'

const checkIfUseCanHappen =
  (building?: BuildingEnum): StateReducer =>
  (state) => {
    if (state === undefined) return undefined
    if (state.frame.activePlayerIndex !== state.frame.currentPlayerIndex) return undefined

    // try to consume bonusAction and mainAction first
    const usedAction = oncePerFrame(GameCommandEnum.USE)(state)
    if (usedAction) return usedAction

    // but if mainActionUsed and bonusAction don't allow, still it is possible to use if
    // usableBuildings allows AND the building in question isn't in unusableBuildings
    if (building) {
      if (
        state.frame.usableBuildings.includes(building) === true &&
        state.frame.unusableBuildings.includes(building) === false &&
        [NextUseClergy.Free, NextUseClergy.OnlyPrior].includes(state.frame.nextUse)
      ) {
        return state
      }
    } else if (without(state.frame.unusableBuildings, state.frame.usableBuildings).length > 0) {
      return state
    }

    // otherwise dont allow
    return undefined
  }

const clearUsableBuildings: StateReducer = withFrame((frame) => ({
  ...frame,
  usableBuildings: [],
}))

const moveClergyTo =
  (building: BuildingEnum): StateReducer =>
  (state) => {
    if (state === undefined) return undefined
    if (state.frame.bonusRoundPlacement) return moveClergyInBonusRoundTo(building)(state)
    if (state.frame.neutralBuildingPhase) {
      return pipe(
        //
        moveClergyToNeutralBuilding(building),
        set(lensPath(['frame', 'neutralBuildingPhase']), false)
      )(state)
    }
    return moveClergyToOwnBuilding(building)(state)
  }

export const use = (building: BuildingEnum, params: string[]): StateReducer =>
  pipe(
    checkIfUseCanHappen(building),
    moveClergyTo(building),
    clearUsableBuildings,
    match<BuildingEnum, StateReducer>(building)
      .with(BuildingEnum.Alehouse, () => alehouse(params[0]))
      .with(BuildingEnum.Bakery, () => bakery(params[0]))
      .with(BuildingEnum.Bathhouse, () => bathhouse(params[0]))
      .with(BuildingEnum.Brewery, () => brewery(params[0]))
      .with(BuildingEnum.BuildersMarket, () => buildersMarket(params[0]))
      .with(BuildingEnum.Bulwark, () => bulwark(params[0]))
      .with(BuildingEnum.Calefactory, () => calefactory(params[0]))
      .with(BuildingEnum.Carpentry, () =>
        carpentry(Number.parseInt(params[0] ?? '', 10), Number.parseInt(params[1] ?? '', 10))
      )
      .with(BuildingEnum.Castle, castle)
      .with(BuildingEnum.Camera, () => camera(params[0]))
      .with(BuildingEnum.ChamberOfWonders, () => chamberOfWonders(params[0]))
      .with(BuildingEnum.Chapel, () => chapel(params[0]))
      .with(BuildingEnum.ClayMoundR, BuildingEnum.ClayMoundG, BuildingEnum.ClayMoundB, BuildingEnum.ClayMoundW, () =>
        clayMound(params[0])
      )
      .with(BuildingEnum.CloisterChapterHouse, cloisterChapterHouse)
      .with(BuildingEnum.CloisterChurch, () => cloisterChurch(params[0]))
      .with(BuildingEnum.CloisterCourtyard, () => cloisterCourtyard(params[0], params[1]))
      .with(BuildingEnum.CloisterGarden, () => cloisterGarden())
      .with(BuildingEnum.CloisterLibrary, () => cloisterLibrary(params[0]))
      .with(
        BuildingEnum.CloisterOfficeR,
        BuildingEnum.CloisterOfficeG,
        BuildingEnum.CloisterOfficeB,
        BuildingEnum.CloisterOfficeW,
        () => cloisterOffice(params[0])
      )
      .with(BuildingEnum.CloisterWorkshop, () => cloisterWorkshop(params[0]))
      .with(BuildingEnum.CoalHarbor, () => coalHarbor(params[0]))
      .with(BuildingEnum.Cooperage, () => cooperage(params[0], params[1]))
      .with(BuildingEnum.Cottage, () => cottage())
      .with(BuildingEnum.Dormitory, () => dormitory(params[0]))
      .with(BuildingEnum.DruidsHouse, () => druidsHouse(params[0], params[1]))
      .with(BuildingEnum.Estate, () => estate(params[0]))
      .with(BuildingEnum.FarmYardR, BuildingEnum.FarmYardG, BuildingEnum.FarmYardB, BuildingEnum.FarmYardW, () =>
        farmyard(params[0])
      )
      .with(BuildingEnum.FalseLighthouse, () => falseLighthouse(params[0]))
      .with(BuildingEnum.FestivalGround, () => festivalGround(params[0], params[1]))
      .with(BuildingEnum.FilialChurch, () => filialChurch(params[0]))
      .with(BuildingEnum.FinancedEstate, () => financedEstate(params[0]))
      .with(BuildingEnum.ForestHut, () =>
        forestHut((Number.parseInt(params[0] ?? '', 10), Number.parseInt(params[1] ?? '', 10)))
      )
      .with(BuildingEnum.ForgersWorkshop, () => forgersWorkshop(params[0]))
      .with(BuildingEnum.FuelMerchant, () => fuelMerchant(params[0]))
      .with(BuildingEnum.Guesthouse, () => guesthouse())
      .with(BuildingEnum.GrainStorage, () => grainStorage(params[0]))
      .with(BuildingEnum.Granary, () => granary(params[0]))
      .with(BuildingEnum.GrandManor, () => grandManor(params[0]))
      .with(BuildingEnum.GrapevineA, BuildingEnum.GrapevineA, () => grapevine(params[0]))
      .with(BuildingEnum.GrapevineB, BuildingEnum.GrapevineB, () => grapevine(params[0]))
      .with(BuildingEnum.HarborPromenade, harborPromenade)
      .with(BuildingEnum.Hospice, hospice)
      .with(BuildingEnum.Houseboat, () => houseboat())
      .with(BuildingEnum.HouseOfTheBrotherhood, () => houseOfTheBrotherhood(params[0], params[1]))
      .with(BuildingEnum.Inn, () => inn(params[0]))
      .with(BuildingEnum.Locutory, () => locutory(params[0]))
      .with(BuildingEnum.Market, () => market(params[0]))
      .with(BuildingEnum.Malthouse, () => malthouse(params[0]))
      .with(BuildingEnum.Palace, () => palace(params[0]))
      .with(BuildingEnum.PeatCoalKiln, BuildingEnum.PeatCoalKiln, () => peatCoalKiln(params[0]))
      .with(BuildingEnum.PilgrimageSite, () => pilgrimageSite(params[0], params[1]))
      .with(BuildingEnum.Portico, () => portico(params[0]))
      .with(BuildingEnum.PrintingOffice, () => printingOffice(...params))
      .with(BuildingEnum.Priory, priory)
      .with(BuildingEnum.QuarryA, BuildingEnum.QuarryB, () => quarry(params[0]))
      .with(BuildingEnum.Refectory, () => refectory(params[0]))
      .with(BuildingEnum.RoundTower, () => roundTower(params[0]))
      .with(BuildingEnum.Scriptorium, () => scriptorium(params[0]))
      .with(BuildingEnum.Sacristy, () => sacristy(params[0]))
      .with(BuildingEnum.SacredSite, () => sacredSite(params[0]))
      .with(BuildingEnum.ShippingCompany, () => shippingCompany(params[0], params[1]))
      .with(BuildingEnum.Shipyard, () => shipyard(params[0]))
      .with(BuildingEnum.Slaughterhouse, () => slaughterhouse(params[0]))
      .with(BuildingEnum.SpinningMill, () => spinningMill())
      .with(BuildingEnum.StoneMerchant, () => stoneMerchant(params[0]))
      .with(BuildingEnum.TownEstate, () => townEstate(params[0]))
      .with(BuildingEnum.WhiskeyDistillery, () => whiskeyDistillery(params[0]))
      .with(BuildingEnum.Windmill, () => windmill(params[0]))
      .with(BuildingEnum.Winery, () => winery(params[0]))
      .otherwise(() => () => {
        throw new Error(`Invalid params [${params}] for building ${building}`)
      })
  )

export const complete =
  (state: GameStatePlaying) =>
  (partial: string[]): string[] => {
    const player = state.players[state.frame.activePlayerIndex]
    return match<string[], string[]>(partial)
      .with([], () => {
        if (checkIfUseCanHappen()(state) === undefined) return []

        // really edge case, but in neutral building phase AFTER all buildings are placed
        // AND ONLY IF the neutral player has a prior available do we allow USE
        if (
          state.frame.neutralBuildingPhase &&
          state.buildings.length === 0 &&
          state.frame.nextUse === NextUseClergy.OnlyPrior &&
          any(identity, map(isPrior, view(lensPath(['players', 1]), state).clergy))
        ) {
          return [GameCommandEnum.USE]
        }

        const hasClergyAvailable = view(activeLens(state), state).clergy?.length > 0
        const hasPriorAvailable = any(identity, map(isPrior, view(activeLens(state), state).clergy))
        if (
          state.frame.bonusRoundPlacement === false &&
          ((state.frame.nextUse === NextUseClergy.Any && !hasClergyAvailable) ||
            (state.frame.nextUse === NextUseClergy.OnlyPrior && !hasPriorAvailable))
        )
          return []
        return [GameCommandEnum.USE]
      })
      .with([GameCommandEnum.USE], () =>
        !isEmpty(state.frame.usableBuildings) ? state.frame.usableBuildings : allVacantUsableBuildings(player.landscape)
      )
      .with(
        P.when(([command, building]) => command === GameCommandEnum.USE && includes(building, values(BuildingEnum))),
        ([, building, ...params]) => completeBuilding[building as BuildingEnum](params)(state)
      )
      .otherwise(() => {
        return []
      })
  }

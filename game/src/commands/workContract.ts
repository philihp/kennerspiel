import { all, find, pipe, range, without } from 'ramda'
import { payCost, getCost, withActivePlayer, isLayBrother, isPrior } from '../board/player'
import { moveClergyToOwnBuilding } from '../board/landscape'
import { costMoney, parseResourceParam } from '../board/resource'
import { oncePerFrame, revertActivePlayerToCurrent, setFrameToAllowFreeUsage, withFrame } from '../board/frame'
import { BuildingEnum, Cost, Frame, GameCommandEnum, StateReducer, Tableau } from '../types'

const checkWorkContractPayment =
  (payment: Cost): StateReducer =>
  (state) => {
    if (state === undefined) return undefined
    // TODO: this should go up if the winery or distillery is built, and should allow for Wine instead
    if (costMoney(payment) < 1) return undefined
    return state
  }

const doesBuildingExistInPlayersLandscape =
  (building: BuildingEnum) =>
  (player: Tableau): boolean => {
    return false
  }

const transferActiveToOwnerOf =
  (building: BuildingEnum): StateReducer =>
  (state) => {
    if (state === undefined) return undefined
    const playerIndexes: number[] = without([state.frame.activePlayerIndex], range(0, state.config.players))
    const foundWithPlayer = find((i) => doesBuildingExistInPlayersLandscape(building)(state.players[i]), playerIndexes)
    if (foundWithPlayer === undefined) return undefined
    // if you DID find it, set the active player to be that player... they need to have an option to pick prior or go with default
    // TODO: what if they dont have a prior?
    // TODO: what if they dont have any people??
    return withFrame((frame: Frame) => ({ ...frame, activePlayerIndex: foundWithPlayer }))(state)
  }

const checkModalPlayerBuildingUnoccupied =
  (building: BuildingEnum): StateReducer =>
  (state) => {
    // TODO this should fail if the proposed building that activePlayer owns is already occupied
    return state
  }

const checkModalPlayerHasPriorOption =
  (building: BuildingEnum): StateReducer =>
  (state) => {
    if (state === undefined) return undefined
    const { clergy } = state.players[state.frame.activePlayerIndex]

    // if theyre trying to work contract someone with no people, stop it all right here
    if (clergy.length === 0) return undefined

    // if all of the the active palyers clergy are all priors or all laybrothers, then the player has no choice here
    if (all(isPrior, clergy) || all(isLayBrother, clergy)) {
      return pipe(
        //
        moveClergyToOwnBuilding(building),
        setFrameToAllowFreeUsage([building]),
        revertActivePlayerToCurrent
      )(state)
    }

    // otherwise activePlayer stays on them, and lets leave usableBuildings as the building they need to look at
    return withFrame((frame) => ({ ...frame, usableBuildings: [building] }))(state)
  }

export const workContract = (building: BuildingEnum, paymentGift: string): StateReducer => {
  const input = parseResourceParam(paymentGift)
  const { penny } = input
  return pipe(
    // Only allow if mainAction not consumed, and consume it
    oncePerFrame(GameCommandEnum.WORK_CONTRACT),

    // <-- check to make sure payment is enough
    checkWorkContractPayment(input),
    // <-- consume payment
    withActivePlayer(payCost(input)),

    // <-> find that buildings owner, among all non-active players, and set activePlayer to them
    transferActiveToOwnerOf(building),

    // --> give the new active player all of the coins that were given
    withActivePlayer(getCost({ penny })),

    checkModalPlayerBuildingUnoccupied(building),

    // --> either that player:
    //  ...doesnt have any clergy, then fail
    //  ...only has laybrothers, or a single prior, and thus no choice, so just make it for them
    //  ...has both a laybrother and a prior available, and thus must make a choice
    checkModalPlayerHasPriorOption(building)
  )
}

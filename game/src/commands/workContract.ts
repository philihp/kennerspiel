import { all, curry, find, pipe, range, without } from 'ramda'
import { payCost, getCost, withActivePlayer, isLayBrother, isPrior } from '../board/player'
import { findBuildingWithoutOffset, moveClergyToOwnBuilding } from '../board/landscape'
import { costMoney, parseResourceParam } from '../board/resource'
import { oncePerFrame, revertActivePlayerToCurrent, setFrameToAllowFreeUsage, withFrame } from '../board/frame'
import { BuildingEnum, Cost, Frame, GameCommandEnum, GameStatePlaying, SettlementRound, StateReducer } from '../types'

const checkWorkContractPayment =
  (payment: Cost): StateReducer =>
  (state) => {
    if (state === undefined) return undefined
    if (payment.whiskey ?? 0 > 1) return state
    if (payment.wine ?? 0 > 1) return state
    const cost =
      state.frame.settlementRound === SettlementRound.S ||
      state.frame.settlementRound === SettlementRound.A ||
      state.buildings.includes(BuildingEnum.WhiskeyDistillery) ||
      state.buildings.includes(BuildingEnum.Winery)
        ? 1
        : 2
    if (costMoney(payment) < cost) return undefined
    return state
  }

const transferActiveToOwnerOf =
  (building: BuildingEnum): StateReducer =>
  (state) => {
    if (state === undefined) return undefined
    // this makes it so we dont look at the current player's landscape... prevent work contract on yourself
    const playerIndexes: number[] = without([state.frame.activePlayerIndex], range(0, state.config.players))

    // this makes it so we dont look at the current player's landscape... prevent work contract on yourself
    const foundWithPlayer = find(
      (i) => !!findBuildingWithoutOffset(building)(state.players[i].landscape),
      playerIndexes
    )
    if (foundWithPlayer === undefined) return undefined
    return withFrame((frame: Frame) => ({ ...frame, activePlayerIndex: foundWithPlayer }))(state)
  }

const checkModalPlayerBuildingUnoccupied = (building: BuildingEnum): StateReducer =>
  withActivePlayer((player) => {
    const location = findBuildingWithoutOffset(building)(player.landscape)
    // should not actually ever get this
    if (location === undefined) return undefined
    const [row, col] = location
    const [, , clergy] = player.landscape[row][col]
    if (clergy !== undefined) return undefined
    return player
  })

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

export const complete = curry((state: GameStatePlaying, partial: string[]): string[] => {
  return []
})

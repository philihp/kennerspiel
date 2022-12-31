import { GameState, GameStatePlaying, GameStatusEnum, PreMoveHandler, Rondel, Tile } from '../types'
import { isExtraRound, isPriorSpecialInExtraRound } from './extraRound'
import { clergyForColor, setPlayer } from './player'
import { preRound } from './preRound'
import { pushArm } from './rondel'
import { nextSettlementRound } from './settlements'

export const preMove: PreMoveHandler = (state: GameStatePlaying): GameStatePlaying | undefined => {
  let newState = state
  if (state.status !== GameStatusEnum.PLAYING) return undefined
  if (state.players === undefined) return undefined
  if (state.moveInRound === undefined) return undefined
  if (state.rondel === undefined) return undefined
  if (state.config === undefined) return undefined
  if (state.round === undefined) return undefined

  if (isExtraRound(state.config, state.round)) {
    // board.preExtraRound()
    if (isPriorSpecialInExtraRound(state.config)) {
      // TODO: return all player priors home
    } else {
      // TODO: for each player, if all placed, reset them
    }
    state.extraRound = true
  } else if (state.settling && state.moveInRound === 1) {
    // board.preSettling()
    newState.settlementRound = nextSettlementRound(state.settlementRound)
  } else if (state.moveInRound === 1) {
    // board.preRound()

    // 1 - reset clergymen
    state.players.forEach((player, i) => {
      if (player.clergy.length === 0) {
        // clergy are all placed
        const clergy = clergyForColor(player.color)
        const landscape = player.landscape.map((landRow) =>
          landRow.map((landStack) => {
            if (landStack.length >= 3 && landStack?.[2] !== undefined && clergy.includes(landStack[2]))
              return [...landStack.slice(0, 2), ...landStack.slice(3)] as Tile
            return landStack
          })
        )
        newState = setPlayer(
          newState,
          {
            ...player,
            clergy,
            landscape,
          },
          i
        )
      }
    })

    // 2 - push arm
    newState.rondel = pushArm(state.rondel, state.config.players)

    const preRoundState = preRound(state.config)(newState)
    if (preRoundState === undefined) return undefined
    newState = preRoundState

    // 3 - check to see if grapes/stone should become active
    // TODO setActive tokens
    // if(round == mode.grapeActiveOnRound()) getWheel().getGrape().setActive(true);
    // if(round == mode.stoneActiveOnRound()) getWheel().getStone().setActive(true);
    // if(round == mode.jokerActiveOnRound()) getWheel().getJoker().setActive(true);
  }

  // TODO: actionsBeforeSettlement
  //   	if(!isGameOver()) {
  // 	for (int i = 0; i < players.length; i++) {
  // 		players[i].setActionsBeforeSettlement(actionsBeforeSettlement(i));
  // 	}
  // }

  return newState
}

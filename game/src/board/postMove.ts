import { match, P } from 'ts-pattern'
import { GameCommandConfigParams, GameState, GameStatusEnum, PostMoveHandler, SettlementRound } from '../types'
import { roundBuildings } from './buildings'
import { roundSettlements, settlementOnRound } from './settlements'

export const postMove = (config: GameCommandConfigParams): PostMoveHandler => {
  return match<GameCommandConfigParams, PostMoveHandler>(config) // .
    .with({ players: 1, country: 'ireland' }, () => (state: GameState) => {
      // TODO
      // https://github.com/philihp/weblabora/blob/737717fd59c1301da6584a6874a20420eba4e71e/src/main/java/com/philihp/weblabora/model/BoardModeOneIreland.java#L113
      return state
    })
    .with({ players: 1, country: 'france' }, () => (state: GameState) => {
      // TODO
      // https://github.com/philihp/weblabora/blob/737717fd59c1301da6584a6874a20420eba4e71e/src/main/java/com/philihp/weblabora/model/BoardModeOneFrance.java#L121
      return state
    })
    .with({ players: 2, length: 'long' }, () => (state: GameState) => {
      if (state.players === undefined) return undefined
      if (state.moveInRound === undefined) return undefined
      if (state.round === undefined) return undefined
      if (state.config === undefined) return undefined

      let { status, players, buildings, round, settling, moveInRound, activePlayerIndex } = state

      if (moveInRound === 2 || settling) {
        activePlayerIndex = (activePlayerIndex + 1) % state.players.length
      }
      moveInRound++

      if (settling && moveInRound === 3) {
        // board.postSettlement()
        settling = false
        buildings = roundBuildings(state.config, state.settlementRound)
        players = players.map((player) => ({
          ...player,
          settlements: roundSettlements(player.color, state.settlementRound),
        }))
        if (state.settlementRound === SettlementRound.E) {
          status = GameStatusEnum.FINISHED
          // TODO: push arm
        }

        round++
        moveInRound = 1
      } else if (!settling && moveInRound === 4) {
        // board.postRound
      }

      return {
        ...state,
        status,
        settling,
        moveInRound,
        activePlayerIndex,
        round,
        players,
      }
    })
    .with({ players: 2, length: 'short' }, (config) => (state: GameState) => {
      if (state.players === undefined) return undefined
      if (state.moveInRound === undefined) return undefined
      if (state.config === undefined) return undefined
      if (state.round === undefined) return undefined
      if (state.startingPlayer === undefined) return undefined

      let { buildings, players, startingPlayer, round, moveInRound, activePlayerIndex, settling, status } = state
      const { settlementRound } = state
      moveInRound++

      if (settling) {
        activePlayerIndex = (activePlayerIndex + 1) % state.players.length
        if (moveInRound > 2) {
          // board.postSettlement()
          settling = false
          buildings = roundBuildings(state.config, state.settlementRound)
          players = players.map((player) => ({
            ...player,
            settlements: roundSettlements(player.color, state.settlementRound),
          }))
          if (state.settlementRound === SettlementRound.E) {
            status = GameStatusEnum.FINISHED
            // TODO: push arm
          }
          round++
          moveInRound = 1
        }
      } else if (moveInRound > 2) {
        activePlayerIndex = (activePlayerIndex + 1) % state.players.length
        // TODO 2-player board.postRound()
        moveInRound = 1
        if (state.round === settlementOnRound(state.config, state.settlementRound)) {
          settling = true
        } else {
          round++
        }

        // begin 2-player end-game detection.
        if (!settling && state.settlementRound === SettlementRound.D && state.buildings.length <= 3) {
          status = GameStatusEnum.FINISHED
        }
        // end 2-player end-game detection.

        startingPlayer = (startingPlayer + 1) % state.players.length
      }

      return { ...state, buildings, players, round, moveInRound, activePlayerIndex, settlementRound, settling }
    })
    .with({ players: P.union(3, 4) }, () => (state: GameState) => {
      if (state.config === undefined) return undefined
      if (state.players === undefined) return undefined
      if (state.moveInRound === undefined) return undefined
      if (state.round === undefined) return undefined
      if (state.startingPlayer === undefined) return undefined

      let { status, players, buildings, round, settling, extraRound, activePlayerIndex, moveInRound, startingPlayer } =
        state
      activePlayerIndex = (activePlayerIndex + 1) % state.players.length
      moveInRound += 1

      if (extraRound && moveInRound === state.players.length + 1) {
        // board.postExtraRound()
        extraRound = false
        settling = true
        moveInRound = 1
      }

      if (moveInRound === state.players.length + 1 || settling) {
        // board.postSettlement()
        settling = false
        buildings = roundBuildings(state.config, state.settlementRound)
        players = players.map((player) => ({
          ...player,
          settlements: roundSettlements(player.color, state.settlementRound),
        }))
        if (state.settlementRound === SettlementRound.E) {
          status = GameStatusEnum.FINISHED
          // TODO: push arm
        }
        round++
        moveInRound = 1
      } else if (!settling && moveInRound === state.players.length) {
        // board.postRound()
        moveInRound = 1

        // if(isExtraRound(board.getRound())) {
        // if (false) {
        //   round += 1
        //   extraRound = true
        // }
        // // else if(board.isRoundBeforeSettlement(board.getRound())) {
        // else if (false) {
        //   settling = true
        // } else {
        round++
        // }

        // 5 -- pass starting player
        startingPlayer = (startingPlayer + 1) % state.players.length
      }

      return {
        ...state,
        status,
        round,
        settling,
        extraRound,
        activePlayerIndex,
        moveInRound,
        startingPlayer,
        buildings,
      }
    })
    .otherwise(() => () => undefined)
}

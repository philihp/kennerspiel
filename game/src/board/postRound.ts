import { match, P } from 'ts-pattern'
import { GameCommandConfigParams, GameStatePlaying, GameStatusEnum, PostRoundHandler, SettlementRound } from '../types'
import { isExtraRound } from './extraRound'
import { settlementOnRound } from './settlements'

export const postRound = (config: GameCommandConfigParams): PostRoundHandler =>
  match<GameCommandConfigParams, PostRoundHandler>(config)
    .with({ players: 1 }, () => (state: GameStatePlaying): GameStatePlaying | undefined => {
      if (state.frame.round === undefined) return undefined
      if (state.config === undefined) return undefined
      if (state.frame.startingPlayer === undefined) return undefined
      if (state.players === undefined) return undefined

      let {
        frame: { activePlayerIndex, moveInRound, extraRound, settling, round, startingPlayer },
      } = state
      moveInRound = 1

      if (isExtraRound(state.config, state.frame.round)) {
        round++
        extraRound = true
      } else if (state.frame.round === settlementOnRound(state.config, state.frame.settlementRound)) {
        // 			if(neutralPlayer.isClergymenAllPlaced())
        // 				neutralPlayer.resetClergymen();
        settling = true
        // TODO: neutralBuildingPhase = true
        activePlayerIndex = (activePlayerIndex + 1) % state.players.length
      } else {
        round++
      }

      // //5 -- pass starting player
      startingPlayer = (startingPlayer + 1) % state.players.length

      return {
        ...state,
        frame: {
          ...state.frame,
          moveInRound,
          extraRound,
          settling,
          activePlayerIndex,
          round,
          startingPlayer,
        },
      }
    })
    .with({ players: 2 }, () => (state: GameStatePlaying): GameStatePlaying | undefined => {
      if (state.frame.round === undefined) return undefined
      if (state.config === undefined) return undefined
      if (state.frame.startingPlayer === undefined) return undefined
      if (state.players === undefined) return undefined

      let {
        status,
        frame: { moveInRound, settling, round, startingPlayer },
      } = state
      moveInRound = 1
      if (state.frame.round === settlementOnRound(state.config, state.frame.settlementRound)) {
        settling = true
      } else {
        round++
      }

      // begin 2-player end-game detection.
      if (!settling && state.frame.settlementRound === SettlementRound.D && state.buildings.length <= 3) {
        status = GameStatusEnum.FINISHED
      }
      // end 2-player end-game detection.

      startingPlayer = (startingPlayer + 1) % state.players.length

      return {
        ...state,
        status,
        frame: {
          ...state.frame,
          moveInRound,
          settling,
          round,
          startingPlayer,
        },
      }
    })
    .with({ players: P.union(3, 4) }, () => (state: GameStatePlaying): GameStatePlaying | undefined => {
      if (state.frame.round === undefined) return undefined
      if (state.config === undefined) return undefined
      if (state.frame.startingPlayer === undefined) return undefined
      if (state.players === undefined) return undefined

      let {
        frame: { moveInRound, extraRound, settling, round, startingPlayer },
      } = state
      moveInRound = 1

      if (isExtraRound(state.config, state.frame.round)) {
        round++
        extraRound = true
      } else if (state.frame.round === settlementOnRound(state.config, state.frame.settlementRound)) {
        settling = true
      } else {
        round++
      }

      // //5 -- pass starting player
      startingPlayer = (startingPlayer + 1) % state.players.length

      return {
        ...state,
        frame: {
          ...state.frame,
          moveInRound,
          extraRound,
          settling,
          round,
          startingPlayer,
        },
      }
    })
    .exhaustive()

import { match, P } from 'ts-pattern'
import { GameCommandConfigParams, GameStatePlaying, PostMoveHandler } from '../types'

export const preRound = (config: GameCommandConfigParams): PostMoveHandler =>
  match<GameCommandConfigParams, PostMoveHandler>(config)
    .with({ length: 'short', players: P.union(3, 4) }, () => (state: GameStatePlaying) => ({
      ...state,
      players: state.players?.map((player) => {
        switch (state.turn.round) {
          case 1:
            return {
              ...player,
              sheep: player.sheep + 1,
              grain: player.grain + 1,
            }
          case 2:
            return {
              ...player,
              clay: player.clay + 1,
              grain: player.grain + 1,
            }
          case 3:
            return {
              ...player,
              wood: player.wood + 1,
              grain: player.grain + 1,
            }
          case 4:
            return {
              ...player,
              stone: player.stone + 1,
              grain: player.grain + 1,
            }
          case 5:
            return {
              ...player,
              stone: player.stone + 1,
              peat: player.peat + 1,
            }
          case 6:
            return {
              ...player,
              stone: player.stone + 1,
              clay: player.clay + 1,
            }
          case 7:
            return {
              ...player,
              stone: player.stone + 1,
              wood: player.wood + 1,
            }
          case 8:
            return {
              ...player,
              stone: player.stone + 1,
              nickel: player.nickel + 1,
            }
          case 9:
            return {
              ...player,
              stone: player.stone + 1,
              meat: player.meat + 1,
            }
          case 10:
            return {
              ...player,
              book: player.book + 1,
              grain: player.grain + 1,
            }
          case 11:
            return {
              ...player,
              clay: player.clay + 1,
              pottery: player.pottery + 1,
            }
          case 12:
            return {
              ...player,
              ornament: player.ornament + 1,
              wood: player.wood + 1,
            }
          default:
            return player
        }
      }),
    }))
    .otherwise(() => (state: GameStatePlaying) => state)

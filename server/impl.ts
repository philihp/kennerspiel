import { Methods, Context } from './.hathora/methods'
import { Response } from '../api/base'
import {
  GameStatus,
  Player,
  State,
  UserId,
  IInitializeRequest,
  IResetGameRequest,
  IMakeMoveRequest,
  IJoinGameRequest,
  IEndGameRequest,
  IStartGameRequest,
} from '../api/types'

type InternalState = State

export class Impl implements Methods<InternalState> {
  initialize(ctx: Context, request: IInitializeRequest): InternalState {
    return {
      status: GameStatus.SEATING,
      players: [],
      activePlayer: undefined,
      moves: [],
    }
  }

  resetGame(state: InternalState, userId: UserId, ctx: Context, request: IResetGameRequest): Response {
    if (state.status === GameStatus.STARTED) return Response.error('Cannot reset a game currently in progress')
    state.status = GameStatus.SEATING
    state.players = []
    state.activePlayer = undefined
    state.moves = []
    return Response.ok()
  }

  joinGame(state: State, userId: string, ctx: Context, request: IJoinGameRequest): Response {
    if (state.players.find((p) => p.id === userId)) {
      return Response.error('Already joined')
    }
    if (state.status === GameStatus.STARTED) {
      return Response.error('Game has started')
    }
    if (!state.players.some((player: Player) => player.color === request.color)) {
      state.players.push({ id: userId, color: request.color })
    }
    return Response.ok()
  }

  endGame(state: State, userId: string, ctx: Context, request: IEndGameRequest): Response {
    if (state.status === GameStatus.SEATING) {
      return Response.error('Game has not started yet.')
    }
    state.status = GameStatus.FINISHED
    return Response.ok()
  }

  startGame(state: State, userId: string, ctx: Context, request: IStartGameRequest): Response {
    if (state.status === GameStatus.STARTED) {
      return Response.error('Game has already started')
    }
    if (state.status === GameStatus.FINISHED) {
      return Response.error('Game has already finished')
    }
    state.status = GameStatus.STARTED
    return Response.ok()
  }

  makeMove(state: InternalState, userId: UserId, ctx: Context, request: IMakeMoveRequest): Response {
    state.moves.push(request.command)
    return Response.ok()
  }

  getUserState(state: InternalState, userId: UserId): State {
    return state
  }
}

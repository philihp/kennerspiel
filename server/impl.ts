import { Methods, Context } from "./.hathora/methods";
import { Response } from "../api/base";
import {
  GameStatus,
  Player,
  State,
  Color,
  UserId,
  IInitializeRequest,
  IResetGameRequest,
  IJoinGameRequest,
  IStartGameRequest,
  IEndGameRequest,
  IMakeMoveRequest,
} from "../api/types";

type InternalState = State;

export class Impl implements Methods<State> {
  initialize(ctx: Context, request: IInitializeRequest): State {
    return {
      status: GameStatus.SEATING,
      players: [],
      active: undefined,
      moves: [],
    }
  }

  resetGame(state: State, userId: UserId, ctx: Context, request: IResetGameRequest): Response {
    if (state.status === GameStatus.STARTED) return Response.error('Cannot reset a game currently in progress')
    state.status = GameStatus.SEATING
    state.players = []
    state.active = undefined
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
    if (state.players.some((player: Player) => player.color === request.color)) {
      return Response.error('Someone is already that color')
    }
    state.players.push({ id: userId, color: request.color, pending: [] })
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
    if (state.players.length === 0) {
      return Response.error('At least one player must join before the game can begin')
    }
    if (state.status === GameStatus.STARTED) {
      return Response.error('Game has already started')
    }
    if (state.status === GameStatus.FINISHED) {
      return Response.error('Game has already finished')
    }
    state.status = GameStatus.STARTED
    return Response.ok()
  }

  makeMove(state: State, userId: UserId, ctx: Context, request: IMakeMoveRequest): Response {
    const thisPlayer = state.players.find(({ id }) => id === userId)
    if (thisPlayer === undefined) {
      return Response.error(`${userId} is not a player of this game`)
    }
    thisPlayer.pending.push(request.command)
    return Response.ok()
  }

  getUserState(state: State, userId: UserId): State {
    return state
  }
}

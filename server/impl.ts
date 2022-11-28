import { Methods, Context } from './.hathora/methods'
import { Response } from '../api/base'
import {
  GameStatus,
  Player,
  State,
  UserId,
  IInitializeRequest,
  ICreateGameRequest,
  IMakeMoveRequest,
} from '../api/types'

type InternalState = State

export class Impl implements Methods<InternalState> {
  initialize(ctx: Context, request: IInitializeRequest): InternalState {
    return {
      players: [],
      activePlayer: undefined,
      moves: [],
    }
  }

  createGame(state: InternalState, userId: UserId, ctx: Context, request: ICreateGameRequest): Response {
    return Response.error('Not implemented')
  }

  makeMove(state: InternalState, userId: UserId, ctx: Context, request: IMakeMoveRequest): Response {
    state.moves.push(request.command)
    return Response.ok()
  }

  getUserState(state: InternalState, userId: UserId): State {
    return state
  }
}

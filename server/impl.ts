import { Methods, Context } from "./.hathora/methods";
import { Response } from "../api/base";
import {
  EngineStatus,
  Color,
  Country,
  Length,
  User,
  EngineState,
  UserId,
  IInitializeRequest,
  IJoinRequest,
  IConfigRequest,
  IStartRequest,
  IMoveRequest,
} from "../api/types";
import {
  GameState,
  GameCommandEnum,
  GameStatusEnum,
  GameConfigCountry
} from '../game/src/types'
import {
  reducer, initialState
} from '../game/src';

type InternalUser = {
  id: UserId
  color: Color
}

type InternalState = {
  game: GameState
  users: InternalUser[]
}

const engineStatusAdapter = (status: GameStatusEnum): EngineStatus => {
  switch(status) {
    case GameStatusEnum.SETUP:
      return EngineStatus.SETUP;
    case GameStatusEnum.PLAYING:
      return EngineStatus.PLAYING;
    case GameStatusEnum.FINISHED:
      return EngineStatus.FINISHED;
  }
}
export class Impl implements Methods<InternalState> {
  initialize(ctx: Context, request: IInitializeRequest): InternalState {
    return {
      game: initialState,
      users: []
    }
  }
  join(state: InternalState, userId: UserId, ctx: Context, request: IJoinRequest): Response {
    const { color } = request
    if(state.users.length >= 4) return Response.error("Game already has 4 players")
    if(state.users.filter(u => u.color === color).length > 0) return Response.error("Color already taken")
    state.users = state.users.filter(u => u.id !== userId).concat({
      id: userId, color
    })
    return Response.ok()
  }
  config(state: InternalState, userId: UserId, ctx: Context, request: IConfigRequest): Response {
    const players = `${state.users.length+1}`
    if(request.country !== Country.france) return Response.error('Only the France variant is implemented');
    const country = 'france'
    const length = request.length === Length.long ? 'long' : 'short'
    const newState = reducer(state.game, [GameCommandEnum.CONFIG, players, country, length])
    if(newState === undefined) return Response.error('Invalid config')
    state.game = newState
    return Response.ok()
  }
  start(state: InternalState, userId: UserId, ctx: Context, request: IStartRequest): Response {
    const seed = `${ctx.chance.natural({min: 1, max: 999999999})}`
    const colors = state.users.map(({color}) => {
      switch(color) {
        case Color.Red:
          return 'R'
        case Color.Blue:
          return 'B'
        case Color.Green:
          return 'G'
        case Color.White:
          return 'W'
      }
    })
    const command = [GameCommandEnum.START, seed, ...colors]
    const newState = reducer(state.game, command)
    if(newState === undefined) return Response.error(`Invalid command ${JSON.stringify(command, undefined, 2)}`)
    state.game = newState
    return Response.ok()
  }
  move(state: InternalState, userId: UserId, ctx: Context, request: IMoveRequest): Response {
    const command = request.command.split(/\s+/)
    const newState = reducer(state.game, command)
    if(newState === undefined) return Response.error(`Invalid command ${command}`)
    state.game = newState
    return Response.ok()
  }
  getUserState(state: InternalState, userId: UserId): EngineState {  
    return {
      users: state.users as User[],
      status: engineStatusAdapter(state.game.status),
      config: {
        country: Country.france,
        length: state.game.config?.length === 'short' ? Length.short : Length.long,
      },
      rondel: undefined, 
      wonders: undefined,
      players: undefined,
      neutralPlayer: undefined,
      buildings: [],
      plotPurchasePrices: [],
      districtPurchasePrices: [],
      frame: undefined
    }
  }
}
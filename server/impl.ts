import { Methods, Context } from "./.hathora/methods";
import { Response } from "../api/base";
import {
  EngineStatus,EngineTableau,
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
  reducer, initialState, GameState, Tableau, Tile
} from 'hathora-et-labora-game';

type InternalUser = {
  id: UserId
  color: Color
}

type InternalState = {
  game: GameState
  users: InternalUser[]
}

const statusDongle = (status: string): EngineStatus => {
  switch(status) {
    case 'SETUP':
      return EngineStatus.SETUP;
    case 'FINISHED':
      return EngineStatus.FINISHED;
    case 'PLAYING':
    default:
      return EngineStatus.PLAYING;
  }
}
const colorDongle = (color: string): Color => {
  switch(color) {
    case 'R':
      return Color.Red;
    case 'G':
      return Color.Green;
    case 'B':
      return Color.Blue;
    case 'W':
    default:
      return Color.White;
  }
}

const tileDongle = (tile: Tile): string[] => {
  return tile as string[]
}

const tableauDongle = (player: Tableau):EngineTableau => {
  return {
    ...player,
    color: colorDongle(player.color),
    landscape: player.landscape.map(
      (landscapeRow) => landscapeRow.map(tileDongle)
    )
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
    state.users = state.users.filter(u => u.id !== userId && u.color !== color).concat({
      id: userId, color
    })
    return Response.ok()
  }
  config(state: InternalState, userId: UserId, ctx: Context, request: IConfigRequest): Response {
    const players = `${state.users.length+1}`
    if(request.country !== Country.france) return Response.error('Only the France variant is implemented');
    const country = 'france'
    const length = request.length === Length.long ? 'long' : 'short'
    const newState = reducer(state.game, ['CONFIG', players, country, length])
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
    const command = ['START', seed, ...colors]
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
    if(state.game.status === 'PLAYING') {
      return {
        users: state.users as User[],
        status: statusDongle(state.game.status),
        config: {
          country: Country.france,
          length: state.game.config?.length === 'short' ? Length.short : Length.long,
          players: state.game.config?.players
        },
        rondel: state.game.rondel,
        wonders:state.game.wonders,
        players: state.game.players.map(tableauDongle),
        neutralPlayer: undefined,
        buildings: state.game.buildings,
        plotPurchasePrices: state.game.plotPurchasePrices,
        districtPurchasePrices: state.game.districtPurchasePrices,
        frame: state.game.frame
        // this game has fully open info, specifically, do not leak randGen...
        // currently it's just used for player order and neutral player color,
        // it is concievable that a new variant could have a stochastic element,
        // such as the stage cards in Agricola
      }
    }
    return {
      users: state.users as User[],
      status: statusDongle(state.game.status),
<<<<<<< Updated upstream
=======
      config: state.game.config && {
        country: Country.france,
        length: state.game.config?.length === 'short' ? Length.short : Length.long,
        players: state.users.length
      },
>>>>>>> Stashed changes
      buildings: [],
      plotPurchasePrices: [],
      districtPurchasePrices: [],
    }
  }
}

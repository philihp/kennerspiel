import { match } from 'ts-pattern'
import { GameCommandConfigParams, GameMode, GameState, PostRoundHandler, PreRoundHandler } from '../types'
import { postMove } from './postMove'
import { preMove } from './preMove'

export const preRound = (config: GameCommandConfigParams): PreRoundHandler => {
  return match<GameCommandConfigParams, PreRoundHandler>(config) // .
    .otherwise(() => (state: GameState) => state)
  // TODO: do all game types, and remove otherwise, add exhaustive
  // .exhaustive()
}

export const postRound = (config: GameCommandConfigParams): PostRoundHandler => {
  return match<GameCommandConfigParams, PostRoundHandler>(config) // .
    .otherwise(() => (state: GameState) => state)
  // TODO: do all game types, and remove otherwise, add exhaustive
  // .exhaustive()
}

export const mode = (config: GameCommandConfigParams): GameMode => ({
  preMove: preMove(config),
  postMove: postMove(config),
  preRound: preRound(config),
  postRound: postRound(config),
})

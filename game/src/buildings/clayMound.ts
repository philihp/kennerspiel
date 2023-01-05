import { getPlayer, setPlayer } from '../board/player'
import { take } from '../board/wheel'
import { GameStatePlaying, ResourceEnum } from '../types'

export const clayMound =
  (param = '') =>
  (state: GameStatePlaying | undefined): GameStatePlaying | undefined => {
    if (state === undefined) return undefined
    const rondel = { ...state.rondel }
    let tokenIndex = 0
    if (param.includes(ResourceEnum.Joker) && rondel.joker !== undefined) {
      tokenIndex = rondel.joker
      rondel.joker = rondel.pointingBefore
    } else {
      tokenIndex = rondel.clay ?? rondel.pointingBefore
      rondel.clay = rondel.pointingBefore
    }

    const takenValue = take(rondel.pointingBefore, tokenIndex, state.config)

    const oldPlayer = getPlayer(state)
    if (oldPlayer === undefined) return undefined
    const newPlayer = { ...oldPlayer, clay: oldPlayer.clay + takenValue }

    return {
      ...setPlayer(state, newPlayer),
      rondel,
    }
  }

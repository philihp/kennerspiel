import { getPlayer, setPlayer } from '../board/player'
import { take } from '../board/wheel'
import { UsageParamSingle, GameStatePlaying, ResourceEnum } from '../types'

export const farmyard =
  ({ param }: UsageParamSingle) =>
  (state: GameStatePlaying | undefined): GameStatePlaying | undefined => {
    if (param === undefined) return undefined
    if (state === undefined) return undefined
    const rondel = { ...state.rondel }
    let tokenIndex = 0
    if (param.includes(ResourceEnum.Joker) && rondel.joker !== undefined) {
      tokenIndex = rondel.joker
      rondel.joker = rondel.pointingBefore
    } else if (param.includes(ResourceEnum.Sheep) && rondel.sheep !== undefined) {
      tokenIndex = rondel.sheep
      rondel.sheep = rondel.pointingBefore
    } else if (param.includes(ResourceEnum.Grain) && rondel.grain !== undefined) {
      tokenIndex = rondel.grain
      rondel.grain = rondel.pointingBefore
    } else {
      return undefined
    }

    const takenValue = take(rondel.pointingBefore, tokenIndex, state.config)

    const oldPlayer = getPlayer(state)
    if (oldPlayer === undefined) return undefined
    const newPlayer = { ...oldPlayer }

    if (param.includes(ResourceEnum.Grain)) {
      newPlayer.grain += takenValue
    } else if (param.includes(ResourceEnum.Sheep)) {
      newPlayer.sheep += takenValue
    } else {
      return undefined
    }

    return {
      ...setPlayer(state, newPlayer),
      rondel,
    }
  }

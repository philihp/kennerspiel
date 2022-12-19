import { getActivePlayer, setActivePlayer } from '../board/player'
import { take } from '../board/wheel'
import { GameCommandUseParams, GameState, ResourceEnum } from '../types'

export const use = (state: GameState, { building, p1 }: GameCommandUseParams): GameState | undefined => {
  if (building === undefined) return undefined
  if (p1 === undefined) return undefined
  if (state.rondel === undefined) return undefined
  if (state.config === undefined) return undefined
  if (state.players === undefined) return undefined

  const rondel = { ...state.rondel }
  let tokenIndex = 0
  if (p1.includes(ResourceEnum.Joker) && rondel.joker !== undefined) {
    tokenIndex = rondel.joker
    rondel.joker = rondel.pointingBefore
  } else if (p1.includes(ResourceEnum.Sheep) && rondel.sheep !== undefined) {
    tokenIndex = rondel.sheep
    rondel.sheep = rondel.pointingBefore
  } else if (p1.includes(ResourceEnum.Grain) && rondel.grain !== undefined) {
    tokenIndex = rondel.grain
    rondel.grain = rondel.pointingBefore
  } else {
    return undefined
  }

  const takenValue = take(rondel.pointingBefore, tokenIndex, state.config)

  const oldPlayer = getActivePlayer(state)
  if (oldPlayer === undefined) return undefined
  const newPlayer = { ...oldPlayer }

  if (p1.includes(ResourceEnum.Grain)) {
    newPlayer.grain += takenValue
  } else if (p1.includes(ResourceEnum.Sheep)) {
    newPlayer.sheep += takenValue
  } else {
    return undefined
  }

  return setActivePlayer(state, newPlayer)
}

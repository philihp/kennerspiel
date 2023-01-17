import { getPlayer, setPlayer } from '../board/player'
import { parseResourceParam } from '../board/resource'
import { GameStatePlaying } from '../types'

export const windmill =
  (param = '') =>
  (state: GameStatePlaying | undefined): GameStatePlaying | undefined => {
    if (state === undefined) return undefined
    const iterations = Math.min(parseResourceParam(param).grain ?? 0, 7)
    const player = getPlayer(state)
    return setPlayer(state, {
      ...player,
      grain: player.grain - iterations,
      flour: player.flour + iterations,
      straw: player.straw + iterations,
    })
  }

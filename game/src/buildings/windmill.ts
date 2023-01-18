import { withActivePlayer } from '../board/player'
import { parseResourceParam } from '../board/resource'
import { GameStatePlaying } from '../types'

export const windmill = (param = '') => {
  const { grain = 0 } = parseResourceParam(param)
  const iterations = Math.min(grain, 7)
  return (state: GameStatePlaying | undefined): GameStatePlaying | undefined =>
    state &&
    withActivePlayer((player) => ({
      ...player,
      grain: player.grain - iterations,
      flour: player.flour + iterations,
      straw: player.straw + iterations,
    }))(state)
}

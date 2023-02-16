import { withActivePlayer } from '../board/player'
import { parseResourceParam } from '../board/resource'
import { StateReducer } from '../types'

export const windmill = (param = ''): StateReducer => {
  const { grain = 0 } = parseResourceParam(param)
  const iterations = Math.min(grain, 7)
  return (state) =>
    state &&
    withActivePlayer((player) => ({
      ...player,
      grain: player.grain - iterations,
      flour: player.flour + iterations,
      straw: player.straw + iterations,
    }))(state)
}

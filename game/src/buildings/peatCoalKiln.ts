import { withActivePlayer } from '../board/player'
import { parseResourceParam } from '../board/resource'
import { GameStatePlaying } from '../types'

export const peatCoalKiln = (param = '') => {
  const { peat = 0 } = parseResourceParam(param)
  return (state: GameStatePlaying | undefined): GameStatePlaying | undefined =>
    state &&
    withActivePlayer((player) => ({
      ...player,
      coal: player.coal + 1 + peat,
      peat: player.peat - peat,
      penny: player.penny + 1,
    }))(state)
}

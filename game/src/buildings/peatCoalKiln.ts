import { getPlayer, setPlayer } from '../board/player'
import { parseResourceParam } from '../board/resource'
import { GameStatePlaying } from '../types'

export const peatCoalKiln =
  (param = '') =>
  (state: GameStatePlaying | undefined): GameStatePlaying | undefined => {
    if (state === undefined) return undefined
    const inputs = parseResourceParam(param)
    const player = { ...getPlayer(state) }
    player.coal++
    player.penny++
    player.peat -= inputs.peat ?? 0
    player.coal += inputs.peat ?? 0
    return setPlayer(state, player)
  }

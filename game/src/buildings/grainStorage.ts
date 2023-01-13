import { getPlayer, setPlayer, subtractCoins } from '../board/player'
import { parseResourceParam, totalGoods, differentGoods, multiplyGoods, maskGoods } from '../board/resource'
import { Cost, GameStatePlaying } from '../types'

export const grainStorage =
  () =>
  (state: GameStatePlaying | undefined): GameStatePlaying | undefined => {
    if (state === undefined) return undefined
    const player = getPlayer(state)
    if (player.penny === 0 && player.nickel === 0 && player.wine === 0 && player.whiskey === 0) return undefined
    return setPlayer(state, {
      ...subtractCoins(1)(player),
      grain: player.grain + 6,
    })
  }

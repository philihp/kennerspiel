import { getCost, getPlayer, payCost, setPlayer, setPlayerCurried } from '../board/player'
import { parseResourceParam, totalGoods, differentGoods, multiplyGoods, maskGoods } from '../board/resource'
import { Cost, GameStatePlaying } from '../types'

export const cloisterGarden =
  (building = '') =>
  (state: GameStatePlaying | undefined): GameStatePlaying | undefined => {
    if (state === undefined) return undefined
    const player = getPlayer(state)
    return setPlayerCurried({
      ...player,
      grape: player.grape + 1,
    })(state)
  }

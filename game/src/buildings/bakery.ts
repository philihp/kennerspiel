import { pipe } from 'ramda'
import { withActivePlayer } from '../board/player'
import { canAfford, costEnergy, parseResourceParam } from '../board/resource'

export const bakery = (param = '') => {
  const { flour = 0, wood = 0, coal = 0, straw = 0, peat = 0, bread = 0 } = parseResourceParam(param)
  if (flour > costEnergy({ wood, coal, straw, peat }) / 0.5) return () => undefined
  return withActivePlayer(
    pipe(
      //
      canAfford({ flour, wood, coal, straw, peat, bread: bread - flour }),
      (player) => {
        if (player === undefined) return undefined
        return {
          ...player,
          flour: (player.flour ?? 0) - flour,
          coal: (player.coal ?? 0) - coal,
          wood: (player.wood ?? 0) - wood,
          peat: (player.peat ?? 0) - peat,
          straw: (player.straw ?? 0) - straw,
          bread: (player.bread ?? 0) + flour - bread,
          penny: (player.penny ?? 0) + ((Math.min(bread, 2) * 4) % 5),
          nickel: (player.nickel ?? 0) + Math.floor((Math.min(bread, 2) * 4) / 5),
        }
      }
    )
  )
}

import { pipe } from 'ramda'
import { getCost, payCost, withActivePlayer } from '../board/player'
import { canAfford, costEnergy, parseResourceParam } from '../board/resource'

export const bakery = (param = '') => {
  const { flour = 0, wood = 0, coal = 0, straw = 0, peat = 0, bread = 0 } = parseResourceParam(param)
  if (flour > costEnergy({ wood, coal, straw, peat }) / 0.5) return () => undefined
  return withActivePlayer(
    pipe(
      //
      canAfford({ flour, wood, coal, straw, peat, bread: bread - flour }),
      payCost({ flour, wood, coal, straw, peat }),
      getCost({ bread: flour }),
      payCost({ bread }),
      getCost({ penny: (Math.min(bread, 2) * 4) % 5, nickel: Math.floor((Math.min(bread, 2) * 4) / 5) })
    )
  )
}

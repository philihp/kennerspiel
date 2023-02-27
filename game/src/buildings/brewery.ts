import { pipe } from 'ramda'
import { getCost, payCost, withActivePlayer } from '../board/player'
import { canAfford, costEnergy, parseResourceParam } from '../board/resource'

export const brewery = (param = '') => {
  const { malt = 0, wood = 0, coal = 0, straw = 0, peat = 0, beer = 0 } = parseResourceParam(param)
  if (malt > costEnergy({ wood, coal, straw, peat }) / 0.5) return () => undefined
  return withActivePlayer(
    pipe(
      //
      canAfford({ malt, wood, coal, straw, peat, beer: beer - malt }),
      payCost({ malt, wood, coal, straw, peat }),
      getCost({ beer: malt }),
      payCost({ beer }),
      getCost({ penny: (Math.min(beer, 2) * 4) % 5, nickel: Math.floor((Math.min(beer, 2) * 4) / 5) })
    )
  )
}

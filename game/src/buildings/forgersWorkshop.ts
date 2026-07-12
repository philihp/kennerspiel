import { always, curry, identity, map, pipe, reverse, unnest, view } from 'ramda'
import { P, match } from 'ts-pattern'
import { activeLens, getCost, payCost, withActivePlayer } from '../board/player'
import { coinCostOptions, costMoney, parseResourceParam } from '../board/resource'
import { GameState } from '../types'

export const forgersWorkshop = (param = '') => {
  const input = parseResourceParam(param)
  const coins = costMoney(input)
  // 5 coins buy the 1st reliquary, 10 each additional (matching complete()'s
  // tiers). Bare use is a legal no-op; paying 1-4 coins buys nothing and is
  // rejected rather than granting floor((coins-5)/10) = -1 reliquaries.
  const reliquaries = coins >= 5 ? 1 + Math.floor((coins - 5) / 10) : 0
  if (coins === 0) return identity
  if (reliquaries === 0) return () => undefined
  return withActivePlayer(
    pipe(
      //
      payCost(input),
      getCost({ reliquary: reliquaries })
    )
  )
}

export const complete = curry((partial: string[], state: GameState): string[] =>
  match(partial)
    .with([], () => {
      const player = view(activeLens(state), state)
      // The rulebook lets you pay 5 coins for the 1st reliquary and 10 coins for each
      // additional one: 5->1, 15->2, 25->3, 35->4, ... Offer every affordable tier,
      // most expensive first (keeping the historical highest-cost-first ordering).
      const maxCoins = costMoney(player)
      const tiers: number[] = []
      for (let coins = 5; coins <= maxCoins; coins += 10) tiers.push(coins)
      return [...unnest(map((coins) => coinCostOptions(coins, player), reverse(tiers))), '']
    })
    .with([P._], always(['']))
    .otherwise(always([]))
)

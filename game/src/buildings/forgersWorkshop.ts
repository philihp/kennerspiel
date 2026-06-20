import { always, curry, map, pipe, reverse, unnest, view } from 'ramda'
import { P, match } from 'ts-pattern'
import { activeLens, getCost, payCost, withActivePlayer } from '../board/player'
import { coinCostOptions, costMoney, parseResourceParam } from '../board/resource'
import { GameState } from '../types'

export const forgersWorkshop = (param = '') => {
  const input = parseResourceParam(param)
  const coins = costMoney(input)
  return withActivePlayer(
    pipe(
      //
      payCost(input),
      getCost({ reliquary: coins >= 5 ? 1 : 0 }),
      getCost({ reliquary: Math.floor((coins - 5) / 10) })
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

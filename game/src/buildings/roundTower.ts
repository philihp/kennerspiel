import { always, curry, identity, map, pipe, unnest, view } from 'ramda'
import { P, match } from 'ts-pattern'
import { activeLens, getWonder, payCost, withActivePlayer } from '../board/player'
import { coinCostOptions, costPoints, parseResourceParam, pointCostOptions } from '../board/resource'
import { removeWonder } from '../board/state'
import { CostReducer, GameStatePlaying, ResourceEnum } from '../types'

const removeWhiskey: CostReducer = (cost) => {
  if (!cost) return undefined
  if (!cost.whiskey) return undefined
  return {
    ...cost,
    whiskey: cost.whiskey - 1,
  }
}

const removeFiveCoins: CostReducer = (cost) => {
  if (!cost) return undefined
  if ((cost.penny ?? 0) >= 5)
    return {
      ...cost,
      penny: (cost.penny ?? 0) - 5,
    }
  if ((cost.nickel ?? 0) >= 1)
    return {
      ...cost,
      nickel: (cost.nickel ?? 0) - 1,
    }
  return undefined
}

export const roundTower = (param = '') => {
  const rawInput = parseResourceParam(param)
  const input = pipe(
    //
    removeWhiskey,
    removeFiveCoins
  )(rawInput)
  if (!input || costPoints(input) < 14) return identity
  return pipe(
    withActivePlayer(
      pipe(
        //
        payCost(rawInput),
        getWonder()
      )
    ),
    removeWonder
  )
}

export const complete = curry((partial: string[], state: GameStatePlaying): string[] =>
  match(partial)
    .with([], () => {
      const player = view(activeLens(state), state)
      if (!player.whiskey) return ['']

      // 1st: just remove the whiskey
      const paidWhiskey = payCost({ whiskey: 1 })(player)

      // 2nd: find all the ways, without that whiskey, to pay 5 coins
      const waysToPayCoins = coinCostOptions(5)(paidWhiskey)

      // 3rd: with each of those ways, find all the ways to make 14 points
      const waysToMakePoints = map((wayToPayCoin: string): string[] => {
        const paidCoins = payCost(parseResourceParam(wayToPayCoin))(paidWhiskey)
        const waysToPayPoints = pointCostOptions(14)(paidCoins)
        return map(
          (wayToPayPoints: string): string => `${wayToPayCoin}${ResourceEnum.Whiskey}${wayToPayPoints}`,
          waysToPayPoints
        )
      }, waysToPayCoins)

      return [...unnest(waysToMakePoints), '']
    })
    .with([P._], always(['']))
    .otherwise(always([]))
)

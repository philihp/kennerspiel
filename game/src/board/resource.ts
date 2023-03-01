import { match, P } from 'ts-pattern'
import { Cost, ResourceEnum, Tableau } from '../types'

function* resourceSlicer(s: string): Generator<ResourceEnum> {
  for (let i = 0; i + 1 < s.length; i += 2) {
    yield s.slice(i, i + 2) as ResourceEnum
  }
}

const add = (resource: keyof Cost, cost: Cost) => () => {
  cost[resource] = 1 + (cost[resource] ?? 0)
}

export const parseResourceParam: (p?: string) => Cost = (p) => {
  const cost: Cost = {}
  if (p === undefined) return cost
  for (const r of resourceSlicer(p)) {
    match<ResourceEnum | 'Po' | 'Ho', void>(r)
      .with(ResourceEnum.Wood, add('wood', cost))
      .with(ResourceEnum.Whiskey, add('whiskey', cost))
      .with(ResourceEnum.Grain, add('grain', cost))
      .with(ResourceEnum.Straw, add('straw', cost))
      .with(ResourceEnum.Sheep, add('sheep', cost))
      .with(ResourceEnum.Meat, add('meat', cost))
      .with(ResourceEnum.Clay, add('clay', cost))
      .with('Po', add('ceramic', cost))
      .with(ResourceEnum.Ceramic, add('ceramic', cost))
      .with(ResourceEnum.Peat, add('peat', cost))
      .with(ResourceEnum.Coal, add('coal', cost))
      .with(ResourceEnum.Penny, add('penny', cost))
      .with(ResourceEnum.Book, add('book', cost))
      .with(ResourceEnum.Stone, add('stone', cost))
      .with(ResourceEnum.Ornament, add('ornament', cost))
      .with(ResourceEnum.Flour, add('flour', cost))
      .with(ResourceEnum.Bread, add('bread', cost))
      .with(ResourceEnum.Grape, add('grape', cost))
      .with(ResourceEnum.Wine, add('wine', cost))
      .with(ResourceEnum.Nickel, add('nickel', cost))
      .with(ResourceEnum.Reliquary, add('reliquary', cost))
      .with('Ho', add('malt', cost))
      .with(ResourceEnum.Malt, add('malt', cost))
      .with(ResourceEnum.Beer, add('beer', cost))
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      .with(ResourceEnum.BonusPoint, () => {})
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      .with(ResourceEnum.Joker, () => {})
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      .otherwise(() => {})
  }
  return cost
}

export const differentGoods = (cost: Cost) => Object.keys(cost).filter((k) => cost[k as keyof Cost] ?? 0 >= 1).length

export const totalGoods = (cost: Cost) => Object.keys(cost).reduce((sum, k) => sum + (cost[k as keyof Cost] ?? 0), 0)

export const multiplyGoods = (by: number) => (cost: Cost) =>
  Object.keys(cost).reduce(
    (cost, k) => {
      const c = cost[k as keyof Cost]
      if (c !== undefined) {
        cost[k as keyof Cost] = c * by
      }
      return cost
    },
    { ...cost }
  )

export const maskGoods =
  (goods: (keyof Cost)[]) =>
  (cost: Cost): Cost =>
    goods.reduce((outCost, key) => {
      if (cost[key]) outCost[key] = cost[key]
      return outCost
    }, {} as Cost)

export const costMoney = ({ penny = 0, nickel = 0, wine = 0, whiskey = 0 }): number =>
  penny + 5 * nickel + wine + 2 * whiskey

export const costEnergy = ({ coal = 0, peat = 0, wood = 0, straw = 0 }) => coal * 3 + peat * 2 + wood + straw * 0.5

export const costFood = ({
  penny = 0,
  grain = 0,
  sheep = 0,
  flour = 0,
  grape = 0,
  nickel = 0,
  malt = 0,
  whiskey = 0,
  meat = 0,
  bread = 0,
  wine = 0,
  beer = 0,
}) =>
  grain +
  2 * sheep +
  flour +
  grape +
  malt +
  5 * meat +
  3 * bread +
  5 * beer +
  costMoney({ penny, nickel, wine, whiskey })

export const costPoints = ({ nickel = 0, whiskey = 0, ceramic = 0, book = 0, reliquary = 0, ornament = 0, wine = 0 }) =>
  2 * nickel + 1 * whiskey + 3 * ceramic + 2 * book + 8 * reliquary + 4 * ornament + 1 * wine

export const canAfford =
  (cost: Cost) =>
  (player: Tableau): Tableau | undefined =>
    Object.entries(cost).every(([type, amountNeeded]) => player[type as keyof Tableau] >= amountNeeded)
      ? player
      : undefined

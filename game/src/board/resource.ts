import { match } from 'ts-pattern'
import { any, curry, keys, join, lift, map, pipe, range, reduce, repeat, addIndex } from 'ramda'
import { Cost, ResourceEnum, SettlementCost, Tableau } from '../types'

export const allResource: [key: keyof Cost, token: string][] = [
  ['peat', ResourceEnum.Peat],
  ['penny', ResourceEnum.Penny],
  ['grain', ResourceEnum.Grain],
  ['clay', ResourceEnum.Clay],
  ['wood', ResourceEnum.Wood],
  ['sheep', ResourceEnum.Sheep],
  ['stone', ResourceEnum.Stone],
  ['flour', ResourceEnum.Flour],
  ['grape', ResourceEnum.Grape],
  ['nickel', ResourceEnum.Nickel],
  ['malt', ResourceEnum.Malt],
  ['coal', ResourceEnum.Coal],
  ['book', ResourceEnum.Book],
  ['ceramic', ResourceEnum.Ceramic],
  ['whiskey', ResourceEnum.Whiskey],
  ['straw', ResourceEnum.Straw],
  ['meat', ResourceEnum.Meat],
  ['ornament', ResourceEnum.Ornament],
  ['bread', ResourceEnum.Bread],
  ['wine', ResourceEnum.Wine],
  ['beer', ResourceEnum.Beer],
  ['reliquary', ResourceEnum.Reliquary],
]

export const combinations = (maxLength: number, tokens: string[], prefix = [] as string[]): string[] => {
  if (prefix.length >= maxLength) {
    if (prefix.length === 0) return []
    return [join('', prefix)]
  }
  return addIndex(reduce<string, string[]>)(
    (accum: string[], item: string, ndx: number): string[] => {
      accum.push(...combinations(maxLength, tokens.slice(ndx + 1), [...prefix, item]))
      return accum
    },
    [] as string[],
    tokens
  )
}

function* resourceSlicer(s: string): Generator<ResourceEnum> {
  for (let i = 0; i + 1 < s.length; i += 2) {
    yield s.slice(i, i + 2) as ResourceEnum
  }
}

const addRes = (resource: keyof Cost, cost: Cost) => () => {
  cost[resource] = 1 + (cost[resource] ?? 0)
}

export const parseResourceParam: (p?: string) => Cost = (p) => {
  const cost: Cost = {}
  if (p === undefined) return cost
  for (const r of resourceSlicer(p)) {
    match<ResourceEnum | 'Po' | 'Ho', void>(r)
      .with(ResourceEnum.Wood, addRes('wood', cost))
      .with(ResourceEnum.Whiskey, addRes('whiskey', cost))
      .with(ResourceEnum.Grain, addRes('grain', cost))
      .with(ResourceEnum.Straw, addRes('straw', cost))
      .with(ResourceEnum.Sheep, addRes('sheep', cost))
      .with(ResourceEnum.Meat, addRes('meat', cost))
      .with(ResourceEnum.Clay, addRes('clay', cost))
      .with('Po', addRes('ceramic', cost))
      .with(ResourceEnum.Ceramic, addRes('ceramic', cost))
      .with(ResourceEnum.Peat, addRes('peat', cost))
      .with(ResourceEnum.Coal, addRes('coal', cost))
      .with(ResourceEnum.Penny, addRes('penny', cost))
      .with(ResourceEnum.Book, addRes('book', cost))
      .with(ResourceEnum.Stone, addRes('stone', cost))
      .with(ResourceEnum.Ornament, addRes('ornament', cost))
      .with(ResourceEnum.Flour, addRes('flour', cost))
      .with(ResourceEnum.Bread, addRes('bread', cost))
      .with(ResourceEnum.Grape, addRes('grape', cost))
      .with(ResourceEnum.Wine, addRes('wine', cost))
      .with(ResourceEnum.Nickel, addRes('nickel', cost))
      .with(ResourceEnum.Reliquary, addRes('reliquary', cost))
      .with('Ho', addRes('malt', cost))
      .with(ResourceEnum.Malt, addRes('malt', cost))
      .with(ResourceEnum.Beer, addRes('beer', cost))
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      .with(ResourceEnum.BonusPoint, () => {})
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      .with(ResourceEnum.Joker, () => {})
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      .otherwise(() => {})
  }
  return cost
}

const stringRepeater = curry((repeated: string, count: number): string => pipe(repeat(repeated), join(''))(count))

type Tracer = [resources: string, foodNeeded: number]

const amountCostOptions =
  (outputs: string[], token: string, foodValue: number, totalCount: number) =>
  (incompletes: Tracer[]): Tracer[] =>
    reduce(
      (accum, prevTrace) => {
        const [prevPrefix, prevFood] = prevTrace
        map((numSheep) => {
          const nextFood = prevFood - numSheep * foodValue
          const nextPrefix = `${prevPrefix}${stringRepeater(token, numSheep)}`
          if (nextFood <= 0) {
            outputs.push(nextPrefix)
          } else {
            accum.push([nextPrefix, nextFood])
          }
        }, range(0, Math.min(totalCount, prevFood / foodValue) + 1))
        return accum
      },
      [] as Tracer[],
      incompletes
    )

export const foodCostOptions = (food: number, player: Cost): string[] => {
  const output: string[] = []
  pipe(
    // first try eating the big stuff, which is most likely food
    amountCostOptions(output, 'Mt', 5, player.meat ?? 0),
    amountCostOptions(output, 'Be', 5, player.beer ?? 0),
    amountCostOptions(output, 'Br', 3, player.bread ?? 0),
    amountCostOptions(output, 'Sh', 2, player.sheep ?? 0),
    // try eating small food, raw stuff first
    amountCostOptions(output, 'Gn', 1, player.grain ?? 0),
    amountCostOptions(output, 'Fl', 1, player.flour ?? 0),
    amountCostOptions(output, 'Ma', 1, player.malt ?? 0),
    amountCostOptions(output, 'Gp', 1, player.grape ?? 0),
    // then try eating money, which they might be saving for land
    amountCostOptions(output, 'Ni', 1, player.nickel ?? 0),
    amountCostOptions(output, 'Pn', 1, player.penny ?? 0),
    // then try eating wine/whiskey, which has more utility than money
    amountCostOptions(output, 'Wn', 1, player.wine ?? 0),
    amountCostOptions(output, 'Wh', 1, player.whiskey ?? 0)
  )([['', food]])
  return output
}

export const energyCostOptions = (energy: number, player: Cost): string[] => {
  const output: string[] = []
  pipe(
    // first try eating the big stuff, which is most likely energy
    amountCostOptions(output, 'Co', 3, player.coal ?? 0),
    amountCostOptions(output, 'Pt', 2, player.peat ?? 0),
    amountCostOptions(output, 'Wo', 1, player.wood ?? 0),
    amountCostOptions(output, 'St', 0.5, player.straw ?? 0)
  )([['', energy]])
  return output
}

export const settlementCostOptions = curry(({ food, energy }: SettlementCost, player: Cost): string[] =>
  lift((foodPayment, energyPayment) => `${foodPayment}${energyPayment}`)(
    foodCostOptions(food, player),
    energyCostOptions(energy, player)
  )
)

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

export const settlementCost = (cost: Cost): SettlementCost => ({
  food: costFood(cost),
  energy: costEnergy(cost),
})

export const canAfford =
  (cost: Cost) =>
  (player: Tableau): Tableau | undefined =>
    any<keyof Cost>(
      //
      (key) => player[key] >= (cost[key] ?? 0),
      keys(cost)
    )
      ? player
      : undefined

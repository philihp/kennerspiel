import { match } from 'ts-pattern'
import {
  any,
  curry,
  keys,
  join,
  lift,
  map,
  pipe,
  range,
  reduce,
  repeat,
  addIndex,
  min,
  add,
  reverse,
  zipWith,
  zip,
  uniq,
  comparator,
  sort,
} from 'ramda'
import { Cost, ResourceEnum, SettlementCost, Tableau } from '../types'

export const basicResources = [
  ResourceEnum.Peat,
  ResourceEnum.Sheep,
  ResourceEnum.Wood,
  ResourceEnum.Clay,
  ResourceEnum.Penny,
  ResourceEnum.Grain,
]

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

export const stringRepeater = curry((repeated: string, count: number): string =>
  pipe(repeat(repeated), join(''))(count)
)

export const resourceArray = (resource: ResourceEnum, maxAmount = Infinity) =>
  pipe(
    //
    min(maxAmount),
    add(1),
    range(0),
    reverse<number>,
    map<number, string>(stringRepeater(resource))
  )

// would have been nice if zip took > 2 arrays
export const zip3 = (arrA: string[], arrB: string[], arrC: string[]): string[] =>
  zipWith<[string, string], string, string>(([a, b], c) => a + b + c)(zip(arrA, arrB), arrC)

type Tracer = [resources: string, amount: number]

const amountCostOptions =
  (outputs: string[], token: string, foodValue: number, totalCount: number) =>
  (incompletes: Tracer[]): Tracer[] =>
    reduce(
      (accum, prevTrace) => {
        const [prevPrefix, prevFood] = prevTrace
        map(
          (numSheep) => {
            const nextFood = prevFood - numSheep * foodValue
            const nextPrefix = `${prevPrefix}${stringRepeater(token, numSheep)}`
            if (nextFood <= 0) {
              outputs.push(nextPrefix)
            } else {
              accum.push([nextPrefix, nextFood])
            }
          },
          range(0, Math.min(totalCount, prevFood / foodValue) + 1)
        )
        return accum
      },
      [] as Tracer[],
      incompletes
    )

const rewardOptions =
  (outputs: string[], token: string, points: number, pointsNext: number) =>
  (incompletes: Tracer[]): Tracer[] => {
    return reduce(
      (accum, prevTrace) => {
        const [prevPrefix, prevFood] = prevTrace
        map(
          (numSheep) => {
            const nextFood = prevFood - numSheep * points
            const nextPrefix = `${prevPrefix}${stringRepeater(token, numSheep)}`
            if (nextFood >= 0) {
              outputs.push(nextPrefix)
            }
            if (nextFood >= pointsNext) {
              accum.push([nextPrefix, nextFood])
            }
          },
          reverse(range(0, 1 + Math.floor(prevFood / points)))
        )
        return accum
      },
      [] as Tracer[],
      incompletes
    )
  }

export const foodCostOptions = curry((food: number, player: Cost): string[] => {
  const output: string[] = []
  pipe(
    // first try eating the big stuff, which is most likely food
    amountCostOptions(output, ResourceEnum.Meat, 5, player.meat ?? 0),
    amountCostOptions(output, ResourceEnum.Beer, 5, player.beer ?? 0),
    amountCostOptions(output, ResourceEnum.Bread, 3, player.bread ?? 0),
    amountCostOptions(output, ResourceEnum.Sheep, 2, player.sheep ?? 0),
    // try eating small food, raw stuff first
    amountCostOptions(output, ResourceEnum.Grain, 1, player.grain ?? 0),
    amountCostOptions(output, ResourceEnum.Flour, 1, player.flour ?? 0),
    amountCostOptions(output, ResourceEnum.Malt, 1, player.malt ?? 0),
    amountCostOptions(output, ResourceEnum.Grape, 1, player.grape ?? 0),
    // then try eating money, which they might be saving for land
    amountCostOptions(output, ResourceEnum.Nickel, 5, player.nickel ?? 0),
    amountCostOptions(output, ResourceEnum.Penny, 1, player.penny ?? 0),
    // then try eating wine/whiskey, which has more utility than money
    amountCostOptions(output, ResourceEnum.Wine, 1, player.wine ?? 0),
    amountCostOptions(output, ResourceEnum.Whiskey, 2, player.whiskey ?? 0)
  )([['', food]])
  return output
})

export const energyCostOptions = curry((energy: number, player: Cost): string[] => {
  const output: string[] = []
  pipe(
    // first try eating the big stuff, which is most likely energy
    amountCostOptions(output, ResourceEnum.Coal, 3, player.coal ?? 0),
    amountCostOptions(output, ResourceEnum.Peat, 2, player.peat ?? 0),
    amountCostOptions(output, ResourceEnum.Wood, 1, player.wood ?? 0),
    amountCostOptions(output, ResourceEnum.Straw, 0.5, player.straw ?? 0)
  )([['', energy]])
  return output
})

export const coinCostOptions = curry((coins: number, player: Cost): string[] => {
  const output: string[] = []
  pipe(
    amountCostOptions(output, ResourceEnum.Nickel, 5, player.nickel ?? 0),
    amountCostOptions(output, ResourceEnum.Penny, 1, player.penny ?? 0),
    amountCostOptions(output, ResourceEnum.Whiskey, 2, player.whiskey ?? 0),
    amountCostOptions(output, ResourceEnum.Wine, 1, player.wine ?? 0)
  )([['', coins]])
  return output
})

export const pointCostOptions = curry((points: number, player: Cost): string[] => {
  const output: string[] = []
  pipe(
    amountCostOptions(output, ResourceEnum.Reliquary, 8, player.reliquary ?? 0),
    amountCostOptions(output, ResourceEnum.Ornament, 4, player.ornament ?? 0),
    amountCostOptions(output, ResourceEnum.Ceramic, 3, player.ceramic ?? 0),
    amountCostOptions(output, ResourceEnum.Book, 2, player.book ?? 0),
    amountCostOptions(output, ResourceEnum.Nickel, 2, player.nickel ?? 0),
    amountCostOptions(output, ResourceEnum.Whiskey, 1, player.whiskey ?? 0),
    amountCostOptions(output, ResourceEnum.Wine, 1, player.wine ?? 0)
  )([['', points]])
  return output
})

export const concatStr = (a: string, b: string): string => `${a}${b}`

export const settlementCostOptions = curry(({ food, energy }: SettlementCost, player: Cost): string[] =>
  lift(concatStr)(foodCostOptions(food, player), energyCostOptions(energy, player))
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
      (key) => {
        return player[key] < (cost[key] ?? 0)
      },
      keys(cost)
    )
      ? undefined
      : player

const byPoints = comparator<string>((a: string, b: string) => {
  return costPoints(parseResourceParam(a)) > costPoints(parseResourceParam(b))
})

export const rewardCostOptions = curry((totalPoints: number): string[] => {
  // this one is different because we want our output to be <= points, and cannot
  // give the player money or whiskey/wine, but also there's an infinite amount of
  // each thing they can get, so that's nice
  const output: string[] = []
  pipe(
    rewardOptions(output, ResourceEnum.Reliquary, 8, 4),
    rewardOptions(output, ResourceEnum.Ornament, 4, 3),
    rewardOptions(output, ResourceEnum.Ceramic, 3, 2),
    rewardOptions(output, ResourceEnum.Book, 2, Infinity)
  )([['', totalPoints]])
  return uniq(sort(byPoints, output))
})

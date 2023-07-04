import { __, add, always, ap, concat, curry, map, min, multiply, pipe, range, reverse, unnest, view } from 'ramda'
import { P, match } from 'ts-pattern'
import { activeLens, getCost, payCost, withActivePlayer } from '../board/player'
import { canAfford, costEnergy, energyCostOptions, parseResourceParam, stringRepeater } from '../board/resource'
import { GameStatePlaying } from '../types'

export const bakery = (param = '') => {
  // parse the input string and create variables for each resource, defaulting to 0 if none
  const { flour = 0, wood = 0, coal = 0, straw = 0, peat = 0, bread = 0 } = parseResourceParam(param)

  // total up all the energy, divide by 1/2, and if they are sending in more flour than that
  if (flour > costEnergy({ wood, coal, straw, peat }) / 0.5) return always(undefined)
  return withActivePlayer(
    pipe(
      // make sure the player has this much stuff (for bread, reduce that amount by the number of flour)
      canAfford({ flour, wood, coal, straw, peat, bread: bread - flour }),

      // remove all of the stuff from the player, except bread
      payCost({ flour, wood, coal, straw, peat }),

      // then give them n bread, where n is the amount of flour
      getCost({ bread: flour }),

      // then take away how many breads they sent in as input
      payCost({ bread }),

      // and give them 4 coins per bread
      getCost({ penny: (Math.min(bread, 2) * 4) % 5, nickel: Math.floor((Math.min(bread, 2) * 4) / 5) })
    )
  )
}

export const complete = curry((partial: string[], state: GameStatePlaying): string[] =>
  match(partial)
    .with([], () => {
      const player = view(activeLens(state), state)
      const { flour = 0, wood = 0, coal = 0, straw = 0, peat = 0, bread = 0 } = player

      // step 1: figure out how many times we might send in flour, given flour and energy constraint
      const flourAmounts: number[] = pipe(
        costEnergy,
        multiply(2),
        Math.ceil,
        min(flour),
        add(1),
        range(0),
        reverse<number>
      )(player)

      // step 2: for each amount of flour to use up, multiply by ways of getting that energy
      const paymentAmounts = unnest(
        map<number, [number, string][]>(
          (flourAmount): [number, string][] =>
            map(
              (s: string): [number, string] => [bread + flourAmount, s],
              ap<string, string>(
                [concat<string>(stringRepeater('Fl', flourAmount))],
                energyCostOptions(flourAmount / 2, { coal, peat, wood, straw })
              )
            ),
          flourAmounts
        )
      )

      const consumeBreadAmounts = unnest(
        map(
          ([sellableBread, resourceString]) =>
            pipe(
              //
              min<number>(2),
              add(1),
              range(0),
              reverse<number>,
              ap([stringRepeater('Br')]),
              map((s) => resourceString + s)
            )(sellableBread),
          paymentAmounts
        )
      )

      return consumeBreadAmounts
    })
    .with([P._], always(['']))
    .otherwise(always([]))
)

import { compose, filter, fromPairs, map, pipe, toPairs, transduce, zip } from 'ramda'
import { pointille } from 'pointille'
import { match } from 'ts-pattern'
import { GameCommandConfigParams, Rondel } from 'hathora-et-labora-game'

export type TokenKey = 'clay' | 'coin' | 'grain' | 'grape' | 'joker' | 'peat' | 'sheep' | 'stone' | 'wood'

export const allTokenKeys: TokenKey[] = ['clay', 'coin', 'grain', 'grape', 'joker', 'peat', 'sheep', 'stone', 'wood']

export const TOKEN_INNER_RADIUS = 65
export const TOKEN_OUTER_RADIUS = 175

const N_WEDGES = 13

const wedgePoint = (n: number, radius: number): [number, number] => [
  -Math.sin((n * Math.PI * 2) / N_WEDGES) * radius,
  -Math.cos((n * Math.PI * 2) / N_WEDGES) * radius,
]

export const isStoneUsed = (config: GameCommandConfigParams): boolean =>
  match(config)
    .with({ players: 1 }, () => false)
    .otherwise(() => true)

export const isGrapeUsed = (config: GameCommandConfigParams): boolean =>
  match(config)
    .with({ players: 1 }, () => false)
    .with({ country: 'france' }, () => true)
    .otherwise(() => false)

export const getWedgePolygon = (pos: number): [number, number][] => {
  const a = pos % N_WEDGES
  const b = (pos + 1) % N_WEDGES
  return [
    wedgePoint(a, TOKEN_INNER_RADIUS),
    wedgePoint(a, TOKEN_OUTER_RADIUS),
    wedgePoint(b, TOKEN_OUTER_RADIUS),
    wedgePoint(b, TOKEN_INNER_RADIUS),
  ]
}

export const computeTokenPositions = (
  rondel: Rondel,
  config: GameCommandConfigParams
): Partial<Record<TokenKey, [number, number]>> =>
  pipe(
    (keys: TokenKey[]) =>
      transduce(
        // Compose filter and map as transducers. In compose(A, B), A wraps B so A
        // processes data first — filter here is A, meaning it runs before map.
        // Cast to any: Ramda's TS types don't model the transducer overload of compose.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (compose as any)(
          filter(
            (key: TokenKey): boolean =>
              rondel[key] !== undefined &&
              !(key === 'grape' && !isGrapeUsed(config)) &&
              !(key === 'stone' && !isStoneUsed(config))
          ),
          map((key: TokenKey): [TokenKey, number] => [key, rondel[key]!])
        ),
        (acc: Record<string, TokenKey[]>, [key, pos]: [TokenKey, number]) => ({
          ...acc,
          [pos]: [...(acc[pos] ?? []), key],
        }),
        {} as Record<string, TokenKey[]>,
        keys
      ),
    toPairs as (x: Record<string, TokenKey[]>) => [string, TokenKey[]][],
    (pairs: [string, TokenKey[]][]) =>
      transduce(
        map(([posStr, tokens]: [string, TokenKey[]]) =>
          zip(tokens, pointille(getWedgePolygon(Number(posStr)), tokens.length)) as [TokenKey, [number, number]][]
        ),
        (acc: Partial<Record<TokenKey, [number, number]>>, pts: [TokenKey, [number, number]][]) => ({
          ...acc,
          ...fromPairs(pts),
        }),
        {} as Partial<Record<TokenKey, [number, number]>>,
        pairs
      )
  )(allTokenKeys) as Partial<Record<TokenKey, [number, number]>>

import { match, P } from 'ts-pattern'
import {
  GameAction,
  GameActionUndefined,
  GameCommandEnum,
  GameConfigCountry,
  GameConfigLength,
  GameConfigPlayers,
  Parser,
  PlayerColor,
} from './types'

const PColor = P.union(PlayerColor.Blue, PlayerColor.White, PlayerColor.Red, PlayerColor.Green)

export const parser: Parser = (unparsedAction) =>
  match<string[], GameAction>(unparsedAction)
    .with([GameCommandEnum.COMMIT], () => ({ command: GameCommandEnum.COMMIT }))
    .with(
      [GameCommandEnum.CONFIG, P.union('1', '2', '3', '4'), P.union('ireland', 'france'), P.union('short', 'long')],
      ([_, players, country, length]) => ({
        command: GameCommandEnum.CONFIG,
        params: {
          players: Number.parseInt(players, 10) as GameConfigPlayers,
          length: length as GameConfigLength,
          country: country as GameConfigCountry,
        },
      })
    )
    .with(
      [GameCommandEnum.START, P.string, PColor],
      [GameCommandEnum.START, P.string, PColor, PColor],
      [GameCommandEnum.START, P.string, PColor, PColor, PColor],
      [GameCommandEnum.START, P.string, PColor, PColor, PColor, PColor],
      ([_, unparsedSeed, ...colors]) => {
        const seed = Number.parseInt(unparsedSeed, 10)
        if (Number.isNaN(seed)) return undefined
        return {
          command: GameCommandEnum.START,
          params: {
            seed,
            colors: colors as PlayerColor[],
          },
        }
      }
    )
    .otherwise((p) => undefined as GameActionUndefined)

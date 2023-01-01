import { match, P } from 'ts-pattern'
import { commit } from './commands/commit'
import { config } from './commands/config'
import { cutPeat } from './commands/cutPeat'
import { start } from './commands/start'
import {
  GameCommandEnum,
  GameConfigCountry,
  GameConfigLength,
  GameConfigPlayers,
  GameState,
  GameStatePlaying,
  GameStateSetup,
  GameStatusEnum,
  PlayerColor,
  Reducer,
} from './types'

export const initialState: GameStateSetup = {
  randGen: 0n,
  status: GameStatusEnum.SETUP,
}

const PColor = P.union(PlayerColor.Blue, PlayerColor.White, PlayerColor.Red, PlayerColor.Green)

export const reducer: Reducer = (state, action) =>
  match<string[], GameState | undefined>(action) // .
    .with(
      [GameCommandEnum.CONFIG, P.union('1', '2', '3', '4'), P.union('ireland', 'france'), P.union('short', 'long')],
      ([_, players, country, length]) =>
        config(state as GameStateSetup, {
          players: Number.parseInt(players, 10) as GameConfigPlayers,
          length: length as GameConfigLength,
          country: country as GameConfigCountry,
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
        return start(state as GameStateSetup, {
          seed,
          colors: colors as PlayerColor[],
        })
      }
    )
    .with(
      [GameCommandEnum.CUT_PEAT, P.string, P.string],
      [GameCommandEnum.CUT_PEAT, P.string, P.string, 'Jo'],
      ([_, col, row, useJoker]) =>
        cutPeat(state as GameStatePlaying, {
          coords: [Number.parseInt(col, 10), Number.parseInt(row, 10)],
          useJoker: useJoker === 'Jo',
        })
    )
    .with([GameCommandEnum.COMMIT], () => commit(state as GameStatePlaying))
    .otherwise(() => state)

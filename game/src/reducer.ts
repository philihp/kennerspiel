import { match, P } from 'ts-pattern'
import { build } from './commands/build'
import { commit } from './commands/commit'
import { config } from './commands/config'
import { convert } from './commands/convert'
import { cutPeat } from './commands/cutPeat'
import { fellTrees } from './commands/fellTrees'
import { start } from './commands/start'
import { use } from './commands/use'
import {
  BuildingEnum,
  GameCommandEnum,
  GameConfigCountry,
  GameConfigLength,
  GameConfigPlayers,
  GameState,
  GameStatePlaying,
  GameStateSetup,
  PlayerColor,
} from './types'
import { parseResourceParam } from './board/resource'
import { withPrior } from './commands/withPrior'
import { buyPlot } from './commands/buyPlot'
import { buyDistrict } from './commands/buyDistrict'

const PPlot = P.union('MOUNTAIN', 'COAST')
const PDistrict = P.union('HILLS', 'PLAINS')
const PPlayerCount = P.union('1', '2', '3', '4')
const PCountry = P.union('ireland', 'france')
const PLength = P.union('short', 'long')

export const reducer = (state: GameState, action: string[]): GameState | undefined => {
  const [command, ...params] = action
  return match<[string, string[]], GameState | undefined>([command, params])
    .with([GameCommandEnum.CONFIG, [PPlayerCount, PCountry, PLength]], ([_, [players, country, length]]) =>
      config(state as GameStateSetup, {
        players: Number.parseInt(players, 10) as GameConfigPlayers,
        length: length as GameConfigLength,
        country: country as GameConfigCountry,
      })
    )
    .with([GameCommandEnum.START, P.array(P.string)], ([_, [unparsedSeed, ...colors]]) =>
      start(state as GameStateSetup, {
        seed: Number.parseInt(unparsedSeed, 10),
        colors: colors as PlayerColor[],
      })
    )
    .with([GameCommandEnum.CUT_PEAT, P.array(P.string)], ([_, [col, row, useJoker]]) =>
      cutPeat({
        col: Number.parseInt(col, 10),
        row: Number.parseInt(row, 10),
        useJoker: useJoker === 'Jo',
      })(state as GameStatePlaying)
    )
    .with([GameCommandEnum.FELL_TREES, P.array(P.string)], ([_, [col, row, useJoker]]) =>
      fellTrees({
        col: Number.parseInt(col, 10),
        row: Number.parseInt(row ?? '', 10),
        useJoker: useJoker === 'Jo',
      })(state as GameStatePlaying)
    )
    .with([GameCommandEnum.BUILD, P.array(P.string)], ([_, [building, col, row]]) =>
      build({
        building: building as BuildingEnum,
        col: Number.parseInt(col, 10),
        row: Number.parseInt(row, 10),
      })(state as GameStatePlaying)
    )
    .with([GameCommandEnum.WITH_PRIOR, []], () => withPrior(state as GameStatePlaying))
    .with([GameCommandEnum.USE, P.array(P.string)], ([_command, [building, ...params]]) => {
      return use(building as BuildingEnum, params)(state as GameStatePlaying)
    })
    .with([GameCommandEnum.BUY_PLOT, [P._, PPlot]], ([_, [y, side]]) =>
      buyPlot({
        y: Number.parseInt(y, 10),
        side: side as 'MOUNTAIN' | 'COAST',
      })(state as GameStatePlaying)
    )
    .with([GameCommandEnum.BUY_DISTRICT, [P._, PDistrict]], ([_, [y, side]]) =>
      buyDistrict({
        y: Number.parseInt(y, 10),
        side: side as 'HILLS' | 'PLAINS',
      })(state as GameStatePlaying)
    )
    .with([GameCommandEnum.CONVERT, [P.select('resources')]], ({ resources }) =>
      convert(parseResourceParam(resources))(state as GameStatePlaying)
    )
    .with([GameCommandEnum.COMMIT, []], () => commit(state as GameStatePlaying))
    .otherwise((command) => {
      throw new Error(`Unable to parse [${command.join(',')}]`)
    })
}

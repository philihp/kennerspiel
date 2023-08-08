import { match, P } from 'ts-pattern'
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
  SettlementEnum,
} from './types'
import { parseResourceParam } from './board/resource'
import {
  build,
  commit,
  config,
  convert,
  cutPeat,
  fellTrees,
  settle,
  start,
  use,
  withLaybrother,
  withPrior,
  buyPlot,
  buyDistrict,
  workContract,
} from './commands'

const PPlot = P.union('MOUNTAIN', 'COAST')
const PDistrict = P.union('HILLS', 'PLAINS')
const PPlayerCount = P.union('1', '2', '3', '4')
const PCountry = P.union('ireland', 'france')
const PLength = P.union('short', 'long')

export const reducer = (state: GameState, [command, ...params]: string[]): GameState | undefined => {
  return match<[string, string[]], GameState | undefined>([command, params])
    .with([GameCommandEnum.COMMIT, []], () => commit(state as GameStatePlaying))
    .with([GameCommandEnum.USE, P.array(P.string)], ([_command, [building, ...params]]) =>
      use(building as BuildingEnum, params)(state as GameStatePlaying)
    )
    .with([GameCommandEnum.BUILD, P.array(P.string)], ([_, [building, col, row]]) =>
      build({
        building: building as BuildingEnum,
        col: Number.parseInt(col, 10),
        row: Number.parseInt(row, 10),
      })(state as GameStatePlaying)
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
    .with([GameCommandEnum.WORK_CONTRACT, P.array(P.string)], ([_, [building, paymentGift, withPrior]]) =>
      workContract(building as BuildingEnum, paymentGift, withPrior === 'WITH_PRIOR')(state as GameStatePlaying)
    )
    .with([GameCommandEnum.WITH_PRIOR, []], () => withPrior(state as GameStatePlaying))
    .with([GameCommandEnum.WITH_LAYBROTHER, []], () => withLaybrother(state as GameStatePlaying))
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
    .with([GameCommandEnum.SETTLE, P.array(P.string)], ([_, [settlement, col, row, resources]]) =>
      settle({
        settlement: settlement as SettlementEnum,
        col: Number.parseInt(col, 10),
        row: Number.parseInt(row, 10),
        resources,
      })(state as GameStatePlaying)
    )
    .with([GameCommandEnum.CONFIG, [PPlayerCount, PCountry, PLength]], ([_, [players, country, length]]) =>
      config({
        players: Number.parseInt(players, 10) as GameConfigPlayers,
        length: length as GameConfigLength,
        country: country as GameConfigCountry,
      })(state as GameStateSetup)
    )
    .with([GameCommandEnum.START, P.array(P.string)], ([_, params]) => {
      const seed = Number.parseInt(params[0], 10)
      if (Number.isNaN(seed)) {
        return start(state as GameStateSetup, {
          seed: undefined,
          colors: params as PlayerColor[],
        })
      }

      return start(state as GameStateSetup, {
        seed,
        colors: params.slice(1) as PlayerColor[],
      })
    })
    .otherwise((command) => {
      throw new Error(`Unable to parse [${command.join(',')}]`)
    })
}

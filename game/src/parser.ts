import { GameCommandEnum, Parser } from './types'
import { parse as parseConfig } from './commands/config'

export const parser: Parser = ([command, ...params]) => {
  switch (command) {
    case GameCommandEnum.COMMIT:
      return {
        command: GameCommandEnum.COMMIT,
        params: undefined,
      }
    case GameCommandEnum.CONFIG:
      return {
        command: GameCommandEnum.CONFIG,
        params: parseConfig(params),
      }
    case GameCommandEnum.START:
      return {
        command: GameCommandEnum.START,
        params: undefined,
      }
  }
  return {
    command: undefined,
    params: undefined,
  }
}

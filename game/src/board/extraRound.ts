import { match, P } from 'ts-pattern'
import { GameCommandConfigParams } from '../types'

export const isExtraRound = (config: GameCommandConfigParams, round: number): boolean =>
  match<[GameCommandConfigParams, number], boolean>([config, round])
    .with([{ players: 1 }, P.when((r) => r >= 31)], () => true)
    .with([{ players: P.union(3, 4) }, P.when((r) => r >= 24)], () => true)
    .otherwise(() => false)

export const isPriorSpecialInExtraRound = ({ players }: GameCommandConfigParams): boolean => players === 1

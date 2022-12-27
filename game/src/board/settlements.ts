import { P, match } from 'ts-pattern'
import { GameCommandConfigParams, SettlementEnum, SettlementRound } from '../types'

export const settlementRounds = (config: GameCommandConfigParams): number[] =>
  match<GameCommandConfigParams, number[]>(config) // .
    .with({ players: 1 }, () => [11, 15, 21, 25, 31])
    .with({ players: 2 }, () => [6, 13, 20, 27])
    .with({ players: 3, length: 'long' }, () => [5, 10, 14, 19, 24])
    .with({ players: 4, length: 'long' }, () => [6, 9, 15, 18, 24])
    .with({ players: P.when((players) => [3, 4].includes(players)), length: 'short' }, () => [2, 4, 6, 8, 12])
    .otherwise(() => [])

export const roundSettlements = (round: SettlementRound): SettlementEnum[] =>
  match(round)
    .with(SettlementRound.S, () => [
      SettlementEnum.ShantyTown,
      SettlementEnum.FarmingVillage,
      SettlementEnum.MarketTown,
      SettlementEnum.FishingVillage,
    ])
    .with(SettlementRound.A, () => [SettlementEnum.ArtistsColony])
    .with(SettlementRound.B, () => [SettlementEnum.Hamlet])
    .with(SettlementRound.C, () => [SettlementEnum.Village])
    .with(SettlementRound.D, () => [SettlementEnum.HilltopVillage])
    .otherwise(() => [])

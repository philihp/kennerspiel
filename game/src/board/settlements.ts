import { P, match } from 'ts-pattern'
import { GameCommandConfigParams, PlayerColor, SettlementEnum, SettlementRound } from '../types'

export const settlementRounds = (config: GameCommandConfigParams): number[] =>
  match<GameCommandConfigParams, number[]>(config) // .
    .with({ players: 1 }, () => [11, 15, 21, 25, 31])
    .with({ players: 2 }, () => [6, 13, 20, 27])
    .with({ players: 3, length: 'long' }, () => [5, 10, 14, 19, 24])
    .with({ players: 4, length: 'long' }, () => [6, 9, 15, 18, 24])
    .with({ players: P.when((players) => [3, 4].includes(players)), length: 'short' }, () => [2, 4, 6, 8, 12])
    .otherwise(() => [])

export const roundSettlements = (color: PlayerColor, round: SettlementRound): SettlementEnum[] =>
  match<[PlayerColor, SettlementRound], SettlementEnum[]>([color, round])
    .with([PlayerColor.Red, SettlementRound.S], () => [
      SettlementEnum.ShantyTownR,
      SettlementEnum.FarmingVillageR,
      SettlementEnum.MarketTownR,
      SettlementEnum.FishingVillageR,
    ])
    .with([PlayerColor.Green, SettlementRound.S], () => [
      SettlementEnum.ShantyTownG,
      SettlementEnum.FarmingVillageG,
      SettlementEnum.MarketTownG,
      SettlementEnum.FishingVillageG,
    ])
    .with([PlayerColor.Blue, SettlementRound.S], () => [
      SettlementEnum.ShantyTownB,
      SettlementEnum.FarmingVillageB,
      SettlementEnum.MarketTownB,
      SettlementEnum.FishingVillageB,
    ])
    .with([PlayerColor.White, SettlementRound.S], () => [
      SettlementEnum.ShantyTownW,
      SettlementEnum.FarmingVillageW,
      SettlementEnum.MarketTownW,
      SettlementEnum.FishingVillageW,
    ])
    .with([PlayerColor.Red, SettlementRound.A], () => [SettlementEnum.ArtistsColonyR])
    .with([PlayerColor.Green, SettlementRound.A], () => [SettlementEnum.ArtistsColonyG])
    .with([PlayerColor.Blue, SettlementRound.A], () => [SettlementEnum.ArtistsColonyB])
    .with([PlayerColor.White, SettlementRound.A], () => [SettlementEnum.ArtistsColonyW])
    .with([PlayerColor.Red, SettlementRound.B], () => [SettlementEnum.HamletR])
    .with([PlayerColor.Green, SettlementRound.B], () => [SettlementEnum.HamletG])
    .with([PlayerColor.Blue, SettlementRound.B], () => [SettlementEnum.HamletB])
    .with([PlayerColor.White, SettlementRound.B], () => [SettlementEnum.HamletW])
    .with([PlayerColor.Red, SettlementRound.C], () => [SettlementEnum.VillageR])
    .with([PlayerColor.Green, SettlementRound.C], () => [SettlementEnum.VillageG])
    .with([PlayerColor.Blue, SettlementRound.C], () => [SettlementEnum.VillageB])
    .with([PlayerColor.White, SettlementRound.C], () => [SettlementEnum.VillageW])
    .with([PlayerColor.Red, SettlementRound.D], () => [SettlementEnum.HilltopVillageR])
    .with([PlayerColor.Green, SettlementRound.D], () => [SettlementEnum.HilltopVillageG])
    .with([PlayerColor.Blue, SettlementRound.D], () => [SettlementEnum.HilltopVillageB])
    .with([PlayerColor.White, SettlementRound.D], () => [SettlementEnum.HilltopVillageW])
    .otherwise(() => [])

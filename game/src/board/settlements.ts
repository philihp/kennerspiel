import { P, match } from 'ts-pattern'
import { GameCommandConfigParams, PlayerColor, SettlementEnum, SettlementRound } from '../types'

export const nextSettlementRound = (prev: SettlementRound) => {
  switch (prev) {
    case SettlementRound.A:
      return SettlementRound.B
    case SettlementRound.B:
      return SettlementRound.C
    case SettlementRound.C:
      return SettlementRound.D
    case SettlementRound.D:
      return SettlementRound.E
    case SettlementRound.E:
    default:
      return SettlementRound.E
  }
}

export const settlementOnRound = (config: GameCommandConfigParams, round: SettlementRound): number | undefined =>
  match<[GameCommandConfigParams, SettlementRound], number>([config, round]) // .
    .with([{ players: 1 }, SettlementRound.A], () => 11)
    .with([{ players: 1 }, SettlementRound.B], () => 15)
    .with([{ players: 1 }, SettlementRound.C], () => 21)
    .with([{ players: 1 }, SettlementRound.D], () => 25)
    .with([{ players: 1 }, SettlementRound.E], () => 31)
    .with([{ players: 2 }, SettlementRound.A], () => 6)
    .with([{ players: 2 }, SettlementRound.B], () => 13)
    .with([{ players: 2 }, SettlementRound.C], () => 20)
    .with([{ players: 2 }, SettlementRound.D], () => 27)
    .with([{ players: 3, length: 'long' }, SettlementRound.A], () => 5)
    .with([{ players: 3, length: 'long' }, SettlementRound.B], () => 10)
    .with([{ players: 3, length: 'long' }, SettlementRound.C], () => 14)
    .with([{ players: 3, length: 'long' }, SettlementRound.D], () => 19)
    .with([{ players: 3, length: 'long' }, SettlementRound.E], () => 24)
    .with([{ players: 4, length: 'long' }, SettlementRound.A], () => 6)
    .with([{ players: 4, length: 'long' }, SettlementRound.B], () => 9)
    .with([{ players: 4, length: 'long' }, SettlementRound.C], () => 15)
    .with([{ players: 4, length: 'long' }, SettlementRound.D], () => 18)
    .with([{ players: 4, length: 'long' }, SettlementRound.E], () => 24)
    .with([{ players: P.when((p) => [3, 4].includes(p)), length: 'short' }, SettlementRound.A], () => 2)
    .with([{ players: P.when((p) => [3, 4].includes(p)), length: 'short' }, SettlementRound.B], () => 4)
    .with([{ players: P.when((p) => [3, 4].includes(p)), length: 'short' }, SettlementRound.C], () => 6)
    .with([{ players: P.when((p) => [3, 4].includes(p)), length: 'short' }, SettlementRound.D], () => 8)
    .with([{ players: P.when((p) => [3, 4].includes(p)), length: 'short' }, SettlementRound.E], () => 12)
    .otherwise(() => 0)

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

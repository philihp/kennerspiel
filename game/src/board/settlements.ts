import { union } from 'ramda'
import { match } from 'ts-pattern'
import { GameStatePlaying, PlayerColor, SettlementEnum, SettlementRound } from '../types'
import { withEachPlayer } from './player'

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

export const introduceSettlements = (state: GameStatePlaying | undefined): GameStatePlaying | undefined =>
  withEachPlayer(
    (player) =>
      state && {
        ...player,
        settlements: union(player.settlements, roundSettlements(player.color, state.frame.settlementRound)),
      }
  )(state)

import { union } from 'ramda'
import { match } from 'ts-pattern'
import { PlayerColor, SettlementCost, SettlementEnum, SettlementRound, StateReducer } from '../types'
import { withEachPlayer } from './player'

export const costForSettlement = (settlement: SettlementEnum): SettlementCost =>
  match<SettlementEnum, SettlementCost>(settlement)
    .with(
      SettlementEnum.ShantyTownR,
      SettlementEnum.ShantyTownG,
      SettlementEnum.ShantyTownB,
      SettlementEnum.ShantyTownW,
      () => ({ food: 1, energy: 1 })
    )
    .with(
      SettlementEnum.FarmingVillageR,
      SettlementEnum.FarmingVillageG,
      SettlementEnum.FarmingVillageB,
      SettlementEnum.FarmingVillageW,
      () => ({ food: 3, energy: 3 })
    )
    .with(
      SettlementEnum.MarketTownR,
      SettlementEnum.MarketTownG,
      SettlementEnum.MarketTownB,
      SettlementEnum.MarketTownW,
      () => ({ food: 7, energy: 0 })
    )
    .with(
      SettlementEnum.FishingVillageR,
      SettlementEnum.FishingVillageG,
      SettlementEnum.FishingVillageB,
      SettlementEnum.FishingVillageW,
      () => ({ food: 8, energy: 3 })
    )
    .with(
      SettlementEnum.ArtistsColonyR,
      SettlementEnum.ArtistsColonyG,
      SettlementEnum.ArtistsColonyB,
      SettlementEnum.ArtistsColonyW,
      () => ({ food: 5, energy: 1 })
    )
    .with(SettlementEnum.HamletR, SettlementEnum.HamletG, SettlementEnum.HamletB, SettlementEnum.HamletW, () => ({
      food: 5,
      energy: 6,
    }))
    .with(SettlementEnum.VillageR, SettlementEnum.VillageG, SettlementEnum.VillageB, SettlementEnum.VillageW, () => ({
      food: 15,
      energy: 9,
    }))
    .with(
      SettlementEnum.HilltopVillageR,
      SettlementEnum.HilltopVillageG,
      SettlementEnum.HilltopVillageB,
      SettlementEnum.HilltopVillageW,
      () => ({ food: 30, energy: 3 })
    )
    .exhaustive()

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

export const introduceSettlements: StateReducer = (state) =>
  withEachPlayer(
    (player) =>
      state && {
        ...player,
        settlements: union(player.settlements, roundSettlements(player.color, state.frame.settlementRound)),
      }
  )(state)

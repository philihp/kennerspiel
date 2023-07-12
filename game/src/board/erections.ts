import { match } from 'ts-pattern'
import { lensPath, set } from 'ramda'
import { BuildingEnum, ErectionEnum, LandEnum, SettlementEnum, StateReducer, Tableau, Tile } from '../types'
import { withPlayerIndex } from './player'

export const terrainForErection = (erection: ErectionEnum): LandEnum[] =>
  match(erection)
    .with(BuildingEnum.Windmill, () => [LandEnum.Coast, LandEnum.Hillside])
    .with(BuildingEnum.FalseLighthouse, () => [LandEnum.Coast])
    .with(BuildingEnum.HarborPromenade, () => [LandEnum.Coast])
    .with(BuildingEnum.Houseboat, () => [LandEnum.Water])
    .with(BuildingEnum.GrapevineA, BuildingEnum.GrapevineB, () => [LandEnum.Hillside])
    .with(BuildingEnum.DruidsHouse, () => [LandEnum.Hillside])
    .with(BuildingEnum.QuarryA, BuildingEnum.QuarryB, () => [LandEnum.Mountain])
    .with(BuildingEnum.Shipyard, () => [LandEnum.Coast])
    .with(BuildingEnum.Palace, () => [LandEnum.Hillside])
    .with(BuildingEnum.Castle, () => [LandEnum.Hillside, LandEnum.Mountain])
    .with(BuildingEnum.CoalHarbor, () => [LandEnum.Coast])
    .with(BuildingEnum.ShippingCompany, () => [LandEnum.Coast])
    .with(BuildingEnum.RoundTower, () => [LandEnum.Hillside])
    .with(
      SettlementEnum.FishingVillageR,
      SettlementEnum.FishingVillageG,
      SettlementEnum.FishingVillageB,
      SettlementEnum.FishingVillageW,
      () => [LandEnum.Coast]
    )
    .with(
      SettlementEnum.HilltopVillageR,
      SettlementEnum.HilltopVillageG,
      SettlementEnum.HilltopVillageB,
      SettlementEnum.HilltopVillageW,
      () => [LandEnum.Hillside]
    )
    .otherwise(() => [LandEnum.Coast, LandEnum.Hillside, LandEnum.Plains])

export const addErectionAtLandscape =
  (row: number, col: number, erection: ErectionEnum): StateReducer =>
  (state) =>
    withPlayerIndex(state?.frame.neutralBuildingPhase ? 1 : state?.frame.activePlayerIndex ?? 0)((player) =>
      set(lensPath<Tableau, ErectionEnum>(['landscape', row + player.landscapeOffset, col + 2, 1]), erection, player)
    )(state)

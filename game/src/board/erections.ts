import { match } from 'ts-pattern'
import { BuildingEnum, ErectionEnum, LandEnum, SettlementEnum, Tile } from '../types'
import { withActivePlayer } from './player'

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

export const addErectionAtLandscape = (row: number, col: number, erection: ErectionEnum) =>
  withActivePlayer((player) => {
    const rowOff = row + player.landscapeOffset
    const landscape = [
      ...player.landscape.slice(0, rowOff),
      [
        ...player.landscape[rowOff].slice(0, col + 2),
        [player.landscape[rowOff][col + 2][0], erection] as Tile,
        ...player.landscape[rowOff].slice(col + 2 + 1),
      ],
      ...player.landscape.slice(rowOff + 1),
    ]
    return {
      ...player,
      landscape,
    }
  })

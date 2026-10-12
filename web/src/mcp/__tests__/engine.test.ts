import { describe as d, it as test, expect } from '../../testHelpers'
import { BuildingEnum, PlayerColor } from 'hathora-et-labora-game/dist/types'
import { GameStatePlaying, pendingWorkContract } from '../engine'

const state = (currentPlayerIndex: number, activePlayerIndex: number, usableBuildings: BuildingEnum[]) =>
  ({
    players: [{ color: PlayerColor.Red }, { color: PlayerColor.Blue }],
    frame: { currentPlayerIndex, activePlayerIndex, usableBuildings },
  }) as unknown as GameStatePlaying

d('pendingWorkContract', () => {
  test('undefined without a state', () => expect(pendingWorkContract(undefined)).toBeUndefined())
  test('undefined when the current player is also active', () =>
    expect(pendingWorkContract(state(0, 0, [BuildingEnum.FarmYardB]))).toBeUndefined())
  test('undefined when no building is contracted', () => expect(pendingWorkContract(state(0, 1, []))).toBeUndefined())
  test('names contractor, owner, and building while the owner chooses', () =>
    expect(pendingWorkContract(state(0, 1, [BuildingEnum.FarmYardB]))).toStrictEqual({
      contractor: PlayerColor.Red,
      owner: PlayerColor.Blue,
      building: BuildingEnum.FarmYardB,
    }))
})

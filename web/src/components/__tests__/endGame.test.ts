import { describe as d, it as test, expect } from '../../testHelpers'
import { GameCommandConfigParams, Score, Tableau } from 'hathora-et-labora-game'
import { BuildingEnum, Frame, LandEnum, PlayerColor, SettlementRound } from 'hathora-et-labora-game/dist/types'
import { dBuildingsOut, endGamePhase, endGameThreshold, rankScores } from '../endGame'

const long2: GameCommandConfigParams = { players: 2, length: 'long', country: 'france' }
const short2: GameCommandConfigParams = { players: 2, length: 'short', country: 'france' }
const long3: GameCommandConfigParams = { players: 3, length: 'long', country: 'france' }

const player = (color: PlayerColor, landscape: Tableau['landscape'] = []): Tableau =>
  ({ color, landscape }) as unknown as Tableau

const frame = (next: number): Frame => ({ next, settlementRound: SettlementRound.D }) as unknown as Frame

// settlement D in a 2p france game brings out the Printing Office
const dBuilding = BuildingEnum.PrintingOffice
const noPlayers = [player(PlayerColor.Red), player(PlayerColor.Blue)]

d('endGameThreshold', () => {
  test('3 in a long game', () => expect(endGameThreshold(long2)).toBe(3))
  test('1 in a short game', () => expect(endGameThreshold(short2)).toBe(1))
})

d('dBuildingsOut', () => {
  test('false before settlement D', () =>
    expect(dBuildingsOut(long2, [BuildingEnum.Priory, BuildingEnum.Bakery], noPlayers)).toBe(false))
  test('true when a D building is unbuilt', () =>
    expect(dBuildingsOut(long2, [BuildingEnum.Priory, dBuilding], noPlayers)).toBe(true))
  test('true when every D building is already built', () =>
    expect(
      dBuildingsOut(long2, [], [player(PlayerColor.Red, [[[LandEnum.Plains, dBuilding]]]), player(PlayerColor.Blue)])
    ).toBe(true))
})

d('endGamePhase', () => {
  test('nothing in a 3 player game', () =>
    expect(endGamePhase(long3, frame(99), [dBuilding], noPlayers)).toBeUndefined())
  test('nothing before the D buildings are out', () =>
    expect(endGamePhase(long2, frame(5), [BuildingEnum.Priory], noPlayers)).toBeUndefined())
  test('counts the unbuilt buildings against the threshold', () =>
    expect(endGamePhase(long2, frame(103), [dBuilding, BuildingEnum.Priory], noPlayers)).toStrictEqual({
      threshold: 3,
      unbuilt: 2,
      lastRound: false,
    }))
  test('reports the last round of a long game', () =>
    expect(endGamePhase(long2, frame(100), [dBuilding], noPlayers)?.lastRound).toBe(true))
  test('reports the last turn of a short game', () =>
    expect(endGamePhase(short2, frame(999), [dBuilding], noPlayers)).toStrictEqual({
      threshold: 1,
      unbuilt: 1,
      lastRound: true,
    }))
})

d('rankScores', () => {
  const score = (total: number): Score => ({ goods: total, economic: 0, settlements: [], total })
  const red = player(PlayerColor.Red)
  const blue = player(PlayerColor.Blue)
  const green = player(PlayerColor.Green)

  test('highest total first', () =>
    expect(rankScores([red, blue], [score(10), score(20)])).toStrictEqual([
      { player: blue, score: score(20), rank: 1 },
      { player: red, score: score(10), rank: 2 },
    ]))
  test('tied players share a rank', () =>
    expect(rankScores([red, blue, green], [score(20), score(5), score(20)]).map(({ rank }) => rank)).toStrictEqual([
      1, 1, 3,
    ]))
  test('ignores the neutral player, who has no score', () =>
    expect(rankScores([red, blue], [score(7)])).toStrictEqual([{ player: red, score: score(7), rank: 1 }]))
})

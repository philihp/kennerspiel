import { initialState } from '../../state'
import {
  BuildingEnum,
  Clergy,
  GameStatePlaying,
  GameStatusEnum,
  LandEnum,
  NextUseClergy,
  PlayerColor,
  SettlementRound,
  Tableau,
  Tile,
} from '../../types'
import { complete, priory } from '../priory'

describe('buildings/proiry', () => {
  const p0: Tableau = {
    color: PlayerColor.Blue,
    clergy: [],
    settlements: [],
    landscape: [
      [[], [], ['P'], ['P'], ['P'], ['P'], ['P'], [], []],
      [[], [], ['P'], ['P'], ['P'], ['P'], ['P'], [], []],
    ] as Tile[][],
    wonders: 0,
    landscapeOffset: 0,
    peat: 0,
    penny: 0,
    clay: 0,
    wood: 0,
    grain: 0,
    sheep: 0,
    stone: 0,
    flour: 0,
    grape: 0,
    nickel: 0,
    malt: 0,
    coal: 0,
    book: 0,
    ceramic: 0,
    whiskey: 0,
    straw: 0,
    meat: 0,
    ornament: 0,
    bread: 0,
    wine: 0,
    beer: 0,
    reliquary: 0,
  }
  const s0: GameStatePlaying = {
    ...initialState,
    status: GameStatusEnum.PLAYING,
    config: {
      country: 'france',
      players: 3,
      length: 'long',
    },
    rondel: {
      pointingBefore: 0,
    },
    wonders: 0,
    players: [
      {
        ...p0,
        color: PlayerColor.Red,
        landscape: [
          [[], [], [LandEnum.Plains], [LandEnum.Plains, BuildingEnum.CloisterOfficeR], [], []],
          [[], [], [LandEnum.Plains], [LandEnum.Plains], [], []],
        ],
        grain: 1,
        penny: 1,
      },
      {
        ...p0,
        color: PlayerColor.Green,
        clergy: [Clergy.LayBrother1G, Clergy.LayBrother2G],
        landscape: [[[LandEnum.Plains, BuildingEnum.GrainStorage, Clergy.PriorG]]],
      },
      {
        ...p0,
        color: PlayerColor.Blue,
        clergy: [Clergy.LayBrother1B, Clergy.LayBrother2B, Clergy.PriorB],
        landscape: [[[LandEnum.Plains, BuildingEnum.Windmill]]],
      },
    ],
    buildings: [],
    plotPurchasePrices: [1, 1, 1, 1, 1, 1],
    districtPurchasePrices: [],
    frame: {
      round: 1,
      next: 1,
      startingPlayer: 1,
      settlementRound: SettlementRound.S,
      currentPlayerIndex: 0,
      activePlayerIndex: 0,
      neutralBuildingPhase: false,
      bonusRoundPlacement: false,
      mainActionUsed: true,
      bonusActions: [],
      canBuyLandscape: true,
      unusableBuildings: [],
      usableBuildings: [],
      nextUse: NextUseClergy.Any,
    },
  }
  describe('use', () => {
    it('retains undefined state', () => {
      const s0: GameStatePlaying | undefined = undefined
      const s1 = priory()(s0)
      expect(s1).toBeUndefined()
    })
    it('using priory allows usage of many buildings except itself', () => {
      const s1 = priory()(s0)! as GameStatePlaying
      expect(s1.frame).toMatchObject({
        nextUse: NextUseClergy.Free,
        usableBuildings: [BuildingEnum.GrainStorage],
      })
      expect(s1.players[0]).toMatchObject({
        penny: 1,
        grain: 1,
      })
    })
  })

  describe('complete', () => {
    it('takes no parameters, just finish at start', () => {
      const c0 = complete([])(s0)
      expect(c0).toStrictEqual([''])
    })
    it('returns [] on weird param', () => {
      const c0 = complete(['Wo'])(s0)
      expect(c0).toStrictEqual([])
    })
  })
})

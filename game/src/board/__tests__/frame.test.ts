import { match, P } from 'ts-pattern'
import { initialState } from '../../reducer'
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
import { nextFrame } from '../frame'

describe('board/frame', () => {
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
    penny: 100,
    clay: 0,
    wood: 0,
    grain: 0,
    sheep: 0,
    stone: 0,
    flour: 0,
    grape: 0,
    nickel: 0,
    hops: 0,
    coal: 0,
    book: 0,
    pottery: 0,
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
    players: [{ ...p0 }, { ...p0 }, { ...p0 }],
    buildings: [],
    plotPurchasePrices: [1, 1, 1, 1, 1, 1],
    districtPurchasePrices: [],
    frame: {
      id: 1,
      startingPlayer: 1,
      settlementRound: SettlementRound.S,
      workContractCost: 1,
      currentPlayerIndex: 0,
      activePlayerIndex: 0,
      neutralBuildingPhase: false,
      bonusRoundPlacement: false,
      mainActionUsed: false,
      bonusActions: [],
      canBuyLandscape: true,
      unusableBuildings: [],
      usableBuildings: [],
      nextUse: NextUseClergy.Any,
    },
  }

  describe('nextFrame', () => {
    describe('3 player long', () => {
      const s1: GameStatePlaying = {
        ...s0,
        config: {
          country: 'france',
          players: 3,
          length: 'long',
        },
      }

      it('advances through rounds', () => {
        const s2 = nextFrame(s1)!
        expect(s2.frame).toMatchObject({})
      })
    })
  })
})

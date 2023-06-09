import { initialState } from '../../../state'
import {
  BuildingEnum,
  Frame,
  GameCommandConfigParams,
  GameCommandEnum,
  GameStatePlaying,
  GameStatusEnum,
  NextUseClergy,
  SettlementRound,
  Tableau,
} from '../../../types'
import { checkSoloSettlementReady } from '../checkSoloSettlementReady'

describe('board/frame/checkSoloSettlementReady', () => {
  const f0: Frame = {
    round: 0,
    startingPlayer: 0,
    currentPlayerIndex: 0,
    activePlayerIndex: 0,
    next: 42,
    mainActionUsed: true,
    neutralBuildingPhase: true,
    bonusActions: [],
    settlementRound: SettlementRound.A,
    usableBuildings: [],
    unusableBuildings: [],
    nextUse: NextUseClergy.OnlyPrior,
    bonusRoundPlacement: false,
    canBuyLandscape: true,
  } as Frame
  const s0: GameStatePlaying = {
    ...initialState,
    status: GameStatusEnum.PLAYING,
    config: {
      country: 'france',
      players: 1,
      length: 'long',
    },
    rondel: {
      pointingBefore: 0,
    },
    wonders: 0,
    players: [{}, {}, {}] as Tableau[],
    buildings: ['G01'],
    plotPurchasePrices: [],
    districtPurchasePrices: [],
    frame: f0,
  } as GameStatePlaying

  it('retains undefined state', () => {
    const s1 = checkSoloSettlementReady(undefined)!
    expect(s1).toBeUndefined()
  })
  it('all buildings placed, allow SETTLE only', () => {
    const s1 = {
      ...s0,
      buildings: [],
    }
    const s2 = checkSoloSettlementReady(s1)!
    expect(s2.frame).toMatchObject({
      bonusActions: [GameCommandEnum.SETTLE],
    })
  })
  it('unplaced buildings, only allow BUILD', () => {
    const s1 = {
      ...s0,
      buildings: [BuildingEnum.ChamberOfWonders],
    }
    const s2 = checkSoloSettlementReady(s1)!
    expect(s2.frame).toMatchObject({
      bonusActions: [GameCommandEnum.BUILD],
    })
  })
})

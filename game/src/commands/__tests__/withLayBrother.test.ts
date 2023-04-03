import { initialState } from '../../state'
import {
  BuildingEnum,
  Clergy,
  GameStatePlaying,
  GameStatusEnum,
  NextUseClergy,
  PlayerColor,
  SettlementRound,
  Tableau,
  Tile,
} from '../../types'
import { complete, withLaybrother } from '../withLaybrother'

describe('commands/withLaybrother', () => {
  const p0: Tableau = {
    color: PlayerColor.Blue,
    clergy: [],
    settlements: [],
    landscape: [[]] as Tile[][],
    wonders: 0,
    landscapeOffset: 1,
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
    frame: {
      round: 1,
      next: 1,
      startingPlayer: 0,
      settlementRound: SettlementRound.S,
      currentPlayerIndex: 0,
      activePlayerIndex: 0,
      neutralBuildingPhase: false,
      bonusRoundPlacement: false,
      mainActionUsed: false,
      bonusActions: [],
      canBuyLandscape: true,
      unusableBuildings: [],
      usableBuildings: ['F05' as BuildingEnum],
      nextUse: NextUseClergy.Any,
    },
    config: {
      country: 'france',
      players: 4,
      length: 'long',
    },
    rondel: {
      pointingBefore: 4,
      wood: 1,
      sheep: 3,
      grain: 4,
      joker: 0,
    },
    wonders: 0,
    players: [
      {
        ...p0,
        color: PlayerColor.Red,
        // this is the active player
        clergy: ['PRIR'] as Clergy[],
        landscape: [
          [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['H', 'LR1', 'LB2R'], [], []],
          [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LR2', 'LB1R'], ['P', 'G01'], ['P', 'LR3'], [], []],
        ] as Tile[][],
        grain: 4,
        penny: 4,
        wine: 4,
        landscapeOffset: 0,
      },
      {
        ...p0,
        color: PlayerColor.Blue,
        // specifically, blue has only laybrothers
        clergy: ['LB1B', 'LB2B'] as Clergy[],
        landscape: [
          [['W'], ['C'], [], [], [], [], [], ['H'], ['M']],
          [['W'], ['C', 'F04', 'PRIB'], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['P', 'LB1'], ['H'], ['.']],
          [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LB2'], ['P', 'G02'], ['P', 'LB3'], [], []],
        ] as Tile[][],
        landscapeOffset: 1,
      },
      {
        ...p0,
        color: PlayerColor.Green,
        // specifically, green has both laybrother and prior, so she will be put to a decision
        clergy: ['LB1G', 'LB2G', 'PRIG'] as Clergy[],
        landscape: [
          [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['P', 'F05'], ['H', 'LG1'], [], []],
          [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LG2'], ['P', 'F08'], ['P', 'LG3'], [], []],
        ] as Tile[][],
        penny: 1,
        landscapeOffset: 0,
      },
      {
        ...p0,
        color: PlayerColor.White,
        // white has already had their people all placed, so a work contract against them should fail
        clergy: [] as Clergy[],
        landscape: [
          [['W'], ['C', 'F11'], ['P', 'LPE'], ['P'], ['P', 'LFO'], ['P', 'F03', 'PRIW'], ['H', 'LG1'], [], []],
          [['W'], ['C', 'G07'], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LG2', 'LG1W'], ['P'], ['P', 'LG3', 'LG2W'], [], []],
        ] as Tile[][],
        landscapeOffset: 0,
      },
    ],
    buildings: ['F09', 'F10', 'G12', 'G13', 'G06'] as BuildingEnum[],
    plotPurchasePrices: [1, 1, 1, 1, 1, 1],
    districtPurchasePrices: [],
  }

  describe('withLaybrother', () => {
    it('places a laybrother and transfers action back to currentPlayer', () => {
      const s1 = {
        ...s0,
        frame: {
          ...s0.frame,
          // this is what the following command would do:
          // WORK_CONTRACT F05 Pn
          // because player 2 has both prior and laybrother available
          activePlayerIndex: 2,
          currentPlayerIndex: 0,
          usableBuildings: ['F05' as BuildingEnum],
        },
      }
      const s2 = withLaybrother(s1)!
      expect(s2.frame).toMatchObject({
        activePlayerIndex: 0,
        currentPlayerIndex: 0,
        nextUse: 'free',
        usableBuildings: ['F05'],
      })
      expect(s2.players[2]).toMatchObject({
        clergy: ['LB2G', 'PRIG'],
        landscape: [
          [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['P', 'F05', 'LB1G'], ['H', 'LG1'], [], []],
          [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LG2'], ['P', 'F08'], ['P', 'LG3'], [], []],
        ] as Tile[][],
      })
    })

    it('fails because active == current player', () => {
      const s1 = {
        ...s0,
        frame: {
          ...s0.frame,
          mainActionUsed: false,
          activePlayerIndex: 0,
          currentPlayerInde: 0,
        },
      }
      const s2 = withLaybrother(s1)!
      expect(s2).toBeUndefined()
    })

    it('fails if multiple usable buildings, somehow', () => {
      const s1 = {
        ...s0,
        frame: {
          ...s0.frame,
          usableBuildings: ['G01', 'G02'] as BuildingEnum[],
        },
      }
      const s2 = withLaybrother(s1)!
      expect(s2).toBeUndefined()
    })

    it('fails if no usable buildings to highlight', () => {
      const s1 = {
        ...s0,
        frame: {
          ...s0.frame,
          usableBuildings: [],
        },
      }
      const s2 = withLaybrother(s1)!
      expect(s2).toBeUndefined()
    })
  })

  describe('complete', () => {
    it('stub', () => {
      const c0 = complete(s0, [])
      expect(c0).toStrictEqual([])
    })
  })
})

import { initialState } from '../../state'
import {
  BuildingEnum,
  Clergy,
  GameCommandEnum,
  GameStatePlaying,
  GameStatusEnum,
  NextUseClergy,
  PlayerColor,
  SettlementRound,
  Tableau,
  Tile,
} from '../../types'
import { complete, withPrior } from '../withPrior'

describe('commands/withPrior', () => {
  const p0: Tableau = {
    color: PlayerColor.Blue,
    clergy: ['LB1B', 'LB2B', 'PRIB'] as Clergy[],
    settlements: [],
    landscape: [
      [['W'], ['C'], [], [], [], [], [], [], []],
      [['W'], ['C'], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['P'], [], []],
      [[], [], ['P'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['P'], [], []],
    ] as Tile[][],
    wonders: 0,
    landscapeOffset: 1,
    peat: 0,
    penny: 1,
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
      pointingBefore: 2,
      joker: 0,
      peat: 1,
    },
    wonders: 0,
    players: [{ ...p0 }, { ...p0 }, { ...p0 }],
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
      mainActionUsed: false,
      bonusActions: [],
      canBuyLandscape: true,
      unusableBuildings: [],
      usableBuildings: [],
      nextUse: NextUseClergy.Any,
    },
  }

  describe('withPrior', () => {
    it('sets onlyprior on next use in frame', () => {
      const s1 = withPrior(s0)!
      expect(s1.frame).toMatchObject({
        nextUse: NextUseClergy.OnlyPrior,
        mainActionUsed: true,
        bonusActions: [GameCommandEnum.USE],
      })
    })
    it('retains undefined state', () => {
      const s1 = withPrior(undefined)
      expect(s1).toBeUndefined()
    })
    it('wont do this if there is no prior', () => {
      const s1: GameStatePlaying = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            clergy: ['LB1B', 'LB2B'] as Clergy[],
          },
          ...s0.players.slice(1),
        ],
      }
      const s2 = withPrior(s1)
      expect(s2).toBeUndefined()
    })

    describe('if pending work contract', () => {
      const s0: GameStatePlaying = {
        ...initialState,
        status: GameStatusEnum.PLAYING,
        frame: {
          round: 1,
          next: 1,
          startingPlayer: 0,
          settlementRound: SettlementRound.S,
          currentPlayerIndex: 0,
          activePlayerIndex: 2,
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
              [
                ['W'],
                ['C', 'F04', 'PRIB'],
                ['P', 'LPE'],
                ['P', 'LFO'],
                ['P', 'LFO'],
                ['P'],
                ['P', 'LB1'],
                ['H'],
                ['.'],
              ],
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
              [
                ['W'],
                ['C', 'G07'],
                ['P', 'LPE'],
                ['P', 'LFO'],
                ['P', 'LG2', 'LG1W'],
                ['P'],
                ['P', 'LG3', 'LG2W'],
                [],
                [],
              ],
            ] as Tile[][],
            landscapeOffset: 0,
          },
        ],
        buildings: ['F09', 'F10', 'G12', 'G13', 'G06'] as BuildingEnum[],
        plotPurchasePrices: [],
        districtPurchasePrices: [],
      }

      it('fails if multiple usable buildings, somehow', () => {
        const s1 = {
          ...s0,
          frame: {
            ...s0.frame,
            usableBuildings: ['G01', 'G02'] as BuildingEnum[],
          },
        }
        const s2 = withPrior(s1)!
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
        const s2 = withPrior(s1)!
        expect(s2).toBeUndefined()
      })

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
        const s2 = withPrior(s1)!
        expect(s2.frame).toMatchObject({
          activePlayerIndex: 0,
          currentPlayerIndex: 0,
          nextUse: 'free',
          usableBuildings: ['F05'],
        })
        expect(s2.players[2]).toMatchObject({
          clergy: ['LB1G', 'LB2G'],
          landscape: [
            [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['P', 'F05', 'PRIG'], ['H', 'LG1'], [], []],
            [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LG2'], ['P', 'F08'], ['P', 'LG3'], [], []],
          ] as Tile[][],
        })
      })
    })
  })

  describe('complete', () => {
    it('if the player has a prior', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            clergy: [Clergy.LayBrother1B, Clergy.PriorB],
          },
          ...s0.players.slice(1),
        ],
      }
      const c0 = complete(s1)([])
      expect(c0).toStrictEqual(['WITH_PRIOR'])
    })
    it('if the player does not have a prior', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            clergy: [Clergy.LayBrother1B, Clergy.LayBrother2B],
          },
          ...s0.players.slice(1),
        ],
      }
      const c0 = complete(s1)([])
      expect(c0).toStrictEqual([])
    })
    it('nextUse is already using prior', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            clergy: [Clergy.LayBrother1B, Clergy.PriorB],
          },
          ...s0.players.slice(1),
        ],
        frame: {
          ...s0.frame,
          nextUse: NextUseClergy.OnlyPrior,
        },
      }
      const c0 = complete(s1)([])
      expect(c0).toStrictEqual([])
    })
    it('does not offer if already used main action', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            clergy: [Clergy.LayBrother1B, Clergy.PriorB],
          },
          ...s0.players.slice(1),
        ],
        frame: {
          ...s0.frame,
          mainActionUsed: true,
        },
      }
      const c0 = complete(s1)([])
      expect(c0).toStrictEqual([])
    })
    it('offer with_prior if waiting from work contract', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            clergy: [Clergy.LayBrother1B, Clergy.PriorB],
          },
          ...s0.players.slice(1),
        ],
        frame: {
          ...s0.frame,
          currentPlayerIndex: 1,
          activePlayerIndex: 0,
          mainActionUsed: true, // this would be set by work_contract
        },
      }
      const c0 = complete(s1)([])
      expect(c0).toStrictEqual(['WITH_PRIOR'])
    })
    it('completes the command', () => {
      const c0 = complete(s0)(['WITH_PRIOR'])
      expect(c0).toStrictEqual([''])
    })
    it('doesnt know what this is', () => {
      const c0 = complete(s0)(['WITH_PRIOR', 'Pn'])
      expect(c0).toStrictEqual([])
    })
  })
})

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
import { complete, workContract } from '../workContract'

describe('commands/workContract', () => {
  const p0: Tableau = {
    color: PlayerColor.Blue,
    clergy: [],
    settlements: [],
    landscape: [] as Tile[][],
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
      usableBuildings: [],
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
          [[], [], ['P', 'LMO'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['H', 'LR1', 'LB2R'], [], []],
          [[], [], ['P', 'LMO'], ['P', 'LFO'], ['P', 'LR2', 'LB1R'], ['P', 'G01'], ['P', 'LR3'], [], []],
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
          [['W'], ['C', 'F04', 'PRIB'], ['P', 'LMO'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['P', 'LB1'], ['H'], ['.']],
          [[], [], ['P', 'LMO'], ['P', 'LFO'], ['P', 'LB2'], ['P', 'G02'], ['P', 'LB3'], [], []],
        ] as Tile[][],
        landscapeOffset: 1,
      },
      {
        ...p0,
        color: PlayerColor.Green,
        // specifically, green has both laybrother and prior, so she will be put to a decision
        clergy: ['LB1G', 'LB2G', 'PRIG'] as Clergy[],
        landscape: [
          [[], [], ['P', 'LMO'], ['P', 'LFO'], ['P', 'LFO'], ['P', 'F05'], ['H', 'LG1'], [], []],
          [[], [], ['P', 'LMO'], ['P', 'LFO'], ['P', 'LG2'], ['P', 'F08'], ['P', 'LG3'], [], []],
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
          [['W'], ['C', 'F11'], ['P', 'LMO'], ['P'], ['P', 'LFO'], ['P', 'F03', 'PRIW'], ['H', 'LG1'], [], []],
          [['W'], ['C', 'G07'], ['P', 'LMO'], ['P', 'LFO'], ['P', 'LG2', 'LG1W'], ['P'], ['P', 'LG3', 'LG2W'], [], []],
        ] as Tile[][],
        landscapeOffset: 0,
      },
    ],
    buildings: ['F09', 'F10', 'G12', 'G13', 'G06'] as BuildingEnum[],
    plotPurchasePrices: [1, 2, 3, 4, 5],
    districtPurchasePrices: [3, 4, 5, 6],
  }

  describe('use', () => {
    it('can work contract someone with only laybrothers', () => {
      const s2 = workContract('G02' as BuildingEnum, 'Pn')(s0)!
      expect(s2.frame).toMatchObject({
        activePlayerIndex: 0,
        usableBuildings: ['G02'],
        nextUse: 'free',
      })
      expect(s2.players[0]).toMatchObject({
        penny: 3,
        wine: 4,
        grain: 4,
      })
      expect(s2.players[1]).toMatchObject({
        landscape: [
          [['W'], ['C'], [], [], [], [], [], ['H'], ['M']],
          [['W'], ['C', 'F04', 'PRIB'], ['P', 'LMO'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['P', 'LB1'], ['H'], ['.']],
          [[], [], ['P', 'LMO'], ['P', 'LFO'], ['P', 'LB2'], ['P', 'G02', 'LB1B'], ['P', 'LB3'], [], []],
        ],
        clergy: ['LB2B'],
      })
    })

    it('can work contract someone with only their prior', () => {
      const s1 = {
        ...s0,
        frame: {
          ...s0.frame,
          currentPlayerIndex: 2,
          activePlayerIndex: 2,
        },
      }
      const s2 = workContract('G01' as BuildingEnum, 'Pn')(s1)!
      expect(s2.frame).toMatchObject({
        activePlayerIndex: 2,
        usableBuildings: ['G01'],
        nextUse: 'free',
      })
      expect(s2.players[0]).toMatchObject({
        wine: 4,
        grain: 4,
        landscape: [
          [[], [], ['P', 'LMO'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['H', 'LR1', 'LB2R'], [], []],
          [[], [], ['P', 'LMO'], ['P', 'LFO'], ['P', 'LR2', 'LB1R'], ['P', 'G01', 'PRIR'], ['P', 'LR3'], [], []],
        ],
        clergy: [],
      })
      expect(s2.players[2]).toMatchObject({
        penny: 0,
        clergy: ['LB1G', 'LB2G', 'PRIG'],
      })
    })

    it('when work contracting someone with both laybrother and prior, gives them the choice', () => {
      // TODO we should have tests to ensure the other player can only WITH_PRIOR or WITH_LAYBROTHER
      // TODO and we should have tests to ensure that a WITH_PRIOR prior to a work contract does not affect things
      const s2 = workContract('F05' as BuildingEnum, 'Pn')(s0)!
      expect(s2.frame).toMatchObject({
        currentPlayerIndex: 0,
        activePlayerIndex: 2,
        usableBuildings: ['F05'],
      })
      expect(s2.players[0]).toMatchObject({
        penny: 3,
        wine: 4,
        grain: 4,
      })
      expect(s2.players[2]).toMatchObject({
        penny: 2,
        clergy: ['LB1G', 'LB2G', 'PRIG'] as Clergy[],
        landscape: [
          [[], [], ['P', 'LMO'], ['P', 'LFO'], ['P', 'LFO'], ['P', 'F05'], ['H', 'LG1'], [], []],
          [[], [], ['P', 'LMO'], ['P', 'LFO'], ['P', 'LG2'], ['P', 'F08'], ['P', 'LG3'], [], []],
        ] as Tile[][],
      })
    })
    it('can not work contract someone with no clergy left', () => {
      const s2 = workContract('F11' as BuildingEnum, 'Pn')(s0)!
      expect(s2).toBeUndefined()
    })
    it('can work contract with wine, which is consumed', () => {
      const s2 = workContract('G02' as BuildingEnum, 'Wn')(s0)!
      expect(s2.frame).toMatchObject({
        activePlayerIndex: 0,
        usableBuildings: ['G02'],
        nextUse: 'free',
      })
      expect(s2.players[0]).toMatchObject({
        penny: 4,
        wine: 3,
        grain: 4,
      })
      expect(s2.players[1]).toMatchObject({
        penny: 0,
        wine: 0,
        landscape: [
          [['W'], ['C'], [], [], [], [], [], ['H'], ['M']],
          [['W'], ['C', 'F04', 'PRIB'], ['P', 'LMO'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['P', 'LB1'], ['H'], ['.']],
          [[], [], ['P', 'LMO'], ['P', 'LFO'], ['P', 'LB2'], ['P', 'G02', 'LB1B'], ['P', 'LB3'], [], []],
        ],
        clergy: ['LB2B'],
      })
    })
    it('can work contract with a penny, which is gifted', () => {
      const s2 = workContract('G02' as BuildingEnum, 'Pn')(s0)!
      expect(s2.players[0].penny).toBe(3)
      expect(s2.players[1].penny).toBe(1)
    })

    it('can work contract with gifted pennies, which costs two once the winery has been built', () => {
      const s1 = {
        ...s0,
        frame: { ...s0.frame, settlementRound: SettlementRound.B },
      }
      expect(s1.frame.settlementRound).not.toBe('S')
      expect(s1.frame.settlementRound).not.toBe('A')
      expect(s1.buildings).not.toContain('F21')
      const s2 = workContract('G02' as BuildingEnum, 'PnPn')(s1)!
      expect(s2.players[0].penny).toBe(2)
      expect(s2.players[1].penny).toBe(2)
    })

    it('fail if payment insufficient', () => {
      const s1 = {
        ...s0,
        frame: { ...s0.frame, settlementRound: SettlementRound.B },
      }
      const s2 = workContract('G02' as BuildingEnum, 'Pn')(s1)!
      expect(s2).toBeUndefined()
    })

    it('gifts for the host are still 1 wine, regardless of if winery is built', () => {
      const s1 = {
        ...s0,
        frame: { ...s0.frame, settlementRound: SettlementRound.B },
      }
      const s2 = workContract('G02' as BuildingEnum, 'Wn')(s1)!
      expect(s2.players[0]).toMatchObject({
        wine: 3,
        penny: 4,
      })
    })

    it('can not work contract yourself', () => {
      // 'G01' is owned by the active player
      const s2 = workContract('G01' as BuildingEnum, 'Pn')(s0)!
      expect(s2).toBeUndefined()
    })

    it('does not allow if in bonus round', () => {
      const s1 = {
        ...s0,
        frame: {
          ...s0.frame,
          bonusRoundPlacement: true,
        },
      }
      const s2 = workContract('F05' as BuildingEnum, 'Pn')(s1)!
      expect(s2).toBeUndefined()
    })
  })

  describe('complete', () => {
    it('can work contract if they have 1 penny in early game', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            penny: 1,
            wine: 0,
            whiskey: 0,
          },
          ...s0.players.slice(1),
        ],
      }
      const c0 = complete(s1)([])
      expect(c0).toStrictEqual(['WORK_CONTRACT'])
    })
    it('will not allow if nobody else has any clergy to use', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            penny: 1,
            wine: 0,
            whiskey: 0,
          },
          ...s0.players.map((p) => ({
            ...p,
            clergy: [],
          })),
        ],
      }
      const c0 = complete(s1)([])
      expect(c0).toStrictEqual([])
    })
    it('can work contract if they have 1 wine', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            penny: 0,
            wine: 1,
            whiskey: 0,
          },
          ...s0.players.slice(1),
        ],
      }
      const c0 = complete(s1)([])
      expect(c0).toStrictEqual(['WORK_CONTRACT'])
    })
    it('can work contract if they have 1 whiskey', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            penny: 0,
            wine: 0,
            whiskey: 1,
          },
          ...s0.players.slice(1),
        ],
      }
      const c0 = complete(s1)([])
      expect(c0).toStrictEqual(['WORK_CONTRACT'])
    })
    it('can work contract in neutral building phase after buildings placed', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            penny: 0,
            wine: 0,
            whiskey: 1,
          },
          ...s0.players.slice(1),
        ],
        buildings: [],
        frame: {
          ...s0.frame,
          bonusActions: [GameCommandEnum.WORK_CONTRACT, GameCommandEnum.SETTLE],
          neutralBuildingPhase: true,
          mainActionUsed: true,
        },
      }
      const c0 = complete(s1)([])
      expect(c0).toStrictEqual(['WORK_CONTRACT'])
    })

    it('can not work contract if no money', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            penny: 0,
            wine: 0,
            whiskey: 0,
          },
          ...s0.players.slice(1),
        ],
      }
      const c0 = complete(s1)([])
      expect(c0).toStrictEqual([])
    })
    it('can work contract if they have 2 penny in late game', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            penny: 2,
            wine: 0,
            whiskey: 0,
            landscape: [
              [['P', 'F21'], ...s0.players[0].landscape[0].slice(1)],
              ...s0.players[0].landscape.slice(1),
            ] as Tile[][],
          },
          ...s0.players.slice(1),
        ],
        frame: {
          ...s0.frame,
          settlementRound: SettlementRound.C,
        },
      }
      const c0 = complete(s1)([])
      expect(c0).toStrictEqual(['WORK_CONTRACT'])
    })
    it('can not work contract if insufficient money', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            penny: 1,
            wine: 0,
            whiskey: 0,
            landscape: [
              [['P', 'F21'], ...s0.players[0].landscape[0].slice(1)],
              ...s0.players[0].landscape.slice(1),
            ] as Tile[][],
          },
          ...s0.players.slice(1),
        ],
        frame: {
          ...s0.frame,
          settlementRound: SettlementRound.C,
        },
      }
      const c0 = complete(s1)([])
      expect(c0).toStrictEqual([])
    })

    it('work contract lists available buildings', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            penny: 1,
            wine: 0,
            whiskey: 0,
          },
          ...s0.players.slice(1),
        ],
      }
      const c0 = complete(s1)(['WORK_CONTRACT'])
      expect(c0).toStrictEqual(['LB1', 'LB2', 'G02', 'LB3', 'F05', 'LG1', 'LG2', 'F08', 'LG3'])
    })

    it('work contract lists available buildings if we are second player', () => {
      const s1 = {
        ...s0,
        players: [
          s0.players[0],
          {
            ...s0.players[1],
            penny: 1,
            wine: 0,
            whiskey: 0,
          },
          ...s0.players.slice(2),
        ],
        frame: {
          ...s0.frame,
          activePlayerIndex: 1,
        },
      }
      const c0 = complete(s1)(['WORK_CONTRACT'])
      expect(c0).toStrictEqual(['G01', 'LR3', 'F05', 'LG1', 'LG2', 'F08', 'LG3'])
    })

    it('gives early game options for paying', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            penny: 1,
            wine: 1,
            whiskey: 1,
          },
          ...s0.players.slice(1),
        ],
      }
      const c0 = complete(s1)(['WORK_CONTRACT', 'G02'])
      expect(c0).toStrictEqual(['Wn', 'Wh', 'Pn'])
    })
    it('gives late game options for paying', () => {
      const s1 = {
        ...s0,
        players: [
          {
            ...s0.players[0],
            penny: 2,
            wine: 2,
            whiskey: 2,
            landscape: [
              [['P', 'F21'], ...s0.players[0].landscape[0].slice(1)],
              ...s0.players[0].landscape.slice(1),
            ] as Tile[][],
          },
          ...s0.players.slice(1),
        ],
        frame: {
          ...s0.frame,
          settlementRound: SettlementRound.C,
        },
      }
      const c0 = complete(s1)(['WORK_CONTRACT', 'G02'])
      expect(c0).toStrictEqual(['Wn', 'Wh', 'PnPn'])
    })

    it('terminates when enough options', () => {
      const c0 = complete(s0)(['WORK_CONTRACT', 'G02', 'Pn'])
      expect(c0).toStrictEqual([''])
    })

    it('empty completions when weird params', () => {
      const c0 = complete(s0)(['WORK_CONTRACT', 'G02', 'Pn', 'Pn'])
      expect(c0).toStrictEqual([])
    })
  })
})

import { BuildingEnum, Clergy, Frame, GameStatePlaying, LandEnum, PlayerColor, Tableau, Tile } from '../../types'
import {
  findBuildingWithoutOffset,
  districtPrices,
  findBuilding,
  findClergy,
  plotPrices,
  checkCloisterAdjacency,
  allDwellingPoints,
  allBuildingPoints,
} from '../landscape'

describe('board/landscape', () => {
  describe('findBuildingWithoutOffset', () => {
    const landscape: Tile[][] = [
      [
        [LandEnum.Plains, BuildingEnum.Bathhouse],
        [LandEnum.Plains],
        [LandEnum.Plains, BuildingEnum.Camera],
        [LandEnum.Hillside, BuildingEnum.CloisterLibrary],
        [LandEnum.Hillside, BuildingEnum.ChamberOfWonders, Clergy.LayBrother1B],
      ],
      [
        [LandEnum.Plains, BuildingEnum.Peat],
        [LandEnum.Plains, BuildingEnum.Forest],
        [LandEnum.Hillside, BuildingEnum.FarmYardB, Clergy.PriorB],
        [LandEnum.Hillside],
        [LandEnum.Hillside],
      ],
    ]
    it('finds the building', () => {
      expect(findBuildingWithoutOffset(BuildingEnum.FarmYardB)(landscape)).toStrictEqual([1, 2])
    })
    it('returns undefined if not found', () => {
      expect(findBuildingWithoutOffset(BuildingEnum.Alehouse)(landscape)).toBeUndefined()
    })
  })
  describe('findClergy', () => {
    const landscape: Tile[][] = [
      [
        [LandEnum.Plains, BuildingEnum.Bathhouse],
        [LandEnum.Plains],
        [LandEnum.Plains, BuildingEnum.Camera],
        [LandEnum.Hillside, BuildingEnum.CloisterLibrary],
        [LandEnum.Hillside, BuildingEnum.ChamberOfWonders, Clergy.LayBrother1B],
      ],
      [
        [LandEnum.Plains, BuildingEnum.Peat],
        [LandEnum.Plains, BuildingEnum.Forest],
        [LandEnum.Hillside, BuildingEnum.FarmYardB, Clergy.PriorB],
        [LandEnum.Hillside],
        [LandEnum.Hillside],
      ],
    ]
    it('finds the lay brother', () => {
      expect(findClergy([Clergy.LayBrother1B])(landscape)).toStrictEqual([[0, 4, ['H', 'F25', 'LB1B']]])
    })
    it('returns finds the prior', () => {
      expect(findClergy([Clergy.PriorB])(landscape)).toStrictEqual([[1, 2, ['H', 'LB2', 'PRIB']]])
    })
    it('returns empty if it cant find', () => {
      expect(findClergy([Clergy.LayBrother2B])(landscape)).toStrictEqual([])
    })
  })

  describe('checkCloisterAdjacencyPlayer', () => {
    const p0 = {
      color: PlayerColor.Red,
      landscape: [
        [[], [], ['P'], ['P'], ['P'], ['P'], ['H'], [], []],
        [[], [], ['P'], ['P'], ['P'], ['P'], ['H'], [], []],
        [[], [], ['P'], ['P'], ['P'], ['P'], ['H', 'LR1'], ['H'], ['M']],
        [[], [], ['P'], ['P'], ['P', 'LR2'], ['P'], ['P', 'LR3'], ['H'], ['.']],
      ] as Tile[][],
      landscapeOffset: 2,
    } as Tableau
    const s0 = {
      players: [p0],
      frame: {
        neutralBuildingPhase: false,
        activePlayerIndex: 0,
      } as Frame,
    } as GameStatePlaying
    const building = BuildingEnum.CloisterWorkshop

    it('returns state if building is not a cloister', () => {
      const building = BuildingEnum.Bakery
      expect(checkCloisterAdjacency(0, 0, building)(s0)).toBe(s0)
    })
    it('returns undefined if building is cloister and nothing around it', () => {
      expect(checkCloisterAdjacency(0, 0, building)(s0)).toBeUndefined()
    })
    it('returns state if cloister to west', () => {
      expect(checkCloisterAdjacency(1, 5, building)(s0)).toBe(s0)
    })
    it('returns state if cloister to north', () => {
      const p1 = {
        ...p0,
        landscape: [
          [[], [], ['P'], ['P'], ['P'], ['P'], ['H', 'LR1'], [], []],
          [[], [], ['P'], ['P'], ['P', 'LR2'], ['P'], ['P', 'LR3'], [], []],
          [[], [], ['P'], ['P'], ['P'], ['P'], ['H'], [], []],
        ] as Tile[][],
        landscapeOffset: 0,
      } as Tableau
      const s1 = {
        ...s0,
        players: [p1, ...s0.players.slice(1)],
      }
      expect(checkCloisterAdjacency(2, 4, building)(s1)).toBe(s1)
    })
    it('returns state if cloister to south', () => {
      expect(checkCloisterAdjacency(0, 4, building)(s0)).toBe(s0)
    })
    it('returns state if cloister to east', () => {
      expect(checkCloisterAdjacency(1, 3, building)(s0)).toBe(s0)
    })
    it('returns state if from a mountain column, the northwest spot is a cloister', () => {
      const p1 = {
        ...p0,
        landscape: [
          [[], [], ['P'], ['P'], ['P'], ['P'], ['H'], [], []],
          [[], [], ['P'], ['P'], ['P'], ['P'], ['H'], [], []],
          [[], [], ['P'], ['P'], ['P'], ['P'], ['H', 'LR1']],
          [[], [], ['P'], ['P'], ['P', 'LR2'], ['P'], ['P', 'LR3'], ['H', 'F17'], ['M']],
          [[], [], [], [], [], [], [], ['H'], ['.']],
        ] as Tile[][],
        landscapeOffset: 2,
      } as Tableau
      const s1 = {
        ...s0,
        players: [p1, ...s0.players.slice(1)],
      }
      expect(checkCloisterAdjacency(1, 6, building)(s1)).toBe(s1)
    })
    it('returns state if from a mountain column, the southwest spot is a cloister', () => {
      const p1 = {
        ...p0,
        landscape: [
          [[], [], ['P'], ['P'], ['P'], ['P'], ['H'], [], []],
          [[], [], ['P'], ['P'], ['P'], ['P'], ['H'], [], []],
          [[], [], ['P'], ['P'], ['P'], ['P'], ['H', 'LR1'], ['H'], ['M']],
          [[], [], ['P'], ['P'], ['P', 'LR2'], ['P'], ['P', 'LR3'], ['H', 'F17'], ['.']],
        ] as Tile[][],
        landscapeOffset: 2,
      } as Tableau
      const s1 = {
        ...s0,
        players: [p1, ...s0.players.slice(1)],
      }
      expect(checkCloisterAdjacency(0, 6, building)(s1)).toBe(s1)
    })
    it('returns undefined if a cloister exists to east mountain from -1', () => {
      // this should actually be impossible to do
      const p1 = {
        ...p0,
        landscape: [
          [[], [], ['P'], ['P'], ['P'], ['P'], ['H'], ['H'], ['M']],
          [[], [], ['P'], ['P'], ['P'], ['P'], ['P'], ['H'], ['.']],
          [[], [], ['P'], ['P'], ['P'], ['P'], ['H'], ['H'], ['M', 'F17']],
          [[], [], ['P'], ['P'], ['P'], ['P'], ['P'], ['H'], ['.']],
        ] as Tile[][],
        landscapeOffset: 0,
      } as Tableau
      const s1 = {
        ...s0,
        players: [p1, ...s0.players.slice(1)],
      }
      expect(checkCloisterAdjacency(1, 5, building)(s1)).toBeUndefined()
    })
    it('returns state if a cloister exists to southeast mountain from 0', () => {
      // this should actually be impossible to do
      const p1 = {
        ...p0,
        landscape: [
          [[], [], ['P'], ['P'], ['P'], ['P'], ['H'], ['H'], ['M']],
          [[], [], ['P'], ['P'], ['P'], ['P'], ['P'], ['H'], ['.']],
          [[], [], ['P'], ['P'], ['P'], ['P'], ['H'], ['H'], ['M', 'F17']],
          [[], [], ['P'], ['P'], ['P'], ['P'], ['P'], ['H'], ['.']],
        ] as Tile[][],
        landscapeOffset: 0,
      } as Tableau
      const s1 = {
        ...s0,
        players: [p1, ...s0.players.slice(1)],
      }
      expect(checkCloisterAdjacency(2, 5, building)(s1)).toBe(s1)
    })
    it('returns state if a cloister exists to northeast mountain from +1', () => {
      // this should actually be impossible to do
      const p1 = {
        ...p0,
        landscape: [
          [[], [], ['P'], ['P'], ['P'], ['P'], ['H'], ['H'], ['M']],
          [[], [], ['P'], ['P'], ['P'], ['P'], ['P'], ['H'], ['.']],
          [[], [], ['P'], ['P'], ['P'], ['P'], ['H'], ['H'], ['M', 'F17']],
          [[], [], ['P'], ['P'], ['P'], ['P'], ['P'], ['H'], ['.']],
        ] as Tile[][],
        landscapeOffset: 0,
      } as Tableau
      const s1 = {
        ...s0,
        players: [p1, ...s0.players.slice(1)],
      }
      expect(checkCloisterAdjacency(3, 5, building)(s1)).toBe(s1)
    })

    it('returns undefined if a cloister exists to east mountain from -1 when offset', () => {
      // this should actually be impossible to do
      const p1 = {
        ...p0,
        landscape: [
          [[], [], ['P'], ['P'], ['P'], ['P'], ['H'], [], []],
          [[], [], ['P'], ['P'], ['P'], ['P'], ['P'], ['H'], ['M', 'F17']],
          [[], [], ['P'], ['P'], ['P'], ['P'], ['H'], ['H'], ['.']],
          [[], [], ['P'], ['P'], ['P'], ['P'], ['P'], [], []],
        ] as Tile[][],
        landscapeOffset: 0,
      } as Tableau
      const s1 = {
        ...s0,
        players: [p1, ...s0.players.slice(1)],
      }
      expect(checkCloisterAdjacency(0, 5, building)(s1)).toBeUndefined()
    })
    it('returns state if a cloister exists to southeast mountain from 0 when offset', () => {
      // this should actually be impossible to do
      const p1 = {
        ...p0,
        landscape: [
          [[], [], ['P'], ['P'], ['P'], ['P'], ['H'], [], []],
          [[], [], ['P'], ['P'], ['P'], ['P'], ['P'], ['H'], ['M', 'F17']],
          [[], [], ['P'], ['P'], ['P'], ['P'], ['H'], ['H'], ['.']],
          [[], [], ['P'], ['P'], ['P'], ['P'], ['P'], [], []],
        ] as Tile[][],
        landscapeOffset: 0,
      } as Tableau
      const s1 = {
        ...s0,
        players: [p1, ...s0.players.slice(1)],
      }
      expect(checkCloisterAdjacency(1, 5, building)(s1)).toBe(s1)
    })
    it('returns state if a cloister exists to northeast mountain from +1 when offset', () => {
      // this should actually be impossible to do
      const p1 = {
        ...p0,
        landscape: [
          [[], [], ['P'], ['P'], ['P'], ['P'], ['H'], [], []],
          [[], [], ['P'], ['P'], ['P'], ['P'], ['P'], ['H'], ['M', 'F17']],
          [[], [], ['P'], ['P'], ['P'], ['P'], ['H'], ['H'], ['.']],
          [[], [], ['P'], ['P'], ['P'], ['P'], ['P'], [], []],
        ] as Tile[][],
        landscapeOffset: 0,
      } as Tableau
      const s1 = {
        ...s0,
        players: [p1, ...s0.players.slice(1)],
      }
      expect(checkCloisterAdjacency(2, 5, building)(s1)).toBe(s1)
    })
  })

  describe('districtPrices', () => {
    it('gives an array large to small for single player', () => {
      expect(districtPrices({ players: 1, country: 'france', length: 'long' })).toStrictEqual([
        8, 7, 6, 5, 5, 4, 4, 3, 2,
      ])
    })
    it('gives an array small to large for multiplayer', () => {
      expect(districtPrices({ players: 3, country: 'ireland', length: 'short' })).toStrictEqual([
        2, 3, 4, 4, 5, 5, 6, 7, 8,
      ])
    })
  })

  describe('plotPrices', () => {
    it('gives an array large to small for single player', () => {
      expect(plotPrices({ players: 1, country: 'ireland', length: 'short' })).toStrictEqual([7, 6, 6, 5, 5, 5, 4, 4, 3])
    })
    it('gives an array small to large for multiplayer', () => {
      expect(plotPrices({ players: 3, country: 'ireland', length: 'long' })).toStrictEqual([3, 4, 4, 5, 5, 5, 6, 6, 7])
    })
  })

  describe('findBuilding', () => {
    const landscape: Tile[][] = [
      [
        [LandEnum.Plains, BuildingEnum.Bathhouse],
        [LandEnum.Plains],
        [LandEnum.Plains, BuildingEnum.Camera],
        [LandEnum.Hillside, BuildingEnum.CloisterLibrary],
        [LandEnum.Hillside, BuildingEnum.ChamberOfWonders, Clergy.LayBrother1B],
      ],
      [
        [LandEnum.Plains, BuildingEnum.Peat],
        [LandEnum.Plains, BuildingEnum.Forest],
        [LandEnum.Hillside, BuildingEnum.FarmYardB, Clergy.PriorB],
        [LandEnum.Hillside],
        [LandEnum.Hillside],
      ],
    ]
    it('finds the building', () => {
      expect(findBuilding(landscape, 0, BuildingEnum.FarmYardB)).toStrictEqual({ row: 1, col: 2 })
    })
    it('returns undefined if not found', () => {
      expect(findBuilding(landscape, 0, BuildingEnum.Alehouse)).toStrictEqual({ row: undefined, col: undefined })
    })
  })

  describe('allBuildingPoints', () => {
    const s0 = {
      players: [
        {
          color: PlayerColor.Red,
          landscape: [
            [[], [], ['P', 'LPE'], ['P'], ['P'], ['P'], ['H'], [], []],
            [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['H', 'LR1'], ['H', 'F08'], ['M']],
            [[], [], ['P', 'G07'], ['P', 'LFO'], ['P', 'LR2'], ['P'], ['P', 'LR3'], ['H', 'F09'], ['.']],
            [[], [], ['P', 'G19'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['H', 'G02'], [], []],
          ] as Tile[][],
          landscapeOffset: 1,
        },
        {
          color: PlayerColor.Green,
          landscape: [
            [[], [], ['P'], ['P'], ['P', 'F04'], ['P'], ['H', 'LG1'], ['H'], ['M']],
            [[], [], ['P'], ['P'], ['P', 'LG2'], ['P'], ['P', 'LG3'], ['H'], ['.']],
            [[], [], ['P'], ['P'], ['P', 'F03'], ['P'], ['H', 'G01'], [], []],
          ] as Tile[][],
          landscapeOffset: 0,
        },
      ] as Tableau[],
      frame: {
        neutralBuildingPhase: false,
        activePlayerIndex: 0,
      } as Frame,
    } as GameStatePlaying

    it('works for a null board', () => {
      expect(allBuildingPoints([[]])).toBe(0)
    })

    it('calculates the score of boards', () => {
      expect(allBuildingPoints(s0.players[0].landscape)).toBe(26)
      expect(allBuildingPoints(s0.players[1].landscape)).toBe(17)
    })
  })
  describe('allDwellingPoints', () => {
    const s0 = {
      players: [
        {
          color: PlayerColor.Blue,
          landscape: [
            [[], [], ['P', 'LPE'], ['P'], ['P'], ['P'], ['H'], [], []],
            [[], [], ['P', 'LPE'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['H', 'LB1'], ['H', 'F08'], ['M', 'SR1']],
            [[], [], ['P', 'G07'], ['P', 'LFO'], ['P', 'LB2'], ['P'], ['P', 'LB3'], ['H', 'F09'], ['.']],
            [[], [], ['P', 'G19'], ['P', 'LFO'], ['P', 'LFO'], ['P'], ['H', 'G02'], ['SR2'], []],
          ] as Tile[][],
          landscapeOffset: 1,
        },
        {
          color: PlayerColor.White,
          landscape: [
            [[], [], ['P'], ['P'], ['P', 'LFO'], ['P', 'LFO'], ['P', 'F10'], ['H'], ['M']],
            [[], [], ['P'], ['P'], ['P', 'LFO'], ['P', 'LFO'], ['P', 'G12'], ['H', 'SW4'], ['.']],
            [[], [], ['P'], ['P'], ['P', 'F04'], ['P', 'LFO'], ['H', 'LW1'], ['H', 'SW3'], ['M']],
            [[], [], ['P'], ['P'], ['P', 'LW2'], ['P', 'SW1'], ['P', 'LW3'], ['H'], ['.']],
            [[], [], ['P'], ['P'], ['P', 'F03'], ['P', 'LFO'], ['H', 'G01'], [], []],
          ] as Tile[][],
          landscapeOffset: 2,
        },
      ] as Tableau[],
      frame: {
        neutralBuildingPhase: false,
        activePlayerIndex: 0,
      } as Frame,
    } as GameStatePlaying

    it('works for a null board', () => {
      expect(allDwellingPoints([[]])).toStrictEqual([])
    })

    // it('calculates the score of boards', () => {
    //   expect(allDwellingPoints(s0.players[0].landscape)).toStrictEqual([])
    //   expect(allDwellingPoints(s0.players[1].landscape)).toStrictEqual([])
    // })
  })
})

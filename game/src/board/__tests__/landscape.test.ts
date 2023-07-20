import { BuildingEnum, Clergy, Frame, GameStatePlaying, LandEnum, PlayerColor, Tableau, Tile } from '../../types'
import {
  findBuildingWithoutOffset,
  districtPrices,
  findBuilding,
  findClergy,
  plotPrices,
  checkCloisterAdjacency,
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
})

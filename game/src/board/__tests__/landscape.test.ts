import { BuildingEnum, Clergy, LandEnum, Tile } from '../../types'
import { findBuilding, findClergy } from '../landscape'

describe('board/landscape', () => {
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
      expect(findBuilding(BuildingEnum.FarmYardB)(landscape)).toStrictEqual([1, 2])
    })
    it('returns undefined if not found', () => {
      expect(findBuilding(BuildingEnum.Alehouse)(landscape)).toBeUndefined()
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
})

import { BuildingEnum, SettlementRound } from '../../types'
import { costForBuilding, roundBuildings } from '../buildings'

describe('build/buildings', () => {
  describe('costForBuilding', () => {
    it('has appropriate building materials for Priory', () => {
      expect(costForBuilding(BuildingEnum.Priory)).toStrictEqual({ clay: 1, wood: 1 })
    })
  })
  describe('roundBuildings', () => {
    it('returns a list of buildings', () => {
      expect(roundBuildings({ players: 3, country: 'france', length: 'long' }, SettlementRound.B)).toStrictEqual([
        'F20',
        'F21',
        'G22',
        'F24',
        'G26',
      ])
    })
  })
})

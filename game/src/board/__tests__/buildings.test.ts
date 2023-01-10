import { BuildingEnum, SettlementRound } from '../../types'
import { costForBuilding, isCloisterBuilding, roundBuildings } from '../buildings'

describe('build/buildings', () => {
  describe('costForBuilding', () => {
    it('has appropriate building materials for Priory', () => {
      expect(costForBuilding(BuildingEnum.Priory)).toStrictEqual({ clay: 1, wood: 1 })
    })
  })
  describe('roundBuildings', () => {
    it('returns a list of buildings given a round', () => {
      expect(roundBuildings({ players: 3, country: 'france', length: 'long' }, SettlementRound.B)).toStrictEqual([
        'F20',
        'F21',
        'G22',
        'F24',
        'G26',
      ])
    })
    it('does not contain specific cards in solo', () => {
      const s = roundBuildings({ players: 1, country: 'france', length: 'long' }, SettlementRound.S)
      const a = roundBuildings({ players: 1, country: 'france', length: 'long' }, SettlementRound.A)
      const b = roundBuildings({ players: 1, country: 'france', length: 'long' }, SettlementRound.B)
      const c = roundBuildings({ players: 1, country: 'france', length: 'long' }, SettlementRound.C)
      const d = roundBuildings({ players: 1, country: 'france', length: 'long' }, SettlementRound.D)
      expect(s).not.toContain('F10')
      expect(a).not.toContain('F10')
      expect(b).not.toContain('F10')
      expect(c).not.toContain('F10')
      expect(d).not.toContain('F10')
    })
  })
  describe('isCloisterBuilding', () => {
    it('considers Priory as a cloister', () => {
      expect(isCloisterBuilding(BuildingEnum.Priory)).toBeTruthy()
    })
    it('does not consider Market as a cloister', () => {
      expect(isCloisterBuilding(BuildingEnum.Market)).toBeFalsy()
    })
    it('does defines undefined as false', () => {
      expect(isCloisterBuilding(undefined)).toBeFalsy()
    })
  })
})

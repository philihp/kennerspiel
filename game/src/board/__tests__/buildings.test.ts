import { SettlementRound } from '../../types'
import { roundBuildings } from '../buildings'

describe('build/buildings', () => {
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

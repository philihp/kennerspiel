import { config } from '../../commands/config'
import { start } from '../../commands/start'
import { reducer, initialState } from '../../reducer'
import { BuildingEnum, GameStatePlaying, LandEnum, PlayerColor, ResourceEnum } from '../../types'
import { peatCoalKiln } from '../peatCoalKiln'

describe('buildings/peatCoalKiln', () => {
  describe('peatCoalKiln', () => {
    it('goes through a happy path', () => {
      expect.assertions(4)
      const s0 = initialState
      const s1 = config(s0, { country: 'france', length: 'short', players: 3 })!
      expect(s1).toBeDefined()
      const s2 = start(s1, { colors: [PlayerColor.Red, PlayerColor.Blue, PlayerColor.Green], seed: 42 })!
      expect(s2).toBeDefined()
      expect(s2.activePlayerIndex).toBe(0)
      s2.players[0].landscape = [
        ...s2.players[0].landscape.slice(0, 0),
        [
          ...s2.players[0].landscape[0].slice(3),
          [s2.players[0].landscape[0][3][0], BuildingEnum.PeatCoalKiln],
          ...s2.players[0].landscape[0].slice(4),
        ],
        ...s2.players[0].landscape.slice(1),
      ]
      s2.players[0].penny = 10
      s2.players[0].peat = 10
      s2.players[0].coal = 10
      const s3 = peatCoalKiln('PtPtPt')(s2)!
      expect(s3.players[0]).toMatchObject({
        penny: 11,
        peat: 7,
        coal: 14,
      })
    })
  })
})

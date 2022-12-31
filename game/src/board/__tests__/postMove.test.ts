import { config } from '../../commands/config'
import { start } from '../../commands/start'
import { initialState } from '../../reducer'
import { GameCommandConfigParams, GameStateSetup, PlayerColor } from '../../types'
import { postMove as unconfiguredPostMove } from '../postMove'

describe('board/postMove', () => {
  const seed = 42
  const colors = [PlayerColor.White, PlayerColor.Red, PlayerColor.Blue, PlayerColor.Green]
  describe('3 players', () => {
    const gameConfig: GameCommandConfigParams = { country: 'france', length: 'long', players: 3 }
    const postMove = unconfiguredPostMove(gameConfig)
    const s0 = initialState
    const s1: GameStateSetup = config(s0, gameConfig)!
    const s2 = start(s1, { seed, colors: colors.slice(0, 3) })!
    const s3 = postMove(s2)!
    it('advances active player', () => {
      expect(s2.activePlayerIndex).toBe(0)
      expect(s3.activePlayerIndex).toBe(1)
    })
    it('advances moveInRound', () => {
      expect(s2.moveInRound).toBe(1)
      expect(s3.moveInRound).toBe(2)
    })
  })
})

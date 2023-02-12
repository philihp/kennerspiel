import { union } from 'ramda'
import { GameStatePlaying } from '../../types'
import { withEachPlayer } from '../player'
import { roundSettlements } from '../settlements'

export const introduceSettlements = (state: GameStatePlaying | undefined): GameStatePlaying | undefined =>
  withEachPlayer(
    (player) =>
      state && {
        ...player,
        settlements: union(player.settlements, roundSettlements(player.color, state.frame.settlementRound)),
      }
  )(state)

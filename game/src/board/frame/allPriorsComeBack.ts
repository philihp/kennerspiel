import { any, map } from 'ramda'
import { GameStatePlaying } from '../../types'
import { clergyForColor, isLayBrother, isPrior, priors, withEachPlayer } from '../player'
import { tileWithoutClergy } from '../tile'

export const allPriorsComeBack = (state: GameStatePlaying | undefined): GameStatePlaying | undefined =>
  withEachPlayer((player) => {
    // short circuit if player already has unplaced prior
    if (any(isPrior, player.clergy)) return player
    const [, , prior] = clergyForColor(player.color)
    const landscapeWithoutClergy = map(map(tileWithoutClergy(priors(state))))(player.landscape)
    return {
      ...player,
      clergy: [...player.clergy.filter(isLayBrother), prior],
      landscape: landscapeWithoutClergy,
    }
  })(state)

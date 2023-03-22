import { any, filter, map } from 'ramda'
import { StateReducer } from '../../types'
import { clergyForColor, isLayBrother, isPrior, priors, withEachPlayer } from '../player'
import { tileWithoutClergy } from '../tile'

export const allPriorsComeBack: StateReducer = (state) =>
  withEachPlayer((player) => {
    if (state === undefined) return undefined
    // short circuit if player already has unplaced prior
    if (any(isPrior, player.clergy)) return player
    const prior = filter(isPrior, clergyForColor(state.config)(player.color))[0]
    const landscapeWithoutClergy = map(map(tileWithoutClergy(priors(state))))(player.landscape)
    return {
      ...player,
      clergy: [...player.clergy.filter(isLayBrother), prior],
      landscape: landscapeWithoutClergy,
    }
  })(state)

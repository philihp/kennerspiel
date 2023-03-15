import { pipe, filter, identity } from 'ramda'
import { addBonusAction } from '../board/frame'
import { findClergy } from '../board/landscape'
import { payCost, isPrior, clergyForColor, withActivePlayer } from '../board/player'
import { parseResourceParam } from '../board/resource'
import { GameCommandEnum, StateReducer, Tableau } from '../types'

const returnPrior = (player: Tableau | undefined): Tableau | undefined => {
  if (player === undefined) return undefined
  const priors = filter(isPrior, clergyForColor(player.color))
  const [[row, col, tile]] = findClergy(priors)(player.landscape)
  const [land, building, _clergy] = tile
  return {
    ...player,
    clergy: [...player.clergy, ...priors],
    landscape: [
      ...player.landscape.slice(0, row),
      [
        //
        ...player.landscape[row].slice(0, col),
        [land, building],
        ...player.landscape[row].slice(col + 1),
      ],
      ...player.landscape.slice(row + 1),
    ],
  }
}

export const locutory = (param = ''): StateReducer => {
  const { penny = 0 } = parseResourceParam(param)
  if (penny < 2) return identity
  return pipe(
    withActivePlayer(
      pipe(
        //
        returnPrior,
        payCost({ penny })
      )
    ),
    addBonusAction(GameCommandEnum.BUILD)
  )
}

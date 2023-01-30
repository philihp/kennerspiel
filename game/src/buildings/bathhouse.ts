import { pipe } from 'ramda'
import { clergyForColor, getCost, subtractCoins, withActivePlayer } from '../board/player'
import { Tableau, Tile } from '../types'

const takeBackAllClergy = (player: Tableau | undefined): Tableau | undefined => {
  if (player === undefined) return undefined
  const newClergy = clergyForColor(player.color)
  let dirty = false
  const newLandscape = player.landscape.map((landRow) =>
    landRow.map((landStack) => {
      if (landStack.length === 0) return landStack
      const [terrain, building, clergy] = landStack
      if (clergy === undefined) return landStack
      if (!newClergy.includes(clergy)) return landStack
      dirty = true
      return [terrain, building] as Tile
    })
  )
  if (!dirty) return player
  return {
    ...player,
    clergy: newClergy,
    landscape: newLandscape,
  }
}

export const bathhouse = () =>
  withActivePlayer(
    pipe(
      //
      subtractCoins(1),
      getCost({ book: 1, pottery: 1 }),
      takeBackAllClergy
    )
  )

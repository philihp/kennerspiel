import { Clergy, Tile } from '../types'

export const tileWithoutClergy = (denyList: Clergy[]) => (landStack: Tile) => {
  if (landStack.length === 0) return landStack
  const [terrain, building, clergy] = landStack
  if (clergy === undefined) return landStack
  if (denyList.includes(clergy)) return [terrain, building] as Tile
  return landStack
}

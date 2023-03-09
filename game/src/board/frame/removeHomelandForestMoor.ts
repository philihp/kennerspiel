import { Tableau } from '../../types'

export const removeHomelandForestMoor = (player: Tableau) => {
  const landscape = [[...player.landscape[0]], player.landscape[1]]
  return {
    ...player,
    landscape,
  }
}

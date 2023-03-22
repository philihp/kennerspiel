import { Tableau, Tile } from '../../types'

export const removeHomelandForestMoor = (player: Tableau) => {
  const landscape: Tile[][] = [
    [
      ...player.landscape[0].slice(0, 2),
      [player.landscape[0][2][0]] as Tile,
      [player.landscape[0][3][0]] as Tile,
      ...player.landscape[0].slice(4),
    ],
    player.landscape[1],
  ]
  return {
    ...player,
    landscape,
  }
}

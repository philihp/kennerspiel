import { Tile } from 'hathora-et-labora-game'
import { useInstanceContext } from '@/context/InstanceContext'
import { TinyLandscapeIso } from './tinyLandscapeIso'
import { TinyLandscapeGrid } from './tinyLandscapeGrid'

interface Props {
  landscape: Tile[][]
  offset?: number
  rowMin?: number
  rowMax?: number
  showTerrain?: boolean
}

export const TinyLandscape = (props: Props) => {
  const { flags } = useInstanceContext()
  return flags?.isometric ? <TinyLandscapeIso {...props} /> : <TinyLandscapeGrid {...props} />
}

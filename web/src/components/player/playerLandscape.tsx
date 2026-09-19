import { Tile } from 'hathora-et-labora-game'
import { useInstanceContext } from '@/context/InstanceContext'
import { IsoLandscape } from './iso/isoLandscape'
import { GridLandscape } from './grid/gridLandscape'

interface Props {
  landscape: Tile[][]
  offset: number
  active: boolean
}

export const PlayerLandscape = (props: Props) => {
  const { flags } = useInstanceContext()
  return flags?.isometric ? <IsoLandscape {...props} /> : <GridLandscape {...props} />
}

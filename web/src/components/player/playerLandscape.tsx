import { Tile } from 'hathora-et-labora-game'
import { IsoLandscape } from './iso/isoLandscape'

interface Props {
  landscape: Tile[][]
  offset: number
  active: boolean
}

export const PlayerLandscape = ({ landscape, offset, active }: Props) => (
  <IsoLandscape landscape={landscape} offset={offset} active={active} />
)

import { Tableau } from 'hathora-et-labora-game'
import { PlayerColor } from 'hathora-et-labora-game/dist/types'
import { PlayerClergy } from './playerClergy'
import { PlayerResources } from './playerResources'
import { PlayerLandscape } from './playerLandscape'
import { PlayerWonders } from './playerWonders'
import { PlayerSettlements } from './playerSettlements'

type TableauProps = {
  tableau: Tableau
  active: boolean
}

type ColorStyle = {
  backgroundColor?: string
  borderColor?: string
}

const colorToStyle = (c?: PlayerColor): ColorStyle => {
  switch (c) {
    case PlayerColor.Blue:
      return { borderColor: '#00ff41', backgroundColor: '#0a1628' }
    case PlayerColor.Red:
      return { borderColor: '#f7b731', backgroundColor: '#1a0a00' }
    case PlayerColor.Green:
      return { borderColor: '#00ff41', backgroundColor: '#001a0a' }
    case PlayerColor.White:
      return { borderColor: '#00ff41', backgroundColor: '#16213e' }
    default:
      return {}
  }
}

const colorToChar = (c?: PlayerColor): string => {
  switch (c) {
    case PlayerColor.Blue:
      return 'B'
    case PlayerColor.Red:
      return 'R'
    case PlayerColor.Green:
      return 'G'
    case PlayerColor.White:
      return 'W'
    default:
      return '0'
  }
}

export const Player = ({ tableau, active }: TableauProps) => {
  const { color, clergy, landscape, landscapeOffset, settlements, wonders, ...resources } = tableau
  return (
    <div
      key={color}
      style={{
        borderWidth: 1,
        borderRadius: 16,
        borderStyle: 'solid',
        ...colorToStyle(color),
        padding: 3,
        marginBottom: 5,
      }}
    >
      <PlayerClergy clergy={clergy} color={color} active={active} />
      <PlayerWonders wonders={wonders} />
      <PlayerResources {...resources} active={active} />
      <PlayerLandscape landscape={landscape} offset={landscapeOffset} active={active} />
      <PlayerSettlements settlements={settlements} color={colorToChar(color)} />
    </div>
  )
}

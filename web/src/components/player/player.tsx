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
      return { borderColor: '#80b1d3', backgroundColor: '#dae8f2' } // , borderColor: '#5f849e' }
    case PlayerColor.Red:
      return { borderColor: '#fb8072', backgroundColor: '#fceceb' } // , borderColor: '#ad574d' }
    case PlayerColor.Green:
      return { borderColor: '#b3de69', backgroundColor: '#f2fce1' } // , borderColor: '#87a74f' }
    case PlayerColor.White:
      return { borderColor: '#d9d9d9', backgroundColor: '#ededed' } // , borderColor: '#b1b1b1' }
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
      <PlayerResources {...resources} />
      <PlayerLandscape landscape={landscape} offset={landscapeOffset} active={active} />
      <PlayerWonders wonders={wonders} />
      <PlayerSettlements settlements={settlements} color={colorToChar(color)} />
    </div>
  )
}

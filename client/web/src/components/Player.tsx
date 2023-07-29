import { EngineColor, EngineTableau } from '../../../../api/types'
import { PlayerClergy } from './PlayerClergy'
import { PlayerLandscape } from './PlayerLandscape'
import { PlayerSettlements } from './PlayerSettlements'
import { PlayerWonders } from './PlayerWonders'
import { PlayerResources } from './PlayerResources'

interface Props {
  player: EngineTableau
  active: boolean
}

type ColorStyle = {
  backgroundColor?: string
  borderColor?: string
}

const colorToStyle = (c?: EngineColor): ColorStyle => {
  switch (c) {
    case EngineColor.Blue:
      return { borderColor: '#80b1d3', backgroundColor: '#dae8f2' } // , borderColor: '#5f849e' }
    case EngineColor.Red:
      return { borderColor: '#fb8072', backgroundColor: '#fceceb' } // , borderColor: '#ad574d' }
    case EngineColor.Green:
      return { borderColor: '#b3de69', backgroundColor: '#f2fce1' } // , borderColor: '#87a74f' }
    case EngineColor.White:
      return { borderColor: '#d9d9d9', backgroundColor: '#ededed' } // , borderColor: '#b1b1b1' }
    default:
      return {}
  }
}

export const Player = ({ player, active }: Props) => {
  const { color, clergy, landscape, landscapeOffset, settlements, wonders, ...resources } = player
  return (
    <div
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
      <PlayerLandscape landscape={landscape} offset={landscapeOffset} active={active} />
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <PlayerResources {...resources} />
      <PlayerWonders wonders={wonders} />
      <PlayerSettlements settlements={settlements} />
    </div>
  )
}

import { EngineTableau } from '../../../../api/types'
import { PlayerClergy } from './PlayerClergy'
import { PlayerLandscape } from './PlayerLandscape'
import { PlayerSettlements } from './PlayerSettlements'
import { PlayerWonders } from './PlayerWonders'
import { PlayerResources } from './PlayerResources'

interface Props {
  player: EngineTableau
  active: boolean
}

export const Player = ({ player, active }: Props) => {
  const { color, clergy, landscape, landscapeOffset, settlements, wonders, ...resources } = player
  return (
    <div>
      <PlayerClergy clergy={clergy} color={color} />
      <PlayerLandscape landscape={landscape} offset={landscapeOffset} active={active} />
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <PlayerResources active={active} {...resources} />
      <PlayerWonders wonders={wonders} />
      <PlayerSettlements settlements={settlements} />
    </div>
  )
}

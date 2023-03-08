import { EngineTableau } from '../../../../api/types'
import { PlayerClergy } from './PlayerClergy'
import { PlayerLandscape } from './PlayerLandscape'
import { PlayerSettlements } from './PlayerSettlements'
import { PlayerWonders } from './PlayerWonders'
import { PlayerResources } from './PlayerResources'

interface Props {
  player: EngineTableau
}

export const Player = ({ player }: Props) => {
  const { color, clergy, landscape, landscapeOffset, settlements, wonders, ...resources } = player
  return (
    <div>
      <PlayerClergy clergy={clergy} />
      <PlayerLandscape landscape={landscape} offset={landscapeOffset} />
      <PlayerSettlements settlements={settlements} />
      <PlayerWonders wonders={wonders} />
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <PlayerResources {...resources} />
    </div>
  )
}

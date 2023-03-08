import { EngineTableau } from '../../../../api/types'
import { PlayerClergy } from './PlayerClergy'

interface Props {
  player: EngineTableau
}

export const Player = ({ player }: Props) => {
  const { color, clergy, ...elsePlayer } = player
  return (
    <div>
      <PlayerClergy clergy={clergy} />
      <pre>{JSON.stringify(elsePlayer, undefined, 2)}</pre>
    </div>
  )
}

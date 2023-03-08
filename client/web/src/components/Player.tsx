import { EngineTableau } from '../../../../api/types'

interface Props {
  player: EngineTableau
}

export const Player = ({ player }: Props) => <pre>{JSON.stringify(player)}</pre>

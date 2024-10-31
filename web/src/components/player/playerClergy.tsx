import { useInstanceContext } from '@/context/InstanceContext'
import { Clergy } from '../clergy'
import { PlayerColor } from 'hathora-et-labora-game/dist/types'

interface Props {
  color: PlayerColor
  clergy: string[]
  active: boolean
}

export const PlayerClergy = ({ clergy, color, active }: Props) => {
  const { controls, addPartial } = useInstanceContext()

  const canUsePrior = active && controls?.completion?.includes('WITH_PRIOR')
  const handleClick = () => {
    addPartial(`WITH_PRIOR`)
  }

  return (
    <div>
      {clergy.map((id) => (
        <Clergy key={id} id={id} />
      ))}
      {canUsePrior && (
        <button type="button" onClick={handleClick}>
          Use Prior
        </button>
      )}
    </div>
  )
}

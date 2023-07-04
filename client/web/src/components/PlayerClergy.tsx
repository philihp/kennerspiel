import { EngineColor } from '../../../../api/types'
import { useHathoraContext } from '../context/GameContext'
import { Clergy } from './Clergy'

interface Props {
  color: EngineColor
  clergy: string[]
  active: boolean
}

export const PlayerClergy = ({ clergy, color, active }: Props) => {
  const { state, control } = useHathoraContext()

  const canUsePrior = active && state?.control?.completion?.includes('WITH_PRIOR')
  const handleClick = () => {
    control(`WITH_PRIOR`)
  }

  return (
    <div>
      {clergy.reverse().map((id) => (
        <Clergy key={id} id={id} />
      ))}
      {canUsePrior && (
        <button type="button" onClick={handleClick}>
          Use Prior
        </button>
      )}
      {/* {JSON.stringify(user && getUserName(user.id)} */}
    </div>
  )
}

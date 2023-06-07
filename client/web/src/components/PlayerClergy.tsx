import { Color } from '../../../../api/types'
import { useHathoraContext } from '../context/GameContext'

interface Props {
  color: Color
  clergy: string[]
  active: boolean
}

interface ClergyProps {
  id: string
}

interface WorkerProps {
  color: string
}

const colorToStyle = (color: string) => {
  const baseStyle = {
    height: 24,
    width: 24,
    margin: 1,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: 'solid',
    display: 'inline-block',
  }
  switch (color) {
    case 'R':
      return { ...baseStyle, backgroundColor: '#fb8072', borderColor: '#ad574d' }
    case 'G':
      return { ...baseStyle, backgroundColor: '#b3de69', borderColor: '#87a74f' }
    case 'B':
      return { ...baseStyle, backgroundColor: '#80b1d3', borderColor: '#5f849e' }
    case 'W':
      return { ...baseStyle, backgroundColor: '#d9d9d9', borderColor: '#b1b1b1' }
    default:
      return {}
  }
}

const Prior = ({ color }: WorkerProps) => {
  return <span style={{ ...colorToStyle(color), borderWidth: 4, height: 24, width: 24 }} />
}

const LayBrother = ({ color }: WorkerProps) => {
  return <span style={colorToStyle(color)} />
}

export const Clergy = ({ id }: ClergyProps) => {
  const prefix = id.substring(0, 3)
  const color = id.substring(3)
  if (prefix === 'PRI') return <Prior color={color} />
  return <LayBrother color={color} />
}

export const PlayerClergy = ({ clergy, color, active }: Props) => {
  const { state, control, getUserName } = useHathoraContext()
  const user = state?.users.find((u) => u.color === color)

  const canUsePrior = active && state?.control?.completion?.includes('WITH_PRIOR')
  const handleClick = () => {
    control(`WITH_PRIOR`)
  }

  return (
    <div>
      {clergy.reverse().map((id) => {
        return <Clergy key={id} id={id} />
      })}
      {canUsePrior && (
        <button type="button" onClick={handleClick}>
          Use Prior
        </button>
      )}
      {user && getUserName(user.id)}
    </div>
  )
}

import { Color } from '../../../../api/types'
import { useHathoraContext } from '../context/GameContext'

interface Props {
  color: Color
  clergy: string[]
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

export const PlayerClergy = ({ clergy, color }: Props) => {
  const { state, getUserName } = useHathoraContext()
  const user = state?.users.find((u) => u.color === color)
  return (
    <div>
      {clergy.reverse().map((id) => {
        return <Clergy key={id} id={id} />
      })}
      {user && getUserName(user.id)}
    </div>
  )
}

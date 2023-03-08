import { EngineTableau } from '../../../../api/types'

interface Props {
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
    height: 16,
    width: 16,
    margin: 1,
    borderRadius: 8,
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
  return <span style={{ ...colorToStyle(color), borderWidth: 3 }} />
}

const LayBrother = ({ color }: WorkerProps) => {
  return <span style={colorToStyle(color)} />
}

const Clergy = ({ id }: ClergyProps) => {
  const prefix = id.substring(0, 3)
  const color = id.substring(3)
  if (prefix === 'PRI') return <Prior color={color} />
  return <LayBrother color={color} />
}

export const PlayerClergy = ({ clergy }: Props) => {
  return (
    <div>
      {clergy.reverse().map((id) => {
        return <Clergy key={id} id={id} />
      })}
    </div>
  )
}

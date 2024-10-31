import { CSSProperties } from 'react'

interface Props {
  id: string
  style?: CSSProperties | undefined
}

interface WorkerProps {
  color: string
  style: CSSProperties | undefined
}

const colorToStyle = (color: string): CSSProperties => {
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

const Prior = ({ color, style }: WorkerProps) => {
  return <span style={{ ...colorToStyle(color), ...style, borderWidth: 4, height: 24, width: 24 }} />
}

const LayBrother = ({ color, style }: WorkerProps) => {
  return <span style={{ ...colorToStyle(color), ...style }} />
}

export const Clergy = ({ id, style = {} }: Props) => {
  const prefix = id.substring(0, 3)
  const color = id.substring(3)
  if (prefix === 'PRI') return <Prior color={color} style={style} />
  return <LayBrother color={color} style={style} />
}

import styles from '@/components/clergy.module.css'
import { CSSProperties } from 'react'

interface Props {
  id: string
  style?: CSSProperties | undefined
}

interface WorkerProps {
  color: 'R' | 'G' | 'B' | 'W'
  style?: CSSProperties | undefined
}

const stylesMap = {
  R: styles.red,
  G: styles.green,
  B: styles.blue,
  W: styles.white,
}

const Prior = ({ color, style }: WorkerProps) => {
  return <span className={stylesMap[color]} style={{ ...style, borderWidth: 4, height: 24, width: 24 }}></span>
}

const LayBrother = ({ color, style }: WorkerProps) => {
  return <span className={stylesMap[color]} style={style}></span>
}

export const Clergy = ({ id, style = {} }: Props) => {
  const prefix = id.substring(0, 3)
  const color = (!['R', 'G', 'B', 'W'].includes(id.substring(3)) ? 'W' : id.substring(3)) as 'R' | 'G' | 'B' | 'W'
  if (prefix === 'PRI') return <Prior color={color} />
  return <LayBrother color={color} />
}

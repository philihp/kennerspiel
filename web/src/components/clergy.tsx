import styles from '@/components/clergy.module.css'
import { Circle, Cross, DiamondPlus, Locate, LocateFixed, Plus, PlusCircle } from 'lucide-react'
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

const backgroundMap = {
  R: '  #fb8072',
  G: '  #b3de69',
  B: '  #80b1d3',
  W: '  #d9d9d9',
}

const colorsMap = {
  R: '#ad574d',
  G: '#87a74f',
  B: '#5f849e',
  W: '#b1b1b1',
}

const Prior = ({ color, style }: WorkerProps) => {
  return (
    <span>
      <PlusCircle size={36} fill={backgroundMap[color]} color={colorsMap[color]} />
    </span>
  )
}

const LayBrother = ({ color, style }: WorkerProps) => {
  return (
    <span>
      <Circle size={36} fill={backgroundMap[color]} color={colorsMap[color]} />
    </span>
  )
}

export const Clergy = ({ id, style = {} }: Props) => {
  const prefix = id.substring(0, 3)
  const color = (!['R', 'G', 'B', 'W'].includes(id.substring(3)) ? 'W' : id.substring(3)) as 'R' | 'G' | 'B' | 'W'
  if (prefix === 'PRI') return <Prior color={color} />
  return <LayBrother color={color} />
}

import { useMemo } from 'react'
import { match } from 'ts-pattern'
import { useInstanceContext } from '@/context/InstanceContext'
import { RondelSettlements } from './settlements'
import { mask, wedge, arrowPath, armPath, points, rot, armTextY } from './constants'
import { GameCommandConfigParams } from 'hathora-et-labora-game'
import { allTokenKeys, computeTokenPositions, TokenKey } from './tokenPositions'

import styles from './rondel.module.css'

export const symbols = {
  wood: '🪵',
  clay: '🧱',
  coin: '🪙',
  grain: '🌾',
  peat: '💩',
  sheep: '🐑',
  joker: '🃏',
  grape: '🍇',
  stone: '🪨',
}

const oraDeg = (pos?: number): number =>
  match(pos)
    .with(0, () => (360 * 12.5) / points.length)
    .with(1, () => (360 * 11.5) / points.length)
    .with(2, () => (360 * 10.5) / points.length)
    .with(3, () => (360 * 9.5) / points.length)
    .with(4, () => (360 * 8.5) / points.length)
    .with(5, () => (360 * 7.5) / points.length)
    .with(6, () => (360 * 6.5) / points.length)
    .with(7, () => (360 * 5.5) / points.length)
    .with(8, () => (360 * 4.5) / points.length)
    .with(9, () => (360 * 3.5) / points.length)
    .with(10, () => (360 * 2.5) / points.length)
    .with(11, () => (360 * 1.5) / points.length)
    .with(12, () => (360 * 0.5) / points.length)
    .otherwise(() => 0)

const armOffset = (360 * 0.5) / points.length

export const Rondel = () => {
  const { state } = useInstanceContext()

  const rondel = state?.rondel

  const tokenPositions = useMemo(
    () => (rondel && state?.config ? computeTokenPositions(rondel, state.config) : {}),
    [rondel, state?.config]
  )

  const armValues =
    state?.config?.length === 'short' && state?.config?.players === 2
      ? [0, 1, 2, 2, 3, 4, 4, 5, 6, 6, 7, 8, 10]
      : [0, 2, 3, 4, 5, 6, 6, 7, 7, 8, 8, 9, 10]
  return (
    <svg style={{ float: 'left', width: '450px', height: '450px' }} viewBox="-210.5 -210.5 420 420">
      <defs>
        <linearGradient id="housefill" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: '#004e85', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#1973b2', stopOpacity: 1 }} />
        </linearGradient>
        <filter id="shadow">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
        </filter>
      </defs>
      <g id="shadowMask" opacity="0.2">
        <polyline points={mask} fill="black" filter="url(#shadow)" />
      </g>
      <g id="wheel">
        <polyline fill="#fcfcfc" stroke="#b3b3b3" strokeWidth="1" points={wedge.A} />
        <polyline fill="#fcfcfc" stroke="#b3b3b3" strokeWidth="1" points={wedge.B} />
        <polyline fill="#fcfcfc" stroke="#b3b3b3" strokeWidth="1" points={wedge.C} />
        <polyline fill="#fcfcfc" stroke="#b3b3b3" strokeWidth="1" points={wedge.D} />
        <polyline fill="#fcfcfc" stroke="#b3b3b3" strokeWidth="1" points={wedge.E} />
        <polyline fill="#fcfcfc" stroke="#b3b3b3" strokeWidth="1" points={wedge.F} />
        <polyline fill="#fcfcfc" stroke="#b3b3b3" strokeWidth="1" points={wedge.G} />
        <polyline fill="#fcfcfc" stroke="#b3b3b3" strokeWidth="1" points={wedge.H} />
        <polyline fill="#fcfcfc" stroke="#b3b3b3" strokeWidth="1" points={wedge.I} />
        <polyline fill="#fcfcfc" stroke="#b3b3b3" strokeWidth="1" points={wedge.J} />
        <polyline fill="#fcfcfc" stroke="#b3b3b3" strokeWidth="1" points={wedge.K} />
        <polyline fill="#fcfcfc" stroke="#b3b3b3" strokeWidth="1" points={wedge.L} />
        <polyline fill="#fcfcfc" stroke="#b3b3b3" strokeWidth="1" points={wedge.M} />
      </g>

      <RondelSettlements />

      {allTokenKeys.map((key) => {
        const pos = tokenPositions[key]
        if (!pos) return null
        return (
          <text key={key} id={key} x={pos[0]} y={pos[1]} dominantBaseline="central" className={styles.token}>
            {symbols[key]}
          </text>
        )
      })}

      <g id="shadowMask" opacity="0.2" transform={`rotate(${oraDeg(rondel?.pointingBefore) - armOffset})`}>
        <path d={armPath} fill="black" filter="url(#shadow)" />
      </g>
      <g
        id="arm"
        transform={`rotate(${oraDeg(rondel?.pointingBefore) - armOffset})`}
        style={{ fontSize: '10px', textAnchor: 'middle' }}
      >
        <path d={armPath} className={styles.armPath} />
        <path d={arrowPath} fill="#000" />
        <text x="0" y={armTextY} transform={`rotate(${rot.A})`}>
          {armValues[12]}
        </text>
        <text x="0" y={armTextY} transform={`rotate(${rot.B})`}>
          {armValues[11]}
        </text>
        <text x="0" y={armTextY} transform={`rotate(${rot.C})`}>
          {armValues[10]}
        </text>
        <text x="0" y={armTextY} transform={`rotate(${rot.D})`}>
          {armValues[9]}
        </text>
        <text x="0" y={armTextY} transform={`rotate(${rot.E})`}>
          {armValues[8]}
        </text>
        <text x="0" y={armTextY} transform={`rotate(${rot.F})`}>
          {armValues[7]}
        </text>
        <text x="0" y={armTextY} transform={`rotate(${rot.G})`}>
          {armValues[6]}
        </text>
        <text x="0" y={armTextY} transform={`rotate(${rot.H})`}>
          {armValues[5]}
        </text>
        <text x="0" y={armTextY} transform={`rotate(${rot.I})`}>
          {armValues[4]}
        </text>
        <text x="0" y={armTextY} transform={`rotate(${rot.J})`}>
          {armValues[3]}
        </text>
        <text x="0" y={armTextY} transform={`rotate(${rot.K})`}>
          {armValues[2]}
        </text>
        <text x="0" y={armTextY} transform={`rotate(${rot.L})`}>
          {armValues[1]}
        </text>
        <text x="0" y={armTextY} transform={`rotate(${rot.M})`}>
          {armValues[0]}
        </text>
      </g>
    </svg>
  )
}

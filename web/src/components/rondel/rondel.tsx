import { match } from 'ts-pattern'
import { useInstanceContext } from '@/context/InstanceContext'
import { RondelSettlements } from './settlements'
import { mask, wedge, arrowPath, armPath, points, rot, armTextY } from './constants'
import { GameCommandConfigParams } from 'hathora-et-labora-game'

import styles from './rondel.module.css'

const symbols = {
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

const isStoneUsed = (config: GameCommandConfigParams): boolean =>
  match(config)
    .with({ players: 1 }, () => false)
    .otherwise(() => true)

const isGrapeUsed = (config: GameCommandConfigParams): boolean => {
  return match(config)
    .with({ players: 1 }, () => false)
    .with({ country: 'france' }, () => false)
    .otherwise(() => true)
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

const BASE = -50

const armOffset = (360 * 0.5) / points.length

export const Rondel = () => {
  const { state } = useInstanceContext()

  const rondel = state?.rondel

  const armValues =
    state?.config?.length === 'short' && state?.config?.players === 2
      ? [0, 1, 2, 2, 3, 4, 4, 5, 6, 6, 7, 8, 10]
      : [0, 2, 3, 4, 5, 6, 6, 7, 7, 8, 8, 9, 10]
  return (
    <div>
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

        {rondel?.grape && state?.config && isGrapeUsed(state.config) && (
          <g id="grape" transform={`rotate(${oraDeg(rondel?.grape ?? 0)})`}>
            <text x={50} y={BASE - 105} className={styles.token}>
              {symbols.grape}
            </text>
          </g>
        )}

        {rondel?.stone && state?.config && isStoneUsed(state.config) && (
          <g id="stone" transform={`rotate(${oraDeg(rondel?.stone ?? 0)})`}>
            <text x={0} y={BASE - 114} className={styles.token}>
              {symbols.stone}
            </text>
          </g>
        )}

        <g id="grain" transform={`rotate(${oraDeg(rondel?.grain ?? 0)})`}>
          <text x={0 + 13} y={BASE - 87 - 9} className={styles.token}>
            {symbols.grain}
          </text>
        </g>
        <g id="sheep" transform={`rotate(${oraDeg(rondel?.sheep ?? 0)})`}>
          <text x={0 - 13} y={BASE - 96} className={styles.token}>
            {symbols.sheep}
          </text>
        </g>
        <g id="joker" transform={`rotate(${oraDeg(rondel?.joker ?? 0)})`}>
          <text x={0 + 11} y={BASE - 78 + 4.5} className={styles.token}>
            {symbols.joker}
          </text>
        </g>
        <g id="wood" transform={`rotate(${oraDeg(rondel?.wood ?? 0)})`}>
          <text x={0 - 11} y={BASE - 69 - 4.5} className={styles.token}>
            {symbols.wood}
          </text>
        </g>
        <g id="clay" transform={`rotate(${oraDeg(rondel?.clay ?? 0)})`}>
          <text x={-9} y={BASE - 60 + 4.5} className={styles.token}>
            {symbols.clay}
          </text>
        </g>
        <g id="peat" transform={`rotate(${oraDeg(rondel?.peat ?? 0)})`}>
          <text x={+9} y={BASE - 51 - 4.5} className={styles.token}>
            {symbols.peat}
          </text>
        </g>
        <g id="coin" transform={`rotate(${oraDeg(rondel?.coin ?? 0)})`}>
          <text x={0} y={BASE - 42 + 5} className={styles.token}>
            {symbols.coin}
          </text>
        </g>

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
    </div>
  )
}

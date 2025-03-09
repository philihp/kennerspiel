import { match } from 'ts-pattern'
import { useInstanceContext } from '@/context/InstanceContext'
import { addIndex, map, range, toPairs } from 'ramda'
import { ReactNode } from 'react'
import { RondelSettlements } from './rondel/settlements'
import { mask, wedge, arrowPath, armPath, points } from './rondel/constants'
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
  const { state, controls, addPartial } = useInstanceContext()

  const handleClick = () => {
    addPartial('Jo')
  }

  const rondel = state?.rondel

  const armValues =
    state?.config?.length === 'short' && state?.config?.players === 2
      ? [0, 1, 2, 2, 3, 4, 4, 5, 6, 6, 7, 8, 10]
      : [0, 2, 3, 4, 5, 6, 6, 7, 7, 8, 8, 9, 10]
  return (
    <div>
      <svg style={{ float: 'right', width: '600px', height: '600px' }} viewBox="-300.5 -300.5 600 600">
        <defs>
          <linearGradient id="housefill" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#004e85', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#1973b2', stopOpacity: 1 }} />
          </linearGradient>
          <filter id="shadow">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
          </filter>
        </defs>
        <g id="shadowMask" opacity="0.1">
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

        {state?.rondel?.grape && state?.config && isGrapeUsed(state.config) && (
          <g id="grape" transform={`rotate(${oraDeg(state?.rondel?.grape ?? 0)})`}>
            <text x={50} y={BASE - 105} className={styles.token}>
              {symbols.grape}
            </text>
          </g>
        )}

        {state?.rondel?.stone && state?.config && isStoneUsed(state.config) && (
          <g id="stone" transform={`rotate(${oraDeg(state?.rondel?.stone ?? 0)})`}>
            <text x={0} y={BASE - 114} className={styles.token}>
              {symbols.stone}
            </text>
          </g>
        )}

        <g id="grain" transform={`rotate(${oraDeg(state?.rondel?.grain ?? 0)})`}>
          <text x={0} y={BASE - 87} className={styles.token}>
            {symbols.grain}
          </text>
        </g>
        <g id="sheep" transform={`rotate(${oraDeg(state?.rondel?.sheep ?? 0)})`}>
          <text x={0} y={BASE - 96} className={styles.token}>
            {symbols.sheep}
          </text>
        </g>
        <g id="joker" transform={`rotate(${oraDeg(state?.rondel?.joker ?? 0)})`}>
          <text x={0} y={BASE - 78} className={styles.token}>
            {symbols.joker}
          </text>
        </g>
        <g id="wood" transform={`rotate(${oraDeg(state?.rondel?.wood ?? 0)})`}>
          <text x={0} y={BASE - 69} className={styles.token}>
            {symbols.wood}
          </text>
        </g>
        <g id="clay" transform={`rotate(${oraDeg(state?.rondel?.clay ?? 0)})`}>
          <text x={0} y={BASE - 60} className={styles.token}>
            {symbols.clay}
          </text>
        </g>
        <g id="peat" transform={`rotate(${oraDeg(state?.rondel?.peat ?? 0)})`}>
          <text x={0} y={BASE - 51} className={styles.token}>
            {symbols.peat}
          </text>
        </g>
        <g id="coin" transform={`rotate(${oraDeg(state?.rondel?.coin ?? 0)})`}>
          <text x={0} y={BASE - 42} className={styles.token}>
            {symbols.coin}
          </text>
        </g>

        <g
          id="arm"
          transform={`rotate(${oraDeg(state?.rondel?.pointingBefore) - armOffset})`}
          style={{ fontSize: '10px', textAnchor: 'middle' }}
        >
          <path d={armPath} className={styles.armPath} />
          <path d={arrowPath} fill="#000" />
        </g>
      </svg>

      <table style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <td />
            {addIndex<number, ReactNode>(map)(
              (value: number, i: number) => (
                <th key={i}>{value as number}</th>
              ),
              armValues
            )}
          </tr>
        </thead>
        <tbody>
          {rondel &&
            map(
              ([token, emoji]) =>
                rondel[token] !== undefined && (
                  <tr key={token}>
                    <td>
                      {token === 'joker' && controls?.completion?.includes('Jo') ? (
                        <button type="button" onClick={handleClick}>
                          joker
                        </button>
                      ) : (
                        token
                      )}
                    </td>
                    {map(
                      (i) => {
                        const thisToken = rondel[token]
                        if (thisToken === undefined) return null
                        const difference = (rondel.pointingBefore - (thisToken ?? rondel.pointingBefore) + 13) % 13
                        return (
                          <td
                            style={{
                              border: 1,
                              borderStyle: 'solid',
                              borderColor: '#DDD',
                              width: 32,
                              height: 32,
                              textAlign: 'center',
                            }}
                            key={i}
                          >
                            {difference === i ? emoji : ''}
                          </td>
                        )
                      },
                      range(0, 13)
                    )}
                  </tr>
                ),
              toPairs(symbols)
            )}
        </tbody>
      </table>
    </div>
  )
}

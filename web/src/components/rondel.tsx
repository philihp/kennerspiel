import { useInstanceContext } from '@/context/InstanceContext'
import { addIndex, map, range, toPairs } from 'ramda'
import { ReactNode } from 'react'
import { RondelSettlements } from './rondel/settlements'
import { mask, wedge, arrowPath, armPath } from './rondel/constants'

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

        {/* <c:if test="${board.mode.grapesUsed}">
          <g id="grape" transform="rotate(${ora:deg(board.wheel.grape.position)})">
            <text x="0" y="${board.wheel.grape.radius}"
            style="font-size: 9px; font-weight: 100; kerning:-0.5; text-anchor: middle; fill:#000">Grape</text>
          </g>
        </c:if>
        <c:if test="${board.mode.stoneUsed}">
          <g id="stone" transform="rotate(${ora:deg(board.wheel.stone.position)})">
            <text x="0" y="${board.wheel.stone.radius}"
            style="font-size: 9px; font-weight: 100; kerning:-0.5; text-anchor: middle; fill:#000">Stone</text>
          </g>
        </c:if> */}

        <g
          id="arm"
          transform="rotate(${ora:deg(board.wheel.arm.position)-board.armOffset})"
          style={{ fontSize: '10px', textAnchor: 'middle' }}
        >
          <path d={armPath} style={{ fill: '#ffffff', fillOpacity: 1, stroke: '#686868', strokeWidth: 1 }} />
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

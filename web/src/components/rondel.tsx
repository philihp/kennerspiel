import { useInstanceContext } from '@/context/InstanceContext'
import { addIndex, keys, map, range, toPairs } from 'ramda'
import { ReactNode } from 'react'

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

const WHEEL_RADIUS = 140
const points = new Array<[number, number]>(13)
for (let n = 0; n < points.length; n++) {
  const x = -Math.sin((n * Math.PI * 2) / points.length) * WHEEL_RADIUS
  const y = -Math.cos((n * Math.PI * 2) / points.length) * WHEEL_RADIUS
  points[n] = [x, y]
}

const mask =
  `${points[0].join(',')} ` +
  `${points[1].join(',')} ` +
  `${points[2].join(',')} ` +
  `${points[3].join(',')} ` +
  `${points[4].join(',')} ` +
  `${points[5].join(',')} ` +
  `${points[6].join(',')} ` +
  `${points[7].join(',')} ` +
  `${points[8].join(',')} ` +
  `${points[9].join(',')} ` +
  `${points[10].join(',')} ` +
  `${points[11].join(',')} ` +
  `${points[12].join(',')} ` +
  `${points[0].join(',')} `

const wedgeA = `0,0 ${points[0].join(',')} ${points[1].join(',')} 0,0`
const wedgeB = `0,0 ${points[1].join(',')} ${points[2].join(',')} 0,0`
const wedgeC = `0,0 ${points[2].join(',')} ${points[3].join(',')} 0,0`
const wedgeD = `0,0 ${points[3].join(',')} ${points[4].join(',')} 0,0`
const wedgeE = `0,0 ${points[4].join(',')} ${points[5].join(',')} 0,0`
const wedgeF = `0,0 ${points[5].join(',')} ${points[6].join(',')} 0,0`
const wedgeG = `0,0 ${points[6].join(',')} ${points[7].join(',')} 0,0`
const wedgeH = `0,0 ${points[7].join(',')} ${points[8].join(',')} 0,0`
const wedgeI = `0,0 ${points[8].join(',')} ${points[9].join(',')} 0,0`
const wedgeJ = `0,0 ${points[9].join(',')} ${points[10].join(',')} 0,0`
const wedgeK = `0,0 ${points[10].join(',')} ${points[11].join(',')} 0,0`
const wedgeL = `0,0 ${points[11].join(',')} ${points[12].join(',')} 0,0`
const wedgeM = `0,0 ${points[12].join(',')} ${points[0].join(',')} 0,0`

const ARM_RADIUS = 35
const ARM_WIDTH = 6
const ARM_LENGTH = 110
const ARM_TEXT_RADIUS = 25

const armPath =
  `M${-ARM_WIDTH / 2},${-ARM_LENGTH} ` +
  `Q${-ARM_WIDTH / 2},${-ARM_RADIUS} ${Math.sin((12 / 13) * 2 * Math.PI) * ARM_RADIUS},${-Math.cos((12 / 13) * 2 * Math.PI) * ARM_RADIUS} ` +
  `A${ARM_RADIUS},${ARM_RADIUS} 0 1,0 ${Math.sin((1 / 13) * 2 * Math.PI) * ARM_RADIUS},${-Math.cos((1 / 13) * 2 * Math.PI) * ARM_RADIUS} ` +
  `Q${ARM_WIDTH / 2},${-ARM_RADIUS} ${ARM_WIDTH / 2},${-ARM_LENGTH} ` +
  `z`

const ARROW_RADIUS = 44
const ARROW_SIZE = 7

const arrowPath = `M${-ARROW_SIZE / 2},${-ARROW_RADIUS} l${ARROW_SIZE},${ARROW_SIZE / 2} v${-ARROW_SIZE} z`

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
      <svg style={{ float: 'right', width: '300px', height: '300px' }} viewBox="-150.5 -150.5 300 300">
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
          <polyline fill="#fcfcfc" stroke="#b3b3b3" strokeWidth="1" points={wedgeA} />
          <polyline fill="#fcfcfc" stroke="#b3b3b3" strokeWidth="1" points={wedgeB} />
          <polyline fill="#fcfcfc" stroke="#b3b3b3" strokeWidth="1" points={wedgeC} />
          <polyline fill="#fcfcfc" stroke="#b3b3b3" strokeWidth="1" points={wedgeD} />
          <polyline fill="#fcfcfc" stroke="#b3b3b3" strokeWidth="1" points={wedgeE} />
          <polyline fill="#fcfcfc" stroke="#b3b3b3" strokeWidth="1" points={wedgeF} />
          <polyline fill="#fcfcfc" stroke="#b3b3b3" strokeWidth="1" points={wedgeG} />
          <polyline fill="#fcfcfc" stroke="#b3b3b3" strokeWidth="1" points={wedgeH} />
          <polyline fill="#fcfcfc" stroke="#b3b3b3" strokeWidth="1" points={wedgeI} />
          <polyline fill="#fcfcfc" stroke="#b3b3b3" strokeWidth="1" points={wedgeJ} />
          <polyline fill="#fcfcfc" stroke="#b3b3b3" strokeWidth="1" points={wedgeK} />
          <polyline fill="#fcfcfc" stroke="#b3b3b3" strokeWidth="1" points={wedgeL} />
          <polyline fill="#fcfcfc" stroke="#b3b3b3" strokeWidth="1" points={wedgeM} />
        </g>
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

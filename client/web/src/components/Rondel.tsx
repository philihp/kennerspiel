import { addIndex, keys, map, range, toPairs } from 'ramda'
import { ReactNode } from 'react'
import { EngineRondel, EngineConfig, EngineLength } from '../../../../api/types'
import { useHathoraContext } from '../context/GameContext'

interface Props {
  rondel: EngineRondel
  config: EngineConfig
}

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

export const Rondel = ({ rondel, config }: Props) => {
  const { state, control } = useHathoraContext()
  const handleClick = () => {
    control(`${state?.control?.partial} Jo`)
  }
  const armValues =
    config?.length === EngineLength.short && config?.players === 2
      ? [0, 1, 2, 2, 3, 4, 4, 5, 6, 6, 7, 8, 10]
      : [0, 2, 3, 4, 5, 6, 6, 7, 7, 8, 8, 9, 10]
  return (
    <div>
      <table style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
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
          {map(
            ([token, emoji]) =>
              rondel[token] !== undefined && (
                <tr key={token}>
                  <td>
                    {token === 'joker' && state?.control?.completion?.includes('Jo') ? (
                      <button type="button" onClick={handleClick}>
                        joker
                      </button>
                    ) : (
                      token
                    )}
                  </td>
                  {map(
                    (i) => {
                      const thisToken = rondel[token as keyof EngineRondel]
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

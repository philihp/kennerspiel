import { addIndex, map, range } from 'ramda'
import { EngineRondel, EngineConfig, Length } from '../../../../api/types'

interface Props {
  rondel: EngineRondel
  config: EngineConfig
}

const tokens = ['wood', 'clay', 'coin', 'grain', 'peat', 'sheep', 'joker']

export const Rondel = ({ rondel, config }: Props) => {
  const armValues =
    config?.length === Length.short && config?.players === 2
      ? [0, 1, 2, 2, 3, 4, 4, 5, 6, 6, 7, 8, 10]
      : [0, 2, 3, 4, 5, 6, 6, 7, 7, 8, 8, 9, 10]
  return (
    <table>
      <thead>
        <tr>
          <th>token</th>
          {addIndex(map)(
            (value, i) => (
              <th key={i}>{value as number}</th>
            ),
            armValues
          )}
        </tr>
      </thead>
      <tbody>
        {tokens.map((token) => (
          <tr key={token}>
            <td>{token}</td>
            {map((i) => {
              const thisToken = rondel[token as keyof EngineRondel] ?? rondel.pointingBefore
              const difference = (rondel.pointingBefore - thisToken) % 13
              return (
                <td
                  style={{
                    border: 1,
                    borderStyle: 'solid',
                    borderColor: '#DDD',
                    width: 16,
                    height: 16,
                    textAlign: 'center',
                  }}
                  key={i}
                >
                  {difference === i ? '*' : ''}
                </td>
              )
            }, range(0, 13))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

import { addIndex, map, range } from 'ramda'
import { EngineRondel, EngineConfig, Length } from '../../../../api/types'

interface Props {
  rondel: EngineRondel
  config: EngineConfig
}

const tokens = ['wood', 'clay', 'coin', 'grain', 'peat', 'sheep', 'joker', 'grape', 'stone']
const emojis = ['🪵', '🧱', '🪙', '🌾', '💩', '🐑', '🃏', '🍇', '🪨']

export const Rondel = ({ rondel, config }: Props) => {
  const armValues =
    config?.length === Length.short && config?.players === 2
      ? [0, 1, 2, 2, 3, 4, 4, 5, 6, 6, 7, 8, 10]
      : [0, 2, 3, 4, 5, 6, 6, 7, 7, 8, 8, 9, 10]
  return (
    <table style={{ borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <td />
          {addIndex(map)(
            (value, i) => (
              <th key={i}>{value as number}</th>
            ),
            armValues
          )}
        </tr>
      </thead>
      <tbody>
        {tokens.map((token, tokenIndex) => (
          <tr key={token} style={rondel[token as keyof EngineRondel] === undefined ? { opacity: '20%' } : {}}>
            <td>{token}</td>
            {map((i) => {
              const thisToken = rondel[token as keyof EngineRondel]
              const difference = (rondel.pointingBefore - (thisToken ?? rondel.pointingBefore)) % 13
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
                  {difference === i ? emojis[tokenIndex] : ''}
                </td>
              )
            }, range(0, 13))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

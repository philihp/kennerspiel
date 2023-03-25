import { addIndex, map, range } from 'ramda'
import { EngineRondel, EngineConfig, Length } from '../../../../api/types'
import { Erection } from './Erection'
import { Clergy, PlayerClergy } from './PlayerClergy'

interface Props {
  landscape: string[][][]
  offset: number
}

const landToColor = (land: string) => {
  switch (land) {
    case 'H':
      return '#ffffb3'
    case 'P':
      return '#ccebc5'
    case 'C':
      return '#ffffb3'
    case 'W':
      return '#80b1d3'
    case 'M':
    case '.':
      return '#d9d9d9'
    default:
      return ''
  }
}

export const PlayerLandscape = ({ landscape, offset }: Props) => {
  return (
    <table style={{ borderCollapse: 'collapse' }}>
      <tbody>
        {landscape.map((row, rowIndex) => {
          const rowId = rowIndex + offset
          return (
            <tr key={JSON.stringify(row)}>
              {row.map((tile, colIndex) => {
                // eslint-disable-next-line react/no-array-index-key
                if (tile.length === 0) return <td key={`${rowId}:${colIndex}`} />
                const [land, building, clergy] = tile
                return (
                  <td
                    style={{
                      border: 1,
                      borderStyle: 'solid',
                      borderColor: '#555',
                      width: 70,
                      height: 100,
                      textAlign: 'center',
                      backgroundColor: landToColor(land),
                    }}
                    // eslint-disable-next-line react/no-array-index-key
                    key={`${rowId}:${colIndex}`}
                  >
                    {building && <Erection key={building} id={building} />}
                    {clergy && <Clergy id={clergy} />}
                  </td>
                )
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

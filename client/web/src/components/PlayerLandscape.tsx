import { Erection } from './Erection'
import { Clergy } from './PlayerClergy'
import { useHathoraContext } from '../context/GameContext'

interface Props {
  landscape: string[][][]
  offset: number
  active: boolean
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

export const PlayerLandscape = ({ landscape, offset, active }: Props) => {
  const { state, control } = useHathoraContext()
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
                const key = `${colIndex - 2} ${rowId}`
                const selectable = active && state?.control?.completion?.includes(key)
                return (
                  <td
                    style={{
                      border: 1,
                      borderStyle: 'solid',
                      borderColor: '#555',
                      width: 80,
                      textAlign: 'center',
                      backgroundColor: landToColor(land),
                    }}
                    // eslint-disable-next-line react/no-array-index-key
                    key={`${rowId}:${colIndex}`}
                  >
                    {building && <Erection key={building} id={building} />}
                    {clergy && <Clergy id={clergy} />}
                    {selectable && (
                      <button type="button" onClick={() => control(`${state?.control?.partial} ${key}`)}>
                        {state?.control?.partial}
                      </button>
                    )}
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

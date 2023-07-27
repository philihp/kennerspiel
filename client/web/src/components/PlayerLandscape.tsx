import { Erection } from './Erection'
import { Clergy } from './Clergy'
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
          const rowId = rowIndex - offset
          return (
            <tr key={JSON.stringify(row)}>
              {row.map((tile, colIndex) => {
                // eslint-disable-next-line react/no-array-index-key
                if (tile.length === 0) return <td key={`${rowId}:${colIndex}`} />
                const [land, building, clergy] = tile
                const key = `${colIndex - 2} ${rowId}`
                const selectable =
                  (active && state?.control?.completion?.includes(key)) ||
                  state?.control?.completion?.includes(building)
                const handleClick = () => {
                  if (state?.control?.completion?.includes(key)) {
                    control(`${state?.control?.partial} ${key}`)
                  }
                  if (state?.control?.completion?.includes(building)) {
                    control(`${state?.control?.partial} ${building}`)
                  }
                }
                return (
                  <td
                    style={{
                      border: 1,
                      borderStyle: 'solid',
                      borderColor: '#555',
                      width: 120,
                      height: 160,
                      textAlign: 'center',
                      backgroundColor: landToColor(land),
                    }}
                    // eslint-disable-next-line react/no-array-index-key
                    key={`${rowId}:${colIndex}`}
                  >
                    {building && <Erection key={building} id={building} disabled={!selectable} onClick={handleClick} />}
                    {!building && selectable && (
                      <button type="button" onClick={handleClick}>
                        {land}
                      </button>
                    )}
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

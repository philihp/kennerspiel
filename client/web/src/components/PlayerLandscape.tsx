import { head } from 'ramda'
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
  const partial = state?.control?.partial ?? ''
  const command = head(partial.split(/ +/) ?? [])
  return (
    <table style={{ borderCollapse: 'collapse' }}>
      <tbody>
        {landscape.map((row, rowIndex) => {
          const rowId = rowIndex - offset
          return (
            <tr key={JSON.stringify(row)}>
              {row.map((tile, colIndex) => {
                // eslint-disable-next-line react/no-array-index-key, jsx-a11y/control-has-associated-label
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

                const primary =
                  (partial === 'FELL_TREES' && active && building === 'LFO') ||
                  (partial === 'CUT_PEAT' && active && building === 'LMO') ||
                  (partial === 'USE' && active && !['LFO', 'LMO'].includes(building)) ||
                  (partial === 'WORK_CONTRACT' && !active && !['LFO', 'LMO'].includes(building)) ||
                  state?.control?.completion?.includes(building)

                if (land === '.') return null
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
                    rowSpan={land === 'M' ? 2 : 1}
                  >
                    {building && (
                      <Erection
                        primary={primary || (active && partial.includes(key))}
                        key={building}
                        id={building}
                        disabled={!selectable}
                        onClick={handleClick}
                      />
                    )}
                    {!building && selectable && (
                      <button
                        className={`${state?.control?.completion?.includes?.(key) ? 'primary' : ''}`}
                        type="button"
                        onClick={handleClick}
                      >
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

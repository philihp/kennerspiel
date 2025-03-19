import { useInstanceContext } from '@/context/InstanceContext'
import { head } from 'ramda'
import { Erection } from '../erection'
import { Clergy } from '../clergy'
import { Tile } from 'hathora-et-labora-game'
import { LandEnum } from 'hathora-et-labora-game/dist/types'
import { match } from 'ts-pattern'

interface Props {
  landscape: Tile[][]
  offset: number
  active: boolean
}

const landToColor = (land: LandEnum | undefined) =>
  match(land)
    .with(LandEnum.Hillside, () => '#ffffb3')
    .with(LandEnum.Plains, () => '#ccebc5')
    .with(LandEnum.Coast, () => '#ffffb3')
    .with(LandEnum.Water, () => '#80b1d3')
    .with(LandEnum.Mountain, () => '#d9d9d9')
    .with(LandEnum.BelowMountain, () => '#d9d9d9')
    .otherwise(() => '')

export const PlayerLandscape = ({ landscape, offset, active }: Props) => {
  const { controls, addPartial } = useInstanceContext()
  const partial = controls?.partial ?? []
  const command = head(partial) ?? ''
  const completion = controls?.completion ?? []

  return (
    <table style={{ borderCollapse: 'collapse' }}>
      <tbody>
        {landscape.map((row, rowIndex) => {
          const rowId = rowIndex - offset
          return (
            <tr key={`${rowId}:${JSON.stringify(row)}`}>
              {row.map((tile, colIndex) => {
                if (tile.length === 0) return <td key={`${rowId}:${colIndex}`} />
                const [land, building, clergy] = tile
                const key = `${colIndex - 2} ${rowId}`
                const selectable = (active && completion?.includes(key)) || completion?.includes(building as string)

                const handleClick = () => {
                  if (completion?.includes(key)) {
                    addPartial(`${key}`)
                  }
                  if (completion?.includes(building as string)) {
                    addPartial(`${building}`)
                  }
                }

                const primary =
                  (command === 'FELL_TREES' && active && building === 'LFO') ||
                  (command === 'CUT_PEAT' && active && building === 'LMO') ||
                  (command === 'USE' && active && !['LFO', 'LMO'].includes(building as string)) ||
                  (command === 'WORK_CONTRACT' && !active && !['LFO', 'LMO'].includes(building as string)) ||
                  completion?.includes(building as string)

                if (land === '.') return null
                return (
                  <td
                    style={{
                      border: 1,
                      height: 205,
                      borderStyle: 'solid',
                      borderColor: '#555',
                      textAlign: 'center',
                      backgroundColor: landToColor(land),
                    }}
                    key={`${rowId}:${colIndex}`}
                    rowSpan={land === 'M' ? 2 : 1}
                  >
                    {building && (
                      <Erection
                        primary={primary || (active && completion.includes(key))}
                        key={building}
                        id={building}
                        disabled={!selectable}
                        onClick={handleClick}
                      />
                    )}
                    <div
                      style={{
                        width: 137,
                      }}
                    ></div>
                    {!building && selectable && (
                      <>
                        <br />
                        <button type="button" onClick={handleClick} className={`primary`}>
                          {land}
                        </button>
                      </>
                    )}
                    {clergy && (
                      <>
                        <br />
                        <Clergy id={clergy} />
                      </>
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

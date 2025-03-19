import { useInstanceContext } from '@/context/InstanceContext'
import { Tile } from 'hathora-et-labora-game'
import { LandEnum } from 'hathora-et-labora-game/dist/types'
import { MoveDownLeft, MoveDownRight } from 'lucide-react'
import { match, P } from 'ts-pattern'

interface Props {
  landscape: Tile[][]
  offset: number
  completions: string[]
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

export const TinyLandscape = ({ landscape, offset, completions }: Props) => {
  const { state, partial, setPartial, addPartial, controls } = useInstanceContext()

  const mode = match(partial)
    .with(['BUY_PLOT'], () => 'buy-plot-row')
    .with(['BUY_PLOT', P.string], () => 'buy-plot-type')
    .otherwise(() => undefined)

  const handleClick = (param: string) => () => {
    addPartial(param)
  }

  return (
    <table style={{ borderCollapse: 'collapse' }}>
      <tbody>
        {mode === 'buy-plot-row' && (
          <tr>
            <td
              style={{
                border: 1,
              }}
              colSpan={4}
            ></td>
            <td
              style={{
                textAlign: 'center',
                backgroundColor: 'white',
              }}
            >
              <button className="primary" onClick={handleClick(`${-1 - offset}`)}>
                <MoveDownRight size={16} />
              </button>
            </td>
          </tr>
        )}
        {landscape.map((row, rowIndex) => {
          const rowId = rowIndex - offset
          return (
            <tr key={`${rowId}:${JSON.stringify(row)}`}>
              {row.map((tile, colIndex) => {
                if (tile.length === 0) return <td key={`${rowId}:${colIndex}`} />
                const [land, building] = tile

                if (land === '.') return null

                const rowSpan = land === 'M' ? 2 : 1

                return (
                  <td
                    style={{
                      border: 1,
                      borderStyle: 'solid',
                      borderColor: '#555',
                      textAlign: 'center',
                      backgroundColor: landToColor(land),
                    }}
                    key={`${rowId}:${colIndex}`}
                    rowSpan={rowSpan}
                  >
                    <div
                      style={{
                        width: 50,
                        height: 50,
                        verticalAlign: 'bottom',
                      }}
                    >
                      {colIndex === 4 && completions.includes(`${rowId}`) && (
                        <button className="primary" onClick={handleClick(`${rowId}`)}>
                          <MoveDownRight size={16} />
                        </button>
                      )}
                    </div>
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

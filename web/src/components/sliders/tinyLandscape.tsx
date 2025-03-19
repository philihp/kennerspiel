import { useInstanceContext } from '@/context/InstanceContext'
import { Tile } from 'hathora-et-labora-game'
import { LandEnum } from 'hathora-et-labora-game/dist/types'
import {
  AlignCenter,
  AlignCenterHorizontal,
  ArrowDownLeft,
  ArrowDownNarrowWide,
  ArrowDownRight,
  ArrowDownWideNarrow,
  Expand,
  ExpandIcon,
  MoveDownLeft,
  MoveDownRight,
} from 'lucide-react'
import { includes, map, range } from 'ramda'
import { match, P } from 'ts-pattern'

interface Props {
  landscape: Tile[][]
  offset: number
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

export const TinyLandscape = ({ landscape, offset }: Props) => {
  const { state, partial, setPartial, addPartial, controls } = useInstanceContext()
  const completions = controls?.completion ?? []

  const [mode, rowMin, rowMax] = match<string[], [string, number, number]>(partial)
    .with(['BUY_PLOT'], () => [
      'buy-plot-row',
      Math.min(...map((s: string) => Number.parseInt(s, 10), completions)) + (offset ?? 0),
      Math.max(...map((s: string) => Number.parseInt(s, 10), completions)) + (offset ?? 0),
    ])
    .with(['BUY_PLOT', P.string], () => ['buy-plot-type', 0, 1])
    .otherwise(() => ['', 0, 1])

  const handleClick = (param: string) => () => {
    addPartial(param)
  }

  const rowsCovered = range(rowMin, rowMax + 1)

  return (
    <>
      <table style={{ borderCollapse: 'collapse' }}>
        <tbody>
          {map((rowIndex) => {
            const row = landscape[rowIndex]
            const rowId = rowIndex - offset
            return match<Tile[] | undefined>(row)
              .with(undefined, () => (
                <tr>
                  <td colSpan={4} />
                  <td
                    style={{
                      width: 50,
                      height: 50,
                    }}
                  >
                    {includes(`${rowId}`, completions) && (
                      <button className="primary" onClick={handleClick(`${rowId}`)}>
                        Here
                      </button>
                    )}
                  </td>
                </tr>
              ))
              .otherwise(() => (
                <tr key={`${rowId}:${JSON.stringify(row)}`}>
                  {row.map((tile, colIndex) => {
                    const [land, building] = tile

                    // so long as the mountain is always at the end
                    // and a '.' is under it, this will work
                    if (land === '.') return <></>
                    const rowSpan = land === 'M' ? 2 : 1

                    return (
                      <td
                        style={{
                          border: tile.length !== 0 ? 1 : 0,
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
                            <>
                              <button className="primary" onClick={handleClick(`${rowId}`)}>
                                Here
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    )
                  })}
                </tr>
              ))
          }, rowsCovered)}
        </tbody>
      </table>
    </>
  )
}

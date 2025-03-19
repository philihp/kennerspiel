import { useInstanceContext } from '@/context/InstanceContext'
import { Tile } from 'hathora-et-labora-game'
import { LandEnum } from 'hathora-et-labora-game/dist/types'
import { includes, map, range } from 'ramda'
import { match } from 'ts-pattern'
import { ItemList } from '../itemList'

interface Props {
  landscape: Tile[][]
  offset?: number
  rowMin?: number
  rowMax?: number
  showTerrain?: boolean
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

type ThisRowButtonProps = {
  onClick: () => void
}
const ThisRowButton = ({ onClick }: ThisRowButtonProps) => {
  return (
    <button className="primary" onClick={onClick}>
      This Row
    </button>
  )
}

export const TinyLandscape = ({ landscape, offset = 0, rowMin, rowMax, showTerrain = false }: Props) => {
  const { addPartial, controls } = useInstanceContext()
  const completions = controls?.completion ?? []

  const handleClick = (param: string) => () => {
    addPartial(param)
  }

  const rowsCovered = range(
    rowMin ?? Math.min(...map((s: string) => Number.parseInt(s, 10), completions)) + offset,
    (rowMax ?? Math.max(...map((s: string) => Number.parseInt(s, 10), completions)) + offset) + 1
  )

  return (
    <>
      {/* <pre>{JSON.stringify({ rowsCovered })}</pre> */}
      <table style={{ borderCollapse: 'collapse' }}>
        <tbody>
          {map((rowIndex) => {
            const row = landscape[rowIndex]
            const rowId = rowIndex - offset
            return match<Tile[] | undefined>(row)
              .with(undefined, () => (
                <tr key={`${rowId}:${JSON.stringify(row)}`}>
                  <td colSpan={4} />
                  <td
                    style={{
                      width: 50,
                      height: 50,
                    }}
                  >
                    {includes(`${rowId}`, completions) && ( //
                      <ThisRowButton onClick={handleClick(`${rowId}`)} />
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
                    if (land === '.') return
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
                            width: 60,
                            height: 60,
                          }}
                        >
                          {showTerrain && building === 'LMO' && (
                            <div style={{ padding: 11 }}>
                              <ItemList items="Pt" />
                            </div>
                          )}
                          {showTerrain && building === 'LFO' && (
                            <div style={{ padding: 11 }}>
                              <ItemList items="Wo" />
                            </div>
                          )}
                          {colIndex === 4 && completions.includes(`${rowId}`) && (
                            <ThisRowButton onClick={handleClick(`${rowId}`)} />
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

import { useInstanceContext } from '@/context/InstanceContext'
import { Tile } from 'hathora-et-labora-game'
import { LandEnum } from 'hathora-et-labora-game/dist/types'
import { map, range } from 'ramda'
import { match } from 'ts-pattern'
import { MoveHorizontal } from 'lucide-react'
import styles from '../player/iso/iso.module.css'
import { HALF_H, HALF_W, TILE_H, TILE_W, diamond, tallDiamond, toScreen } from '../player/iso/projection'

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

// same projection as the player landscape, rendered at 40%
const SCALE = 0.4
const PAD = 8

// rows outside the current landscape are sketched as a ghost heartland strip
const GHOST_COLS = range(2, 7)

type CellInfo = {
  col: number
  land?: LandEnum
  building?: string
  tall: boolean
  ghost: boolean
}

type RowInfo = {
  rowIndex: number
  rowId: number
  selectable: boolean
  cells: CellInfo[]
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

  const rows: RowInfo[] = rowsCovered.map((rowIndex) => {
    const row = landscape[rowIndex] as Tile[] | undefined
    const rowId = rowIndex - offset
    const selectable = completions.includes(`${rowId}`)
    const cells: CellInfo[] =
      row === undefined || row.every((tile) => tile.length === 0)
        ? GHOST_COLS.map((col) => ({ col, tall: false, ghost: true }))
        : row.flatMap((tile, col) => {
            if (tile.length === 0) return []
            const [land, building] = tile
            // BelowMountain is covered by the two-row mountain face above it
            if (land === undefined || land === LandEnum.BelowMountain) return []
            return [{ col, land, building, tall: land === LandEnum.Mountain, ghost: false }]
          })
    return { rowIndex, rowId, selectable, cells }
  })
  if (rows.every(({ cells }) => cells.length === 0)) return null

  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  rows.forEach(({ rowIndex, selectable, cells }) => {
    cells.forEach(({ col, tall }) => {
      const [x, y] = toScreen(col, rowIndex)
      minX = Math.min(minX, x - HALF_W)
      maxX = Math.max(maxX, x + (tall ? TILE_H + HALF_W : HALF_W))
      minY = Math.min(minY, y)
      maxY = Math.max(maxY, y + (tall ? TILE_H + HALF_H : TILE_H))
    })
    if (selectable && cells.length > 0) {
      // leave room for the row button past the last tile
      const lastCol = Math.max(...cells.map(({ col }) => col))
      const [bx, by] = toScreen(lastCol + 1, rowIndex)
      maxX = Math.max(maxX, bx + HALF_W)
      minY = Math.min(minY, by)
      maxY = Math.max(maxY, by + TILE_H)
    }
  })
  const width = maxX - minX + 2 * PAD
  const height = maxY - minY + 2 * PAD

  return (
    <svg
      width={width * SCALE}
      height={height * SCALE}
      viewBox={`${minX - PAD} ${minY - PAD} ${width} ${height}`}
      role="img"
      aria-label="landscape rows"
    >
      {rows.map(({ rowIndex, rowId, selectable, cells }) => {
        const lastCol = Math.max(...cells.map(({ col }) => col))
        const [bx, by] = toScreen(lastCol + 1, rowIndex)
        return (
          <g
            key={rowId}
            className={selectable ? styles.clickable : undefined}
            onClick={selectable ? handleClick(`${rowId}`) : undefined}
          >
            {cells.map(({ col, land, building, tall, ghost }) => {
              const [x, y] = toScreen(col, rowIndex)
              const points = tall ? tallDiamond(x, y) : diamond(x, y)
              const cx = tall ? x + HALF_W / 2 : x
              const cy = tall ? y + TILE_H * 0.75 : y + HALF_H
              return (
                <g key={`${rowId}:${col}`}>
                  {ghost ? (
                    <polygon points={points} fill="#f4f4f4" stroke="#999" strokeWidth={2} strokeDasharray="8 6" />
                  ) : (
                    <polygon
                      className={styles.top}
                      points={points}
                      fill={landToColor(land)}
                      stroke="#555"
                      strokeWidth={1}
                    />
                  )}
                  {showTerrain && ['LMO', 'LFO'].includes(building as string) && (
                    <image
                      href={`https://hathora-et-labora.s3-us-west-2.amazonaws.com/${building === 'LMO' ? 'Pt' : 'Wo'}.jpg`}
                      x={cx - 22}
                      y={cy - 22}
                      width={44}
                      height={44}
                    />
                  )}
                  {selectable && (
                    <polygon
                      className={styles.pulse}
                      points={points}
                      fill="#ffd23f"
                      fillOpacity={0.15}
                      stroke="#e0a933"
                      strokeWidth={3}
                    />
                  )}
                </g>
              )
            })}
            {selectable && (
              <g>
                <circle cx={bx} cy={by + HALF_H} r={30} fill="#007AFF" />
                <g transform={`translate(${bx - 20}, ${by + HALF_H - 20})`}>
                  <MoveHorizontal size={40} color="#ffffff" />
                </g>
              </g>
            )}
          </g>
        )
      })}
    </svg>
  )
}

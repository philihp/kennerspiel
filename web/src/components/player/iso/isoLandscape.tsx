import { useInstanceContext } from '@/context/InstanceContext'
import { head } from 'ramda'
import { Tile } from 'hathora-et-labora-game'
import { Clergy, ErectionEnum, LandEnum } from 'hathora-et-labora-game/dist/types'
import { match } from 'ts-pattern'
import { buildingName } from '@/components/buildingName'
import { ErectionModal } from '@/components/erection/'
import styles from './iso.module.css'
import { HALF_H, HALF_W, TILE_H, diamond, groundTransform, tallDiamond, toScreen } from './projection'

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

const clergyFill = { R: '#fb8072', G: '#b3de69', B: '#80b1d3', W: '#d9d9d9' }
const clergyStroke = { R: '#ad574d', G: '#87a74f', B: '#5f849e', W: '#b1b1b1' }
const clergyColor = (id: Clergy): 'R' | 'G' | 'B' | 'W' => {
  const c = id.substring(3)
  return (['R', 'G', 'B', 'W'].includes(c) ? c : 'W') as 'R' | 'G' | 'B' | 'W'
}

// two lines fit on a tile; one word rarely needs wrapping
const labelLines = (name: string): string[] => {
  const words = name.split(' ')
  if (words.length <= 1) return words
  const mid = Math.ceil(words.length / 2)
  return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')]
}

type CellInfo = {
  row: number
  col: number
  land: LandEnum
  building?: ErectionEnum
  clergy?: Clergy
  tall: boolean
}

const PAD = 6

export const IsoLandscape = ({ landscape, offset, active }: Props) => {
  const { controls, addPartial } = useInstanceContext()
  const partial = controls?.partial ?? []
  const command = head(partial) ?? ''
  const completion = controls?.completion ?? []

  const cells: CellInfo[] = []
  landscape.forEach((tiles, rowIndex) =>
    tiles.forEach((tile, colIndex) => {
      if (tile.length === 0) return
      const [land, building, clergy] = tile
      // BelowMountain is covered by the two-row mountain face above it
      if (land === undefined || land === LandEnum.BelowMountain) return
      cells.push({ row: rowIndex, col: colIndex, land, building, clergy, tall: land === LandEnum.Mountain })
    })
  )
  if (cells.length === 0) return null

  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  cells.forEach(({ row, col, tall }) => {
    const [x, y] = toScreen(col, row)
    minX = Math.min(minX, x - HALF_W)
    maxX = Math.max(maxX, x + (tall ? TILE_H + HALF_W : HALF_W))
    minY = Math.min(minY, y)
    maxY = Math.max(maxY, y + (tall ? TILE_H + HALF_H : TILE_H))
  })
  const width = maxX - minX + 2 * PAD
  const height = maxY - minY + 2 * PAD

  // matches the modal-trigger rule in the Erection card component: the modal
  // stays up while the USE command still needs parameters
  const commandComplete = completion.length === 1 && completion[0] === ''
  const usedBuildings = cells
    .map(({ building }) => building)
    .filter((building) => building !== undefined)
    .filter((building) => partial.slice(0, 2).join(' ') === `USE ${building}` && !commandComplete)

  return (
    <div className={styles.scroll}>
      <svg
        width={width}
        height={height}
        viewBox={`${minX - PAD} ${minY - PAD} ${width} ${height}`}
        role="img"
        aria-label="player landscape"
      >
        {cells.map(({ row, col, land, building, clergy, tall }) => {
          const [x, y] = toScreen(col, row)
          const rowId = row - offset
          const key = `${col - 2} ${rowId}`
          const selectable = (active && completion.includes(key)) || completion.includes(building as string)

          const handleClick = () => {
            if (completion.includes(key)) {
              addPartial(`${key}`)
            }
            if (completion.includes(building as string)) {
              addPartial(`${building}`)
            }
          }

          const primary =
            (command === 'FELL_TREES' && active && building === 'LFO') ||
            (command === 'CUT_PEAT' && active && building === 'LMO') ||
            (command === 'USE' && active && !['LFO', 'LMO'].includes(building as string)) ||
            (command === 'WORK_CONTRACT' && !active && !['LFO', 'LMO'].includes(building as string)) ||
            completion.includes(building as string)

          const points = tall ? tallDiamond(x, y) : diamond(x, y)
          // center of the face, where labels and markers sit
          const cx = tall ? x + HALF_W / 2 : x
          const cy = tall ? y + TILE_H * 0.75 : y + HALF_H
          const name = building && (buildingName(building) ?? building)

          return (
            <g
              key={`${rowId}:${col}`}
              className={selectable ? styles.clickable : undefined}
              onClick={selectable ? handleClick : undefined}
            >
              <title>{`${key} ${land}${building ? ` ${building}` : ''}`}</title>
              <polygon className={styles.top} points={points} fill={landToColor(land)} stroke="#555" strokeWidth={1} />
              {name && (
                <text
                  transform={groundTransform(cx, clergy ? cy - 8 : cy)}
                  textAnchor="middle"
                  fontSize={15}
                  fontWeight={primary && selectable ? 700 : 400}
                  fill="#333"
                  stroke="#ffffff"
                  strokeWidth={3}
                  paintOrder="stroke"
                >
                  {labelLines(name).map((line, i, lines) => (
                    <tspan key={line} x={0} y={(i - (lines.length - 1) / 2) * 16 + 5}>
                      {line}
                    </tspan>
                  ))}
                </text>
              )}
              {clergy && (
                <g transform={groundTransform(cx, cy + 14)}>
                  <circle
                    r={10}
                    fill={clergyFill[clergyColor(clergy)]}
                    stroke={clergyStroke[clergyColor(clergy)]}
                    strokeWidth={2}
                  />
                  {clergy.substring(0, 3) === 'PRI' && (
                    <>
                      <rect x={-5} y={-1.5} width={10} height={3} fill={clergyStroke[clergyColor(clergy)]} />
                      <rect x={-1.5} y={-5} width={3} height={10} fill={clergyStroke[clergyColor(clergy)]} />
                    </>
                  )}
                </g>
              )}
              {selectable && (
                <polygon
                  className={styles.pulse}
                  points={points}
                  fill="#ffd23f"
                  fillOpacity={0.25}
                  stroke="#e0a933"
                  strokeWidth={3}
                />
              )}
            </g>
          )
        })}
      </svg>
      {usedBuildings.map((building) => (
        <ErectionModal key={building} id={building} />
      ))}
    </div>
  )
}

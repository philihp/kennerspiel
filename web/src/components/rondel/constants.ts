import { join, map, pipe, range } from 'ramda'
import sin from '@stdlib/math/base/special/sin'
import cos from '@stdlib/math/base/special/cos'

export const WHEEL_RADIUS = 200

const round = (decimals: number) => (n: number) => Math.round(n * Math.pow(10, decimals)) / Math.pow(10, decimals)
const roundTo7 = round(7)

export const points = pipe(
  range(0),
  map<number, number[]>((n): number[] => {
    const x = -sin((n * Math.PI * 2) / 13) * WHEEL_RADIUS
    const y = -cos((n * Math.PI * 2) / 13) * WHEEL_RADIUS
    return [x, y]
  }),
  map<number[], number[]>(map(roundTo7))
)(13)

export const mask =
  `${points[0].join(',')} ` +
  `${points[1].join(',')} ` +
  `${points[2].join(',')} ` +
  `${points[3].join(',')} ` +
  `${points[4].join(',')} ` +
  `${points[5].join(',')} ` +
  `${points[6].join(',')} ` +
  `${points[7].join(',')} ` +
  `${points[8].join(',')} ` +
  `${points[9].join(',')} ` +
  `${points[10].join(',')} ` +
  `${points[11].join(',')} ` +
  `${points[12].join(',')} ` +
  `${points[0].join(',')} `

export const wedge = {
  A: `0,0 ${points[0].join(',')} ${points[1].join(',')} 0,0`,
  B: `0,0 ${points[1].join(',')} ${points[2].join(',')} 0,0`,
  C: `0,0 ${points[2].join(',')} ${points[3].join(',')} 0,0`,
  D: `0,0 ${points[3].join(',')} ${points[4].join(',')} 0,0`,
  E: `0,0 ${points[4].join(',')} ${points[5].join(',')} 0,0`,
  F: `0,0 ${points[5].join(',')} ${points[6].join(',')} 0,0`,
  G: `0,0 ${points[6].join(',')} ${points[7].join(',')} 0,0`,
  H: `0,0 ${points[7].join(',')} ${points[8].join(',')} 0,0`,
  I: `0,0 ${points[8].join(',')} ${points[9].join(',')} 0,0`,
  J: `0,0 ${points[9].join(',')} ${points[10].join(',')} 0,0`,
  K: `0,0 ${points[10].join(',')} ${points[11].join(',')} 0,0`,
  L: `0,0 ${points[11].join(',')} ${points[12].join(',')} 0,0`,
  M: `0,0 ${points[12].join(',')} ${points[0].join(',')} 0,0`,
}

export const rot = {
  A: `${(360 * 12.5) / points.length}`,
  B: `${(360 * 11.5) / points.length}`,
  C: `${(360 * 10.5) / points.length}`,
  D: `${(360 * 9.5) / points.length}`,
  E: `${(360 * 8.5) / points.length}`,
  F: `${(360 * 7.5) / points.length}`,
  G: `${(360 * 6.5) / points.length}`,
  H: `${(360 * 5.5) / points.length}`,
  I: `${(360 * 4.5) / points.length}`,
  J: `${(360 * 3.5) / points.length}`,
  K: `${(360 * 2.5) / points.length}`,
  L: `${(360 * 1.5) / points.length}`,
  M: `${(360 * 0.5) / points.length}`,
}

export const ARM_RADIUS = 35
export const ARM_WIDTH = 6
export const ARM_LENGTH = 180
export const ARM_TEXT_RADIUS = 25

export const armPath =
  `M${-ARM_WIDTH / 2},${-ARM_LENGTH} ` +
  `Q${-ARM_WIDTH / 2},${-ARM_RADIUS} ${Math.sin((12 / 13) * 2 * Math.PI) * ARM_RADIUS},${-Math.cos((12 / 13) * 2 * Math.PI) * ARM_RADIUS} ` +
  `A${ARM_RADIUS},${ARM_RADIUS} 0 1,0 ${Math.sin((1 / 13) * 2 * Math.PI) * ARM_RADIUS},${-Math.cos((1 / 13) * 2 * Math.PI) * ARM_RADIUS} ` +
  `Q${ARM_WIDTH / 2},${-ARM_RADIUS} ${ARM_WIDTH / 2},${-ARM_LENGTH} ` +
  `z`

export const ARROW_RADIUS = 44
export const ARROW_SIZE = 7

export const arrowPath = `M${-ARROW_SIZE / 2},${-ARROW_RADIUS} l${ARROW_SIZE},${ARROW_SIZE / 2} v${-ARROW_SIZE} z`

export const armTextY = `${-ARM_TEXT_RADIUS}`

export const HOUSE_ROOF_PEAK_RADIUS = 190
export const HOUSE_TEXT_HEIGHT = 11
export const HOUSE_ROOF_HEIGHT = 5
export const HOUSE_FLOOR_HEIGHT = 8
export const HOUSE_WIDTH = 12

export const housePath = `M0,${-HOUSE_ROOF_PEAK_RADIUS} l${-HOUSE_WIDTH / 2},${HOUSE_ROOF_HEIGHT} v${HOUSE_FLOOR_HEIGHT} h${HOUSE_WIDTH} v${-HOUSE_FLOOR_HEIGHT} z`
export const houseTextY = `${HOUSE_TEXT_HEIGHT - HOUSE_ROOF_PEAK_RADIUS}`

export const INCOME_RADIUS = HOUSE_ROOF_PEAK_RADIUS + 35

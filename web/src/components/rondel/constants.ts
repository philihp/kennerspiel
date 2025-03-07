export const WHEEL_RADIUS = 200
export const points = new Array<[number, number]>(13)

for (let n = 0; n < points.length; n++) {
  const x = -Math.sin((n * Math.PI * 2) / points.length) * WHEEL_RADIUS
  const y = -Math.cos((n * Math.PI * 2) / points.length) * WHEEL_RADIUS
  points[n] = [x, y]
}

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

export const wedgeA = `0,0 ${points[0].join(',')} ${points[1].join(',')} 0,0`
export const wedgeB = `0,0 ${points[1].join(',')} ${points[2].join(',')} 0,0`
export const wedgeC = `0,0 ${points[2].join(',')} ${points[3].join(',')} 0,0`
export const wedgeD = `0,0 ${points[3].join(',')} ${points[4].join(',')} 0,0`
export const wedgeE = `0,0 ${points[4].join(',')} ${points[5].join(',')} 0,0`
export const wedgeF = `0,0 ${points[5].join(',')} ${points[6].join(',')} 0,0`
export const wedgeG = `0,0 ${points[6].join(',')} ${points[7].join(',')} 0,0`
export const wedgeH = `0,0 ${points[7].join(',')} ${points[8].join(',')} 0,0`
export const wedgeI = `0,0 ${points[8].join(',')} ${points[9].join(',')} 0,0`
export const wedgeJ = `0,0 ${points[9].join(',')} ${points[10].join(',')} 0,0`
export const wedgeK = `0,0 ${points[10].join(',')} ${points[11].join(',')} 0,0`
export const wedgeL = `0,0 ${points[11].join(',')} ${points[12].join(',')} 0,0`
export const wedgeM = `0,0 ${points[12].join(',')} ${points[0].join(',')} 0,0`

export const rotA = `${(360 * 12.5) / points.length}`
export const rotB = `${(360 * 11.5) / points.length}`
export const rotC = `${(360 * 10.5) / points.length}`
export const rotD = `${(360 * 9.5) / points.length}`
export const rotE = `${(360 * 8.5) / points.length}`
export const rotF = `${(360 * 7.5) / points.length}`
export const rotG = `${(360 * 6.5) / points.length}`
export const rotH = `${(360 * 5.5) / points.length}`
export const rotI = `${(360 * 4.5) / points.length}`
export const rotJ = `${(360 * 3.5) / points.length}`
export const rotK = `${(360 * 2.5) / points.length}`
export const rotL = `${(360 * 1.5) / points.length}`
export const rotM = `${(360 * 0.5) / points.length}`

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

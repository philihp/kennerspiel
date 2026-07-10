// Dimetric 2:1 projection. Columns run toward the upper-right and rows toward
// the lower-right, so the water/coast columns (low col) fall to the bottom-left
// of the screen and the mountain columns (high col) to the top-right.
export const TILE_W = 160
export const TILE_H = 80
export const HALF_W = TILE_W / 2
export const HALF_H = TILE_H / 2

// screen position of the top corner of the (col, row) diamond
export const toScreen = (col: number, row: number): [number, number] => [(col + row) * HALF_W, (row - col) * HALF_H]

// SVG points string for the face of a tile whose top corner is at (x, y)
export const diamond = (x: number, y: number): string =>
  [`${x},${y}`, `${x + HALF_W},${y + HALF_H}`, `${x},${y + TILE_H}`, `${x - HALF_W},${y + HALF_H}`].join(' ')

// mountains occupy two grid rows; their face is the union of both diamonds
export const tallDiamond = (x: number, y: number): string =>
  [
    `${x},${y}`,
    `${x + HALF_W},${y + HALF_H}`,
    `${x + TILE_W},${y + TILE_H}`,
    `${x + HALF_W},${y + TILE_H + HALF_H}`,
    `${x},${y + TILE_H}`,
    `${x - HALF_W},${y + HALF_H}`,
  ].join(' ')

// unit vectors along the diamond's own edges (the col axis climbs to the
// upper-right, the row axis descends to the lower-right), so flat content
// mapped through these lies exactly parallel to the tile's actual 2:1 slope
// (atan(HALF_H / HALF_W) ≈ 26.565°) rather than a generic 30°
const GROUND_LEN = Math.hypot(HALF_W, HALF_H)
const GROUND_UX = HALF_W / GROUND_LEN
const GROUND_UY = -HALF_H / GROUND_LEN
const GROUND_VX = HALF_W / GROUND_LEN
const GROUND_VY = HALF_H / GROUND_LEN

// lays flat content (text, markers, card art) onto the ground plane
export const groundTransform = (cx: number, cy: number): string =>
  `matrix(${GROUND_UX} ${GROUND_UY} ${GROUND_VX} ${GROUND_VY} ${cx} ${cy})`

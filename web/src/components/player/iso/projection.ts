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

// lays flat content (text, markers) onto the ground plane: baseline climbs to
// the upper-right at 30° and glyph verticals lean down-right to match
export const groundTransform = (cx: number, cy: number): string => `translate(${cx} ${cy}) rotate(-30) skewX(30)`

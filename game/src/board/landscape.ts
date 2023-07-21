import {
  addIndex,
  any,
  append,
  curry,
  equals,
  filter,
  find,
  lensPath,
  map,
  pipe,
  range,
  reduce,
  reduced,
  reject,
  set,
  sum,
} from 'ramda'
import { match } from 'ts-pattern'
import {
  LandEnum,
  PlayerColor,
  Tile,
  BuildingEnum,
  Clergy,
  GameCommandConfigParams,
  ErectionEnum,
  NextUseClergy,
  StateReducer,
  Tableau,
} from '../types'
import { pointsForBuilding, pointsForDwelling, terrainForErection } from './erections'
import { isPrior, withActivePlayer, withPlayerIndex } from './player'
import { isCloisterBuilding, isSettlement } from './buildings'

export const districtPrices = (config: GameCommandConfigParams): number[] =>
  match(config)
    .with({ players: 1 }, () => [8, 7, 6, 5, 5, 4, 4, 3, 2])
    .otherwise(() => [2, 3, 4, 4, 5, 5, 6, 7, 8])

export const plotPrices = (config: GameCommandConfigParams): number[] =>
  match(config)
    .with({ players: 1 }, () => [7, 6, 6, 5, 5, 5, 4, 4, 3])
    .otherwise(() => [3, 4, 4, 5, 5, 5, 6, 6, 7])

// TODO: combine findBuilding with findBuildingOffset somehow
export const findBuildingWithoutOffset =
  (building: BuildingEnum) =>
  (landscape: Tile[][]): [number, number] | undefined => {
    let row
    let col
    landscape.forEach((landRow, r) => {
      landRow.forEach(([_l, b, _c], c) => {
        if (building === b) {
          row = r
          col = c
        }
      })
    })
    if (row === undefined || col === undefined) return undefined
    return [row, col]
  }

export const findBuilding = (
  landscape: Tile[][],
  landscapeOffset: number,
  building: BuildingEnum
): { row?: number; col?: number } => {
  let row
  let col
  landscape.forEach((landRow, r) => {
    landRow.forEach(([_l, b, _c], c) => {
      if (building === b) {
        row = r - landscapeOffset
        col = c
      }
    })
  })
  return { row, col }
}

export const findClergy =
  (clergy: Clergy[]) =>
  (landscape: Tile[][]): [number, number, Tile][] => {
    const locationsFound: [number, number, Tile][] = []
    landscape.forEach((landRow, r) => {
      landRow.forEach((land, c) => {
        const [_l, _b, clergyHere] = land
        if (clergyHere && clergy.includes(clergyHere)) {
          locationsFound.push([r, c, land])
        }
      })
    })
    return locationsFound
  }

const PP: Tile = [LandEnum.Plains, BuildingEnum.Peat]
const PF: Tile = [LandEnum.Plains, BuildingEnum.Forest]
const P: Tile = [LandEnum.Plains]

const startBuilding = {
  [PlayerColor.Red]: [BuildingEnum.ClayMoundR, BuildingEnum.FarmYardR, BuildingEnum.CloisterOfficeR],
  [PlayerColor.Green]: [BuildingEnum.ClayMoundG, BuildingEnum.FarmYardG, BuildingEnum.CloisterOfficeG],
  [PlayerColor.Blue]: [BuildingEnum.ClayMoundB, BuildingEnum.FarmYardB, BuildingEnum.CloisterOfficeB],
  [PlayerColor.White]: [BuildingEnum.ClayMoundW, BuildingEnum.FarmYardW, BuildingEnum.CloisterOfficeW],
}

export const makeLandscape = (color: PlayerColor): Tile[][] => {
  const cm: Tile = [LandEnum.Hillside, startBuilding[color][0]]
  const fy: Tile = [LandEnum.Plains, startBuilding[color][1]]
  const co: Tile = [LandEnum.Plains, startBuilding[color][2]]
  return [
    [[], [], PP, PF, PF, P, cm, [], []],
    [[], [], PP, PF, fy, P, co, [], []],
  ]
}

const checkLandTypeMatchesPlayer = (row: number, col: number, erection: ErectionEnum) => (player: Tableau) => {
  const tile = player.landscape[row + player.landscapeOffset][col + 2]
  const [landAtSpot] = tile
  const eligibleTerrain = terrainForErection(erection)
  if (landAtSpot && !eligibleTerrain.includes(landAtSpot)) return undefined
  return player
}

export const checkLandTypeMatches =
  (row: number, col: number, erection: ErectionEnum): StateReducer =>
  (state) => {
    if (state?.frame.neutralBuildingPhase) return state
    return withActivePlayer(checkLandTypeMatchesPlayer(row, col, erection))(state)
  }

export const checkLandscapeFree =
  (row: number, col: number, toBuild: ErectionEnum): StateReducer =>
  (state) => {
    if (state?.frame.neutralBuildingPhase && isSettlement(toBuild) === false) {
      return withPlayerIndex(1)((player) => {
        const [, existing] = player.landscape?.[row + player.landscapeOffset]?.[col + 2] ?? []
        if (existing === undefined) return player
        if (existing && isCloisterBuilding(existing) === isCloisterBuilding(toBuild)) return player
        return undefined
      })(state)
    }
    return withActivePlayer((player) => {
      const [land, erection] = player.landscape?.[row + player.landscapeOffset]?.[col + 2] ?? []
      if (land === undefined) return undefined
      if (erection !== undefined) return undefined
      return player
    })(state)
  }

export const getAdjacentOffsets = (col: number): [number, number][] =>
  match<number, [number, number][]>(col)
    .with(5, () => [
      [1, 0], // south
      [-1, 0], // north
      [0, -1], // west
      [-1, 1], // northeast
      [0, 1], // southeast
    ])
    .with(6, () => [
      [0, -1], // northwest
      [1, -1], // southwest
    ])
    .otherwise(() => [
      [1, 0], // south
      [-1, 0], // north
      [0, 1], // east
      [0, -1], // west
    ])

export const checkCloisterAdjacencyPlayer = (row: number, col: number, building: ErectionEnum) => (player: Tableau) => {
  if (isCloisterBuilding(building) === false) return player
  return pipe<[number], [number, number][], (ErectionEnum | undefined)[], boolean>(
    getAdjacentOffsets,
    map(
      ([rowOffset, colOffset]) =>
        player?.landscape[row + rowOffset + (player.landscapeOffset ?? 0)]?.[col + 2 + colOffset]?.[1]
    ),
    any(isCloisterBuilding)
  )(col)
    ? player
    : undefined
}

export const checkCloisterAdjacency =
  (row: number, col: number, building: ErectionEnum): StateReducer =>
  (state) => {
    if (state?.frame.neutralBuildingPhase) {
      return withPlayerIndex(1)(checkCloisterAdjacencyPlayer(row, col, building))(state)
    }
    return withActivePlayer(checkCloisterAdjacencyPlayer(row, col, building))(state)
  }

export const moveClergyToOwnBuilding =
  (building: BuildingEnum): StateReducer =>
  (state) => {
    if (state === undefined) return undefined
    if (state.frame.nextUse === NextUseClergy.Free) return state
    const player = state.players[state.frame.activePlayerIndex]
    const matrixLocation = findBuildingWithoutOffset(building)(player.landscape)
    if (matrixLocation === undefined) return undefined
    const [row, col] = matrixLocation
    const [land, ,] = player.landscape[row][col]

    const priors = player.clergy.filter(isPrior)
    if (state.frame.nextUse === NextUseClergy.OnlyPrior && priors.length === 0) return undefined
    // ^this line unnecessary
    const nextClergy = match(state.frame.nextUse)
      .with(NextUseClergy.Any, () => player.clergy[0])
      .with(NextUseClergy.OnlyPrior, () => priors[0])
      .exhaustive()

    if (nextClergy === undefined) return undefined

    return withActivePlayer(
      pipe(
        //
        set<Tableau, Tile>(lensPath(['landscape', row, col]), [land, building, nextClergy]),
        set<Tableau, Clergy[]>(lensPath(['clergy']), filter((c) => c !== nextClergy)(player.clergy))
      )
    )(state)
  }

export const moveClergyToNeutralBuilding =
  (building: BuildingEnum): StateReducer =>
  (state) => {
    if (state === undefined) return undefined
    const neutralPlayer = state.players[1]
    const matrixLocation = findBuildingWithoutOffset(building)(neutralPlayer.landscape)
    if (matrixLocation === undefined) return undefined
    const [row, col] = matrixLocation
    const [land, ,] = neutralPlayer.landscape[row][col]
    const nextClergy =
      state.frame.nextUse === NextUseClergy.OnlyPrior ? find(isPrior, neutralPlayer.clergy) : neutralPlayer.clergy[0]
    if (nextClergy === undefined) return undefined

    return withPlayerIndex(1)(
      pipe(
        //
        set<Tableau, Tile>(lensPath(['landscape', row, col]), [land, building, nextClergy]),
        set<Tableau, Clergy[]>(lensPath(['clergy']), filter((c) => c !== nextClergy)(neutralPlayer.clergy))
      )
    )(state)
  }

const removeClergyFromActivePlayer = (clergy: Clergy): StateReducer =>
  withActivePlayer((player) => {
    return {
      ...player,
      clergy: reject(equals(clergy), player.clergy),
    }
  })

const addClergyToTile =
  (clergy: Clergy) =>
  (playerIndex: number, row: number, col: number): StateReducer =>
    withPlayerIndex(playerIndex)((player) => {
      if (player === undefined) return undefined
      const [land, building, _] = player.landscape[row][col]
      return {
        ...player,
        landscape: [
          ...player.landscape.slice(0, row),
          [
            ...player.landscape[row].slice(0, col),
            // what to do about existingClergy? Just overwrite it for now, but
            // it might be nice to make it stack when multiple players go there
            [land, building, clergy],
            ...player.landscape[row].slice(col + 1),
          ],
          ...player.landscape.slice(row + 1),
        ],
      }
    })

const clearBonusRoundPlacement: StateReducer = (state) => {
  if (state === undefined) return undefined
  return {
    ...state,
    frame: {
      ...state.frame,
      bonusRoundPlacement: false,
    },
  }
}

export const moveClergyInBonusRoundTo =
  (building: BuildingEnum): StateReducer =>
  (state) => {
    if (state === undefined) return undefined

    const playerIndexes = range(0, state.config.players)
    const foundWithPlayer = reduce(
      (accum: [number, number, number] | undefined, elem: number) => {
        const searchResult = findBuildingWithoutOffset(building)(state.players[elem].landscape)
        if (searchResult === undefined) return accum
        const [searchRow, searchCol] = searchResult
        const result: [number, number, number] = [elem, searchRow, searchCol]
        return reduced(result)
      },
      undefined as [number, number, number] | undefined,
      playerIndexes
    )
    if (foundWithPlayer === undefined) return undefined

    const [p, r, c] = foundWithPlayer
    const [prior] = state.players[state.frame.activePlayerIndex].clergy.filter(isPrior)

    return pipe(
      //
      removeClergyFromActivePlayer(prior),
      addClergyToTile(prior)(p, r, c),
      clearBonusRoundPlacement
    )(state)
  }

// given a row of tiles, return all of the buildings where there is a building AND a clergy
const occupiedBuildingsInRow = (row: Tile[]) =>
  reduce<Tile, BuildingEnum[]>(
    (rAccum, [_, building, clergy]: Tile) => {
      if (building !== undefined && clergy !== undefined && !isSettlement(building))
        rAccum.push(building as BuildingEnum)
      return rAccum
    },
    [] as BuildingEnum[],
    row
  )

// given a list of rows, do the thing
const occupiedBuildingsForLandscape = (land: Tile[][]) =>
  reduce<Tile[], BuildingEnum[]>(
    (rAccum, landRow: Tile[]) => {
      const occupied = occupiedBuildingsInRow(landRow)
      rAccum.push(...occupied)
      return rAccum
    },
    [] as BuildingEnum[],
    land
  )

export const occupiedBuildingsForPlayers = reduce<Tableau, BuildingEnum[]>((pAccum, { landscape }) => {
  const occupied = occupiedBuildingsForLandscape(landscape)
  pAccum.push(...occupied)
  return pAccum
}, [] as BuildingEnum[])

export const forestLocationsForCol = (rawCol: string, player: Tableau): string[] => {
  const col = Number.parseInt(rawCol, 10) + 2
  const colsAtRow = map((row: Tile[]) => row[col], player.landscape)
  return addIndex<Tile, string[]>(reduce<Tile, string[]>)(
    (accum: string[], tile: Tile, rowIndex: number) => {
      if (tile[1] === BuildingEnum.Forest) accum.push(`${rowIndex - player.landscapeOffset}`)
      return accum
    },
    [] as string[],
    colsAtRow
  )
}

export const forestLocations = (player: Tableau): string[] =>
  addIndex(reduce<Tile[], string[]>)(
    (accum: string[], row: Tile[], rowIndex: number) =>
      addIndex(reduce<Tile, string[]>)(
        (innerAccum: string[], tile: Tile, colIndex: number) => {
          if (tile[1] === BuildingEnum.Forest) innerAccum.push(`${colIndex - 2} ${rowIndex - player.landscapeOffset}`)
          return innerAccum
        },
        accum,
        row
      ),
    [] as string[],
    player.landscape
  )

export const moorLocationsForCol = (rawCol: string, player: Tableau): string[] => {
  const col = Number.parseInt(rawCol, 10) + 2
  const colsAtRow = map((row: Tile[]) => row[col], player.landscape)
  return addIndex<Tile, string[]>(reduce<Tile, string[]>)(
    (accum: string[], tile: Tile, rowIndex: number) => {
      if (tile[1] === BuildingEnum.Peat) accum.push(`${rowIndex - player.landscapeOffset}`)
      return accum
    },
    [] as string[],
    colsAtRow
  )
}

export const moorLocations = (player: Tableau): string[] =>
  addIndex(reduce<Tile[], string[]>)(
    (accum: string[], row: Tile[], rowIndex: number) =>
      addIndex(reduce<Tile, string[]>)(
        (innerAccum: string[], tile: Tile, colIndex: number) => {
          if (tile[1] === BuildingEnum.Peat) innerAccum.push(`${colIndex - 2} ${rowIndex - player.landscapeOffset}`)
          return innerAccum
        },
        accum,
        row
      ),
    [] as string[],
    player.landscape
  )

export const erectableLocationsCol = (erection: ErectionEnum, rawCol: string, player: Tableau): string[] => {
  const col = Number.parseInt(rawCol, 10) + 2
  const colsAtRow = map((row: Tile[]) => row[col], player.landscape)
  return addIndex<Tile, string[]>(reduce<Tile, string[]>)(
    (accum: string[], tile: Tile, rowIndex: number) => {
      const [land, building] = tile
      if (
        land &&
        !building &&
        !!checkLandTypeMatchesPlayer(rowIndex - player.landscapeOffset, col - 2, erection)(player) &&
        !!checkCloisterAdjacencyPlayer(rowIndex - player.landscapeOffset, col - 2, erection)(player)
      )
        accum.push(`${rowIndex - player.landscapeOffset}`)

      return accum
    },
    [] as string[],
    colsAtRow
  )
}

export const erectableLocations = curry((erection: ErectionEnum, player: Tableau): string[] =>
  addIndex(reduce<Tile[], string[]>)(
    (accum: string[], row: Tile[], rowIndex: number) =>
      addIndex(reduce<Tile, string[]>)(
        (innerAccum: string[], tile: Tile, colIndex: number) => {
          const [land, building] = tile
          if (
            land &&
            !building &&
            !!checkLandTypeMatchesPlayer(rowIndex - player.landscapeOffset, colIndex - 2, erection)(player) &&
            !!checkCloisterAdjacencyPlayer(rowIndex - player.landscapeOffset, colIndex - 2, erection)(player)
          )
            innerAccum.push(`${colIndex - 2} ${rowIndex - player.landscapeOffset}`)

          return innerAccum
        },
        accum,
        row
      ),
    [] as string[],
    player.landscape
  )
)

export const LANDSCAPES: ErectionEnum[] = [BuildingEnum.Forest, BuildingEnum.Peat]

export const allVacantUsableBuildings = (landscape: Tile[][]): BuildingEnum[] =>
  reduce(
    (accum, row) =>
      reduce(
        (accum, tile) => {
          const [, building, clergy] = tile
          if (
            building !== undefined &&
            clergy === undefined &&
            LANDSCAPES.includes(building) === false &&
            isSettlement(building) === false
          )
            accum.push(building as BuildingEnum)
          return accum
        },
        accum,
        row
      ),
    [] as BuildingEnum[],
    landscape
  )

export const allBuildingPoints = (landscape: Tile[][]): number =>
  reduce(
    (accum: number, row: Tile[]) =>
      reduce(
        (accum: number, tile: Tile) => {
          const [, building] = tile
          if (building !== undefined && LANDSCAPES.includes(building) === false)
            return accum + pointsForBuilding(building)
          return accum
        },
        accum,
        row
      ),
    0,
    landscape
  )

export const allDwellingPoints = (landscape: Tile[][]): number[] =>
  pipe(
    // first get the coordinates of all of the settlements - column offset by 2, but dont worry about row offset (weird)
    (landscape: Tile[][]): [number, number][] => {
      if (landscape === undefined) return []
      const locations: [number, number][] = []
      landscape.forEach((landRow: Tile[], r: number) => {
        landRow.forEach(([_l, b, _c]: Tile, c: number) => {
          if (b && isSettlement(b)) {
            locations.push([r, c - 2])
          }
        })
      })
      return locations
    },
    map(([row, col]) =>
      pipe(
        // get all of the offsets for the given column
        getAdjacentOffsets,

        // and also consider your own tile
        append<[number, number]>([0, 0]),

        // grab each of those tiles
        map<[number, number], Tile>(([rowOff, colOff]) => landscape?.[row + rowOff]?.[col + colOff + 2]),

        // and for each tile, calculate how much dwelling it adds
        map<Tile, number>((tile) => {
          if (tile === undefined) return 0
          const [land, building] = tile
          if (building !== undefined) return pointsForDwelling(building)
          if (land === LandEnum.Water) return 3
          return 0
        }),

        // and sum that all together
        sum
      )(col)
    )
  )(landscape)

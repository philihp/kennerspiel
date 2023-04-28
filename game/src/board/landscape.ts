import { addIndex, filter, map, pipe, range, reduce, reduced } from 'ramda'
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
import { terrainForErection } from './erections'
import { isLayBrother, isPrior, withActivePlayer, withPlayerIndex } from './player'

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

export const checkLandTypeMatches = (row: number, col: number, erection: ErectionEnum) =>
  withActivePlayer((player) => {
    const landAtSpot = player.landscape[row + player.landscapeOffset][col + 2][0]
    if (landAtSpot && !terrainForErection(erection).includes(landAtSpot)) return undefined
    return player
  })

export const checkLandscapeFree = (row: number, col: number) => {
  return withActivePlayer((player) => {
    const [, erection] = player.landscape[row + player.landscapeOffset][col + 2]
    if (erection !== undefined) return undefined
    return player
  })
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

    return withActivePlayer((player) => ({
      ...player,
      landscape: [
        ...player.landscape.slice(0, row),
        [
          ...player.landscape[row].slice(0, col),
          [land, building, nextClergy] as Tile,
          ...player.landscape[row].slice(col + 1),
        ],
        ...player.landscape.slice(row + 1),
      ],
      clergy: filter((c) => c !== nextClergy)(player.clergy),
    }))(state)
  }

const removeClergyFromActivePlayer = (clergy: Clergy): StateReducer =>
  withActivePlayer((player) => {
    return {
      ...player,
      clergy: filter(isLayBrother, player.clergy),
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
const occupiedBuildingsInRow = reduce(
  (rAccum, [_, building, clergy]: Tile) => (building && clergy ? [...rAccum, building] : rAccum),
  [] as BuildingEnum[]
)

// given a list of rows, do the thing
const occupiedBuildingsForLandscape = reduce(
  (rAccum, landRow: Tile[]) => [...rAccum, ...occupiedBuildingsInRow(landRow as Tile[])],
  [] as BuildingEnum[]
)

export const occupiedBuildingsForPlayers = (players: Tableau[]) =>
  reduce(
    (pAccum, { landscape }) => [...pAccum, ...occupiedBuildingsForLandscape(landscape)],
    [] as BuildingEnum[],
    players
  )

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

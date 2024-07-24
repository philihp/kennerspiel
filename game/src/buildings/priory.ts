import { always, curry, filter, map, pipe, reject } from 'ramda'
import { match } from 'ts-pattern'
import { setFrameToAllowFreeUsage } from '../board/frame'
import { findClergy } from '../board/landscape'
import { priors } from '../board/player'
import { BuildingEnum, ErectionEnum, GameStatePlaying, StateReducer, Tableau, Tile } from '../types'

export const priory = (): StateReducer => (state) => {
  if (state === undefined) return undefined
  const landscapes = map<Tableau, Tile[][]>(({ landscape }) => landscape)(state.players)
  const clergyLocation = map<Tile[][], [number, number, Tile][]>(findClergy(priors(state)), landscapes)
  const foundClergy = reject<[number, number, Tile][], [number, number, Tile][][]>(
    (l) => l.length === 0,
    clergyLocation
  )
  const clergyBuildings = map<[number, number, Tile][], BuildingEnum>(
    ([[_r, _c, [_l, building]]]) => building as BuildingEnum,
    foundClergy
  )
  const usableBuildings = filter<BuildingEnum, BuildingEnum[]>(
    (b: BuildingEnum) => b !== BuildingEnum.Priory,
    clergyBuildings
  )
  return setFrameToAllowFreeUsage(usableBuildings)(state)
}

export const complete = curry((partial: string[], _state: GameStatePlaying): string[] =>
  match(partial)
    .with([], always(['']))
    .otherwise(always([]))
)

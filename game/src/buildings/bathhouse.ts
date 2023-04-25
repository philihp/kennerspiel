import { always, curry, pipe, view } from 'ramda'
import { P, match } from 'ts-pattern'
import { activeLens, clergyForColor, getCost, payCost, withActivePlayer } from '../board/player'
import { costMoney, parseResourceParam } from '../board/resource'
import { GameCommandConfigParams, GameStatePlaying, StateReducer, Tableau, Tile } from '../types'

const takeBackAllClergy =
  (config: GameCommandConfigParams) =>
  (player: Tableau | undefined): Tableau | undefined => {
    if (player === undefined) return undefined
    const newClergy = clergyForColor(config)(player.color)
    let dirty = false
    const newLandscape = player.landscape.map((landRow) =>
      landRow.map((landStack) => {
        if (landStack.length === 0) return landStack
        const [terrain, building, clergy] = landStack
        if (clergy === undefined) return landStack
        if (!newClergy.includes(clergy)) return landStack
        dirty = true
        return [terrain, building] as Tile
      })
    )
    if (!dirty) return player
    return {
      ...player,
      clergy: newClergy,
      landscape: newLandscape,
    }
  }

export const bathhouse =
  (param = ''): StateReducer =>
  (state) => {
    if (state === undefined) return undefined
    if (param === '') return state
    const input = parseResourceParam(param)
    if (costMoney(input) < 1) return state
    return withActivePlayer(
      pipe(
        //
        payCost(input),
        getCost({ book: 1, ceramic: 1 }),
        takeBackAllClergy(state.config)
      )
    )(state)
  }

export const complete = curry((partial: string[], state: GameStatePlaying): string[] =>
  match(partial)
    .with([], () => (view(activeLens(state), state).penny ? ['Pn', ''] : ['']))
    .with([P._], always(['']))
    .otherwise(always([]))
)

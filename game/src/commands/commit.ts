import { always, pipe } from 'ramda'
import { match } from 'ts-pattern'
import { nextFrame } from '../board/frame'
import { GameCommandEnum, GameState, StateReducer } from '../types'

const checkCanCommit: StateReducer = (state) => {
  if (state === undefined) return state
  // A work-contract responder (active != current) is mid-interrupt: they must
  // place a clergyman in response, not end the whole turn.
  if (state.frame!.currentPlayerIndex !== state.frame!.activePlayerIndex) return undefined
  // The solo neutral building phase must place all neutral buildings first.
  if (state.frame!.neutralBuildingPhase && state.buildings!.length !== 0) return undefined
  // Otherwise a player may always end their turn. The rules say each player
  // "gets to carry out one action" — an entitlement, not an obligation (the
  // designer reserves "must" for real obligations), so passing (COMMIT without
  // using the main action) is legal. Requiring mainActionUsed also softlocked
  // end-game states where no legal action remained.
  return state
}

export const commit: StateReducer = pipe(
  //
  checkCanCommit,
  nextFrame
)

export const complete =
  (state: GameState) =>
  (partial: string[]): string[] => {
    return match<string[], string[]>(partial)
      .with([], () => {
        if (checkCanCommit(state) === undefined) return []
        return [GameCommandEnum.COMMIT]
      })
      .with([GameCommandEnum.COMMIT], () => [''])
      .otherwise(always([]))
  }

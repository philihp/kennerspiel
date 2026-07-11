// MCTS self-play game generator. Records, per decision, the state (as the
// command list so far — tiny and replayable, NOT a dense tensor) plus the MCTS
// visit distribution (a future policy target) and the chosen move. Each game
// is labeled with the final per-player outcome (the value target). Game-blind:
// reaches the game only through a GameAdapter.

import type { GameAdapter } from './game/adapter'
import { search, type MctsOptions } from './mcts/search'
import type { Rng } from './rng'

export type Decision<TMove> = {
  perspective: number // player to move (slot to encode from)
  commands: TMove[] // moves so far → replay to reconstruct the state
  visits: { move: TMove; n: number }[] // MCTS visit counts (policy target)
  chosen: TMove
}

export type SelfPlayGame<TMove> = {
  commands: TMove[]
  decisions: Decision<TMove>[]
  outcome: number[]
  finished: boolean
  steps: number
}

export const selfPlayGame = async <TState, TMove, TCfg>(
  adapter: GameAdapter<TState, TMove, TCfg>,
  cfg: TCfg,
  seed: number,
  rng: Rng,
  options: MctsOptions,
  maxSteps = 8000
): Promise<SelfPlayGame<TMove>> => {
  const commands: TMove[] = [...adapter.opening(cfg, seed)]
  let state = adapter.initial(cfg, seed)
  const decisions: Decision<TMove>[] = []
  let steps = 0
  while (!adapter.isTerminal(state) && steps < maxSteps) {
    const res = search(adapter, state, rng, options)
    if (res.best === undefined) break
    decisions.push({
      perspective: adapter.playerToMove(state),
      commands: [...commands],
      visits: res.visits.map((v) => ({ move: v.move, n: v.n })),
      chosen: res.best,
    })
    const next = adapter.apply(state, res.best)
    if (next === undefined) break
    commands.push(res.best)
    state = next
    steps++
  }
  return { commands, decisions, outcome: adapter.outcome(state), finished: adapter.isTerminal(state), steps }
}

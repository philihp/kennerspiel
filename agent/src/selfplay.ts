// MCTS self-play game generator. Records, per decision, the state (as the
// command list so far — tiny and replayable, NOT a dense tensor) plus the MCTS
// visit distribution (a future policy target) and the chosen move. Each game
// is labeled with the final per-player outcome (the value target).

import { apply, replay, isPlaying, isTerminal, outcome, playerToMove } from './engine'
import type { Move } from './engine'
import { opening, type GameConfig } from './arena'
import { search, type MctsOptions } from './mcts/search'
import type { Rng } from './rng'

export type Decision = {
  perspective: number // player to move (slot to encode from)
  commands: Move[] // moves so far → replay to reconstruct the state
  visits: { move: Move; n: number }[] // MCTS visit counts (policy target)
  chosen: Move
}

export type SelfPlayGame = {
  commands: Move[]
  decisions: Decision[]
  outcome: number[]
  finished: boolean
  steps: number
}

export const selfPlayGame = (
  cfg: GameConfig,
  seed: number,
  rng: Rng,
  options: MctsOptions,
  maxSteps = 8000
): SelfPlayGame => {
  const commands = opening(cfg, seed)
  let state = replay(commands)
  if (state === undefined) throw new Error('bad opening')
  const decisions: Decision[] = []
  let steps = 0
  while (isPlaying(state) && steps < maxSteps) {
    const res = search(state, rng, options)
    if (res.best === undefined) break
    decisions.push({
      perspective: playerToMove(state),
      commands: [...commands],
      visits: res.visits.map((v) => ({ move: v.move, n: v.n })),
      chosen: res.best,
    })
    const next = apply(state, res.best)
    if (next === undefined) break
    commands.push(res.best)
    state = next
    steps++
  }
  return { commands, decisions, outcome: outcome(state), finished: isTerminal(state), steps }
}

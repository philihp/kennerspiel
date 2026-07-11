import type { Rng } from './rng'

// A policy chooses one move for the player-to-move. Returns undefined only if
// there is no legal move (a stuck/terminal state).
//
// `pick` is async so the evaluator seam (project 12) and ONNX inference (21)
// don't force a second churn through every policy / playGame / selfPlayGame.
// Today's implementations resolve immediately, so awaiting them changes no
// rng-call ordering — same seeds produce the same games.
export type Policy<TState, TMove> = {
  name: string
  pick: (state: TState, rng: Rng) => Promise<TMove | undefined>
}

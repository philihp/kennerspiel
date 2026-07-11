// The game-agnostic seam. Everything above it — MCTS, self-play, arena,
// training export — is generic over <TState, TMove> and reaches the game ONLY
// through a GameAdapter value. Adding a second Uwe-style game means writing one
// adapter (see ./oel.ts), not touching search or the trainer.
//
// The adapter is a bag of pure functions plus two constant specs (an object
// type, not a class — no `this`, no inheritance), matching the house style of
// `Policy`.

import type { Rng } from '../rng'

export type { Rng }

// Enumeration caps (formerly moves.ts `EnumerateOpts`): a per-node cap on child
// tokens expanded, and a hard cap on total complete moves.
export type Caps = { maxPerLevel?: number; maxMoves?: number }

// State-encoder descriptor. Structurally a subset of the game package's
// `featureSpec`, so the concrete spec assigns directly. `version` guards every
// downstream artifact (shards, ckpt, spec.json, ONNX) — see
// docs/trainer/schemas.md.
export type FeatureSpecMeta = { version: number; featureLen: number }

// Move-encoder descriptor. Real shape (moveFeatureLen, vocab, …) lands with
// project 11; kept minimal here so nothing in M2 depends on it.
export type ActionSpec = { version: number }

export type GameAdapter<TState, TMove, TCfg = unknown> = {
  name: string
  // The replayable command prefix that `initial` applies (e.g. CONFIG/START).
  // Kept alongside `initial` so a generic harness can log a fully replayable
  // command list (self-play JSONL requires the opening — see schemas.md).
  opening(cfg: TCfg, seed: number): TMove[]
  initial(cfg: TCfg, seed: number): TState
  apply(state: TState, move: TMove): TState | undefined
  isTerminal(state: TState): boolean
  // Player we need input from at this node ("player to move"); differs from the
  // current player only during interrupts (e.g. WORK_CONTRACT).
  playerToMove(state: TState): number
  numPlayers(state: TState): number
  // Per-player reward vector in [0, 1], higher = better. Defined MID-GAME too:
  // the pure-UCT rollout cutoff (mcts/search.ts) ranks non-terminal states by
  // it, and gen-0 self-play depends on that.
  outcome(state: TState): number[]
  // Curated, canonical, deduped legal moves (dedupe by `moveKey`).
  legalMoves(state: TState, caps?: Caps): TMove[]
  // One legal move without enumerating the whole set (rollouts / random play).
  sampleMove(state: TState, rng: Rng): TMove | undefined
  // Canonical serialization; equal keys ⇒ same move (dedupe + visit alignment).
  moveKey(move: TMove): string
  // Per-player scalar for the greedy baseline (raw score, not a rank). Optional
  // because it is a baseline convenience, not a core requirement.
  heuristic?(state: TState): number[]

  featureSpec: FeatureSpecMeta
  // Egocentric state encoding written into `out` (slot 0 = perspective).
  encodeState(state: TState, perspective: number, out: Float32Array): void

  actionSpec: ActionSpec
  // Move encoding — throws until project 11; nothing in M2 calls it.
  encodeMove(state: TState, perspective: number, move: TMove, out: Float32Array): void
}

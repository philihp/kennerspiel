// Pure MCTS (UCT) over the game tree. No neural net yet: leaves are evaluated
// by depth-capped random rollouts with a score-margin cutoff.
//
// The game is multiplayer and not strictly zero-sum, so every node backs up a
// per-player value VECTOR, and selection maximizes the component of the player
// to move at that node. This is correct for runs of same-player nodes (a turn
// is several commands) and for WORK_CONTRACT interrupts, since each node keys
// off its own activePlayerIndex.
//
// The selection arg-max, rollout, and back-up loops below are deliberately
// imperative: they run on the order of sims × depth times per move, so the
// per-call array allocation of a functional style would dominate. Cold paths
// (engine.outcome, arena aggregation, …) use ramda instead.

import { apply, isTerminal, numPlayers, outcome, playerToMove } from '../engine'
import type { Move } from '../engine'
import type { GameState } from 'hathora-et-labora-game'
import { enumerateMoves, sampleMove, type EnumerateOpts } from '../moves'
import type { Rng } from '../rng'

export type MctsOptions = {
  sims: number // simulations per move
  c?: number // UCT exploration constant
  rolloutDepth?: number // max commands played in a rollout before cutoff
  curation?: EnumerateOpts // caps on per-node move enumeration
}

const DEFAULTS = {
  c: 1.4,
  rolloutDepth: 30,
  curation: { maxPerLevel: 24, maxMoves: 128 } as EnumerateOpts,
}

type Edge = { move: Move; child: Node | null; n: number; w: number[] }

class Node {
  readonly mover: number
  readonly terminal: boolean
  readonly untried: Move[]
  readonly edges: Edge[] = []
  n = 0
  constructor(
    readonly state: GameState,
    curation: EnumerateOpts
  ) {
    this.terminal = isTerminal(state)
    this.mover = this.terminal ? -1 : playerToMove(state)
    this.untried = this.terminal ? [] : enumerateMoves(state, curation)
  }
}

const zeros = (n: number): number[] => new Array(n).fill(0)

const selectEdge = (node: Node, c: number): Edge => {
  const logN = Math.log(node.n)
  let best: Edge | null = null
  let bestScore = -Infinity
  for (const edge of node.edges) {
    const q = edge.w[node.mover]! / edge.n
    const u = c * Math.sqrt(logN / edge.n)
    const score = q + u
    if (score > bestScore) {
      bestScore = score
      best = edge
    }
  }
  return best!
}

const rollout = (state: GameState, rng: Rng, depth: number): number[] => {
  let s = state
  let d = 0
  while (!isTerminal(s) && d < depth) {
    const m = sampleMove(s, rng)
    if (m === undefined) break
    const next = apply(s, m)
    if (next === undefined) break
    s = next
    d++
  }
  // outcome() on a non-terminal state ranks by current score totals — the
  // score-margin cutoff that lets rollouts stay shallow.
  return outcome(s)
}

export type SearchResult = {
  root: Node
  best: Move | undefined
  // visit distribution over root moves (for a future policy target)
  visits: { move: Move; n: number; q: number }[]
}

export const search = (state: GameState, rng: Rng, options: MctsOptions): SearchResult => {
  const c = options.c ?? DEFAULTS.c
  const rolloutDepth = options.rolloutDepth ?? DEFAULTS.rolloutDepth
  const curation = options.curation ?? DEFAULTS.curation
  const players = numPlayers(state)

  const root = new Node(state, curation)

  for (let i = 0; i < options.sims; i++) {
    let node = root
    const path: Edge[] = []
    const visited: Node[] = [root]

    // SELECT: descend fully-expanded, non-terminal nodes
    while (!node.terminal && node.untried.length === 0 && node.edges.length > 0) {
      const edge = selectEdge(node, c)
      path.push(edge)
      node = edge.child!
      visited.push(node)
    }

    // EXPAND: pop one untried move
    if (!node.terminal && node.untried.length > 0) {
      const move = node.untried.pop()!
      const next = apply(node.state, move)
      // enumerated moves are legal, but guard anyway
      const child = new Node(next ?? node.state, curation)
      const edge: Edge = { move, child, n: 0, w: zeros(players) }
      node.edges.push(edge)
      path.push(edge)
      node = child
      visited.push(node)
    }

    // SIMULATE
    const value = node.terminal ? outcome(node.state) : rollout(node.state, rng, rolloutDepth)

    // BACKUP
    for (const n of visited) n.n++
    for (const edge of path) {
      edge.n++
      for (let p = 0; p < players; p++) edge.w[p]! += value[p]!
    }
  }

  const visits = root.edges
    .map((e) => ({ move: e.move, n: e.n, q: e.n > 0 ? e.w[root.mover]! / e.n : 0 }))
    .sort((x, y) => y.n - x.n)

  return { root, best: visits[0]?.move, visits }
}

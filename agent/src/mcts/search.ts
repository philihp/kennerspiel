// Pure MCTS (UCT) over the game tree. No neural net yet: leaves are evaluated
// by depth-capped random rollouts with a score-margin cutoff.
//
// The game is multiplayer and not strictly zero-sum, so every node backs up a
// per-player value VECTOR, and selection maximizes the component of the player
// to move at that node. This is correct for runs of same-player nodes (a turn
// is several commands) and for WORK_CONTRACT interrupts, since each node keys
// off its own activePlayerIndex.
//
// Game-blind: everything here reaches the game only through the GameAdapter.
// The selection arg-max, rollout, and back-up loops are deliberately imperative:
// they run on the order of sims × depth times per move, so the per-call array
// allocation of a functional style would dominate.
//
// `search` stays SYNCHRONOUS (unlike Policy.pick) — pure-UCT hot loops must not
// pay promise overhead. Project 13 (PUCT) replaces it with the async evaluator.

import type { GameAdapter, Caps, Rng } from '../game/adapter'

export type MctsOptions = {
  sims: number // simulations per move
  c?: number // UCT exploration constant
  rolloutDepth?: number // max commands played in a rollout before cutoff
  curation?: Caps // caps on per-node move enumeration
}

const DEFAULTS = {
  c: 1.4,
  rolloutDepth: 30,
  curation: { maxPerLevel: 24, maxMoves: 128 } as Caps,
}

type Edge<TState, TMove> = { move: TMove; child: Node<TState, TMove> | null; n: number; w: number[] }

class Node<TState, TMove> {
  readonly mover: number
  readonly terminal: boolean
  readonly untried: TMove[]
  readonly edges: Edge<TState, TMove>[] = []
  n = 0
  constructor(adapter: GameAdapter<TState, TMove>, readonly state: TState, curation: Caps) {
    this.terminal = adapter.isTerminal(state)
    this.mover = this.terminal ? -1 : adapter.playerToMove(state)
    this.untried = this.terminal ? [] : adapter.legalMoves(state, curation)
  }
}

const zeros = (n: number): number[] => new Array(n).fill(0)

const selectEdge = <TState, TMove>(node: Node<TState, TMove>, c: number): Edge<TState, TMove> => {
  const logN = Math.log(node.n)
  let best: Edge<TState, TMove> | null = null
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

const rollout = <TState, TMove>(
  adapter: GameAdapter<TState, TMove>,
  state: TState,
  rng: Rng,
  depth: number
): number[] => {
  let s = state
  let d = 0
  while (!adapter.isTerminal(s) && d < depth) {
    const m = adapter.sampleMove(s, rng)
    if (m === undefined) break
    const next = adapter.apply(s, m)
    if (next === undefined) break
    s = next
    d++
  }
  // outcome() on a non-terminal state ranks by current score totals — the
  // score-margin cutoff that lets rollouts stay shallow.
  return adapter.outcome(s)
}

export type SearchResult<TMove> = {
  best: TMove | undefined
  // visit distribution over root moves (for a future policy target)
  visits: { move: TMove; n: number; q: number }[]
}

export const search = <TState, TMove>(
  adapter: GameAdapter<TState, TMove>,
  state: TState,
  rng: Rng,
  options: MctsOptions
): SearchResult<TMove> => {
  const c = options.c ?? DEFAULTS.c
  const rolloutDepth = options.rolloutDepth ?? DEFAULTS.rolloutDepth
  const curation = options.curation ?? DEFAULTS.curation
  const players = adapter.numPlayers(state)

  const root = new Node(adapter, state, curation)

  for (let i = 0; i < options.sims; i++) {
    let node = root
    const path: Edge<TState, TMove>[] = []
    const visited: Node<TState, TMove>[] = [root]

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
      const next = adapter.apply(node.state, move)
      // enumerated moves are legal, but guard anyway
      const child = new Node(adapter, next ?? node.state, curation)
      const edge: Edge<TState, TMove> = { move, child, n: 0, w: zeros(players) }
      node.edges.push(edge)
      path.push(edge)
      node = child
      visited.push(node)
    }

    // SIMULATE
    const value = node.terminal ? adapter.outcome(node.state) : rollout(adapter, node.state, rng, rolloutDepth)

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

  return { best: visits[0]?.move, visits }
}

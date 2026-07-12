import type { GameAdapter, Caps } from '../game/adapter'
import type { Policy } from '../policy'
import { choice } from '../rng'

// 1-ply greedy: play the move that most improves my own heuristic (score total).
// If NO legal move strictly improves my score, the turn has nothing left to
// gain, so restrict the choice to turn-ending moves. Ties broken randomly.
//
// Without the "must strictly improve, else end the turn" rule, greedy loops
// forever on value-neutral turn-keeping moves: e.g. penny↔nickel CONVERTs score
// identically under `goodsPoints`, and each ties the current best while COMMIT
// (which advances the game) scores *lower* in a myopic 1-ply view — so greedy
// keeps converting and never commits, and whether a game terminates depends on
// the rng. This keeps termination rng-independent and stays game-agnostic (it
// never names a command; it just watches `playerToMove`).
export const greedyPolicy = <TState, TMove>(
  adapter: GameAdapter<TState, TMove>,
  caps: Caps = { maxPerLevel: 12, maxMoves: 64 }
): Policy<TState, TMove> => ({
  name: 'greedy',
  pick: async (state, rng) => {
    const me = adapter.playerToMove(state)
    const current = adapter.heuristic?.(state)?.[me] ?? -Infinity
    const scored = adapter.legalMoves(state, caps).map((move) => {
      const next = adapter.apply(state, move)
      return { move, next, total: next ? (adapter.heuristic?.(next)?.[me] ?? -Infinity) : -Infinity }
    })
    if (scored.length === 0) return undefined

    const endsTurn = (s: (typeof scored)[number]): boolean =>
      s.next === undefined || adapter.isTerminal(s.next) || adapter.playerToMove(s.next) !== me
    const improving = scored.filter((s) => s.total > current)
    const endMoves = scored.filter(endsTurn)
    // Grab points if any move improves; otherwise end the turn (fall back to all
    // moves only if somehow no move ends it — should not happen mid-game).
    const pool = improving.length > 0 ? improving : endMoves.length > 0 ? endMoves : scored

    const best = Math.max(...pool.map((s) => s.total))
    return choice(
      rng,
      pool.filter((s) => s.total === best).map((s) => s.move)
    )
  },
})

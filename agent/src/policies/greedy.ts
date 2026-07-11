import type { GameAdapter, Caps } from '../game/adapter'
import type { Policy } from '../policy'
import { choice } from '../rng'

// 1-ply greedy: among (curated) legal moves, play the one that maximizes my own
// heuristic (score total) in the resulting state. Ties broken randomly. A weak
// but non-trivial baseline — it always grabs immediate points before COMMITting.
export const greedyPolicy = <TState, TMove>(
  adapter: GameAdapter<TState, TMove>,
  caps: Caps = { maxPerLevel: 12, maxMoves: 64 }
): Policy<TState, TMove> => ({
  name: 'greedy',
  pick: async (state, rng) => {
    const me = adapter.playerToMove(state)
    const scored = adapter.legalMoves(state, caps).map((move) => {
      const next = adapter.apply(state, move)
      return { move, total: next ? (adapter.heuristic?.(next)?.[me] ?? -Infinity) : -Infinity }
    })
    if (scored.length === 0) return undefined
    const best = Math.max(...scored.map((s) => s.total))
    return choice(
      rng,
      scored.filter((s) => s.total === best).map((s) => s.move)
    )
  },
})

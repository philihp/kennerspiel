import type { Policy } from '../policy'
import { apply, playerToMove, scores } from '../engine'
import { enumerateMoves, type EnumerateOpts } from '../moves'
import { choice } from '../rng'

// 1-ply greedy: among (curated) legal commands, play the one that maximizes my
// own score total in the resulting state. Ties broken randomly. A weak but
// non-trivial baseline — it always grabs immediate points before COMMITting.
export const greedyPolicy = (opts: EnumerateOpts = { maxPerLevel: 12, maxMoves: 64 }): Policy => ({
  name: 'greedy',
  pick: (state, rng) => {
    const me = playerToMove(state)
    const scored = enumerateMoves(state, opts).map((move) => {
      const next = apply(state, move)
      return { move, total: next ? (scores(next)[me]?.total ?? -Infinity) : -Infinity }
    })
    if (scored.length === 0) return undefined
    const best = Math.max(...scored.map((s) => s.total))
    return choice(
      rng,
      scored.filter((s) => s.total === best).map((s) => s.move)
    )
  },
})

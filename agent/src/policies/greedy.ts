import type { Policy } from '../policy'
import type { Move } from '../engine'
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
    const moves = enumerateMoves(state, opts)
    if (moves.length === 0) return undefined
    let best = -Infinity
    let bestMoves: Move[] = []
    for (const m of moves) {
      const next = apply(state, m)
      if (next === undefined) continue
      const total = scores(next)[me]?.total ?? -Infinity
      if (total > best) {
        best = total
        bestMoves = [m]
      } else if (total === best) {
        bestMoves.push(m)
      }
    }
    return bestMoves.length > 0 ? choice(rng, bestMoves) : undefined
  },
})

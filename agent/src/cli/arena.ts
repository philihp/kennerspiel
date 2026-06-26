// Head-to-head match between two policies.
//
//   pnpm arena [games] [short|long] [policyA] [policyB]
//
// policy spec: `random` | `greedy` | `mcts[:sims]`  (default mcts:64)
//   e.g. `pnpm arena 10 short mcts:64 random`
//        `pnpm arena 20 long greedy random`

import { runMatch, CONFIG_2P_LONG, CONFIG_2P_SHORT } from '../arena'
import type { Policy } from '../policy'
import { randomPolicy } from '../policies/random'
import { greedyPolicy } from '../policies/greedy'
import { mctsPolicy } from '../policies/mcts'

const parsePolicy = (spec: string): Policy => {
  if (spec === 'random') return randomPolicy()
  if (spec === 'greedy') return greedyPolicy()
  if (spec.startsWith('mcts')) {
    const sims = Number.parseInt(spec.split(':')[1] ?? '64', 10)
    return mctsPolicy({ sims })
  }
  throw new Error(`unknown policy: ${spec}`)
}

const games = Number.parseInt(process.argv[2] ?? '10', 10)
const cfg = process.argv[3] === 'long' ? CONFIG_2P_LONG : CONFIG_2P_SHORT
const a = parsePolicy(process.argv[4] ?? 'mcts:64')
const b = parsePolicy(process.argv[5] ?? 'random')

console.log(`Match: ${a.name} vs ${b.name} — ${games} games, 2p ${cfg.country} ${cfg.length}`)
const t0 = Date.now()
const r = runMatch(a, b, { games, cfg })
const secs = (Date.now() - t0) / 1000

console.log(
  `${r.a}: ${r.aWins}W  ${r.b}: ${r.bWins}W  draws: ${r.draws}\n` +
    `${r.a} win-rate: ${(r.aWinRate * 100).toFixed(1)}%  (~${r.eloDiff >= 0 ? '+' : ''}${r.eloDiff} Elo)\n` +
    `avg steps/game: ${r.avgSteps.toFixed(0)}  finished: ${(r.finishedRate * 100).toFixed(0)}%  (${secs.toFixed(1)}s)`
)

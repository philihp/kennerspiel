// Run a head-to-head match between two baseline policies.
//
//   pnpm arena [games] [short|long]
//
// e.g. `pnpm arena 20 short` plays greedy vs random over 20 short games.

import { runMatch, CONFIG_2P_LONG, CONFIG_2P_SHORT } from '../arena'
import { randomPolicy } from '../policies/random'
import { greedyPolicy } from '../policies/greedy'

const games = Number.parseInt(process.argv[2] ?? '10', 10)
const cfg = process.argv[3] === 'long' ? CONFIG_2P_LONG : CONFIG_2P_SHORT

const a = greedyPolicy()
const b = randomPolicy()

console.log(`Match: ${a.name} vs ${b.name} — ${games} games, 2p ${cfg.country} ${cfg.length}`)
const t0 = Date.now()
const r = runMatch(a, b, { games, cfg })
const secs = (Date.now() - t0) / 1000

console.log(
  `${r.a}: ${r.aWins}W  ${r.b}: ${r.bWins}W  draws: ${r.draws}\n` +
    `${r.a} win-rate: ${(r.aWinRate * 100).toFixed(1)}%  (~${r.eloDiff >= 0 ? '+' : ''}${r.eloDiff} Elo)\n` +
    `avg steps/game: ${r.avgSteps.toFixed(0)}  finished: ${(r.finishedRate * 100).toFixed(0)}%  (${secs.toFixed(1)}s)`
)

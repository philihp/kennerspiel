// Generate MCTS self-play games and append them as JSONL to selfplay-data/.
//
//   pnpm selfplay [games] [short|long] [sims]
//
// Each line is one game: { commands, decisions, outcome, finished, steps }.
// decisions carry the MCTS visit distribution (policy target) and the game's
// final outcome is the value target — the raw material for training later.

import { mkdirSync, appendFileSync } from 'node:fs'
import { range } from 'ramda'
import { selfPlayGame } from '../selfplay'
import { CONFIG_2P_LONG, CONFIG_2P_SHORT } from '../arena'
import { mulberry32 } from '../rng'

const games = Number.parseInt(process.argv[2] ?? '1', 10)
const cfg = process.argv[3] === 'long' ? CONFIG_2P_LONG : CONFIG_2P_SHORT
const sims = Number.parseInt(process.argv[4] ?? '64', 10)

const dir = 'selfplay-data'
mkdirSync(dir, { recursive: true })
const out = `${dir}/games-${cfg.length}-sims${sims}.jsonl`

console.log(`Self-play: ${games} games, 2p ${cfg.country} ${cfg.length}, mcts sims=${sims} → ${out}`)
range(0, games).forEach((g) => {
  const seed = 1000 + g
  const rng = mulberry32(seed * 7919 + 3)
  const t0 = Date.now()
  const game = selfPlayGame(cfg, seed, rng, { sims })
  appendFileSync(out, JSON.stringify(game) + '\n')
  console.log(
    `  game ${g + 1}/${games}: ${game.steps} moves, finished=${game.finished}, ` +
      `outcome=[${game.outcome.map((x) => x.toFixed(2)).join(', ')}] (${((Date.now() - t0) / 1000).toFixed(1)}s)`
  )
})

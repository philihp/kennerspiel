import type { Policy } from '../policy'
import { search, type MctsOptions } from '../mcts/search'

export const mctsPolicy = (options: MctsOptions): Policy => ({
  name: `mcts(${options.sims})`,
  pick: (state, rng) => search(state, rng, options).best,
})

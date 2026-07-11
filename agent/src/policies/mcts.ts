import type { GameAdapter } from '../game/adapter'
import type { Policy } from '../policy'
import { search, type MctsOptions } from '../mcts/search'

export const mctsPolicy = <TState, TMove>(
  adapter: GameAdapter<TState, TMove>,
  options: MctsOptions
): Policy<TState, TMove> => ({
  name: `mcts(${options.sims})`,
  pick: async (state, rng) => search(adapter, state, rng, options).best,
})

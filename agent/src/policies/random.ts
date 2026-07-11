import type { GameAdapter } from '../game/adapter'
import type { Policy } from '../policy'

// Uniform-ish random over the completion tree (cheap; no enumeration).
export const randomPolicy = <TState, TMove>(adapter: GameAdapter<TState, TMove>): Policy<TState, TMove> => ({
  name: 'random',
  pick: async (state, rng) => adapter.sampleMove(state, rng),
})

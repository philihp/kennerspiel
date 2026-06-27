import type { Policy } from '../policy'
import { sampleMove } from '../moves'

// Uniform-ish random over the completion tree (cheap; no enumeration).
export const randomPolicy = (): Policy => ({
  name: 'random',
  pick: (state, rng) => sampleMove(state, rng),
})

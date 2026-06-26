// Single import surface for the Ora et Labora engine.
//
// We import the game from its TypeScript *source* (../../game/src) rather than
// the published `hathora-et-labora-game` dist, because the built dist uses
// extensionless relative ESM imports that only a bundler (Next.js/web) can
// resolve — native Node/tsx cannot. tsx transpiles the source directly, and the
// game's transitive deps (ramda, pcg, …) resolve from ../game/node_modules.
//
// The `file:../game` dependency in package.json exists to install those
// transitive deps; the actual imports below bypass dist on purpose.

export { reducer } from '../../game/src/reducer'
export { control } from '../../game/src/control'
export { initialState } from '../../game/src/state'
export { encode, featureSpec, FEATURE_LEN } from '../../game/src/encode'

export {
  GameStatusEnum,
  GameCommandEnum,
  PlayerColor,
} from '../../game/src/types'

export type {
  GameState,
  Controls,
  Score,
  Tableau,
  Frame,
  Rondel,
  GameConfigCountry,
  GameConfigLength,
  GameConfigPlayers,
} from '../../game/src/types'

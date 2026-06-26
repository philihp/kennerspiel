// Single import surface for the Ora et Labora engine.
//
// `agent` depends on `game` via the pnpm `workspace:` protocol and imports it
// by its package name. tsconfig `paths` resolves that name to the game's
// TypeScript source (see agent/tsconfig.json for why), so there are no
// cross-folder relative imports and no build step.

export {
  reducer,
  control,
  initialState,
  encode,
  featureSpec,
  FEATURE_LEN,
  GameStatusEnum,
  GameCommandEnum,
  PlayerColor,
} from 'hathora-et-labora-game'

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
} from 'hathora-et-labora-game'

import { getCost, withEachPlayer } from '../player'

export const standardResources = withEachPlayer(getCost({ clay: 1, wood: 1, peat: 1, penny: 1, grain: 1, sheep: 1 }))

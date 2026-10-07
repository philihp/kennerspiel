import { GameCommandConfigParams, Score, Tableau } from 'hathora-et-labora-game'
import { roundBuildings } from 'hathora-et-labora-game/dist/board/buildings'
import { BuildingEnum, Frame, SettlementRound, Tile } from 'hathora-et-labora-game/dist/types'
import { addIndex, any, chain, includes, map, sortBy, union } from 'ramda'

// In a 2-player game there is no fixed last round. After the D buildings come
// out, the game ends when the display of unbuilt buildings gets down to this
// many (see nextFrame2Long and nextFrame2Short in the game package).
export const endGameThreshold = ({ length }: GameCommandConfigParams): number => (length === 'long' ? 3 : 1)

// The engine ends a 2-player game by moving the frame to a terminal step. These
// are the step numbers of those terminal frames, from nextFrame2Long (100) and
// nextFrame2Short (999).
const END_FRAME_LONG = 100
const END_FRAME_SHORT = 999

const erections = (landscape: Tile[][]): BuildingEnum[] =>
  chain(
    (row: Tile[]) => chain((tile: Tile) => (tile[1] === undefined ? [] : [tile[1] as BuildingEnum]), row),
    landscape
  )

// True once the settlement D buildings are in play, either still unbuilt or on
// somebody's landscape. The frame keeps settlementRound at D from the D
// settlement onward, but the buildings only come out a frame later, so look
// for the buildings themselves.
export const dBuildingsOut = (
  config: GameCommandConfigParams,
  buildings: BuildingEnum[],
  players: Tableau[]
): boolean => {
  const inPlay = union(
    buildings,
    chain((player: Tableau) => erections(player.landscape), players)
  )
  return any((building: BuildingEnum) => includes(building, inPlay), roundBuildings(config, SettlementRound.D))
}

export type EndGamePhase = {
  threshold: number
  unbuilt: number
  // the engine has already decided the game ends at the end of this round
  lastRound: boolean
}

// What to show next to the unbuilt buildings in a 2-player game once the end
// game can begin. Undefined for every other player count, and before the D
// buildings are out.
export const endGamePhase = (
  config: GameCommandConfigParams,
  frame: Frame,
  buildings: BuildingEnum[],
  players: Tableau[]
): EndGamePhase | undefined => {
  if (config.players !== 2) return undefined
  if (!dBuildingsOut(config, buildings, players)) return undefined
  const endFrame = config.length === 'long' ? END_FRAME_LONG : END_FRAME_SHORT
  return {
    threshold: endGameThreshold(config),
    unbuilt: buildings.length,
    lastRound: frame.next === endFrame,
  }
}

export type Ranked = {
  player: Tableau
  score: Score
  rank: number
}

// Pair each player with their score, highest total first. Players on the same
// total share a rank, so a tie for first shows two winners.
export const rankScores = (players: Tableau[], scores: Score[]): Ranked[] => {
  const paired = addIndex<Tableau, { player: Tableau; score: Score }>(map)(
    (player, i) => ({ player, score: scores[i] }),
    players.slice(0, scores.length)
  )
  const ordered = sortBy(({ score }) => -score.total, paired)
  return addIndex<{ player: Tableau; score: Score }, Ranked>(map)(
    (entry, i) => ({
      ...entry,
      rank: ordered.findIndex(({ score }) => score.total === entry.score.total) + 1,
    }),
    ordered
  )
}

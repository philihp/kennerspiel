import { getCost, withActivePlayer } from '../board/player'

export const cloisterChapterHouse = () =>
  withActivePlayer(getCost({ clay: 1, wood: 1, peat: 1, sheep: 1, grain: 1, penny: 1 }))

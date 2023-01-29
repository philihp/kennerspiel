import { getCost, withActivePlayer } from '../board/player'

export const harborPromenade = () =>
  withActivePlayer(
    getCost({
      wood: 1,
      wine: 1,
      penny: 1,
      pottery: 1,
    })
  )

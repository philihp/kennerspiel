import { Rondel } from '../types'

export const pushArm = (rondel: Rondel, players: number): Rondel => {
  const next = rondel.pointingBefore + (1 % 13)
  const bumper = (from?: number) => {
    if (from === next) {
      if (players === 1) return undefined
      return (from + 1) % 13
    }
    return from
  }
  return {
    ...rondel,
    pointingBefore: next,
    grain: bumper(rondel.grain),
    sheep: bumper(rondel.sheep),
    clay: bumper(rondel.clay),
    coin: bumper(rondel.coin),
    wood: bumper(rondel.wood),
    joker: bumper(rondel.joker),
    peat: bumper(rondel.peat),
    grape: bumper(rondel.grape),
    stone: bumper(rondel.stone),
  }
}

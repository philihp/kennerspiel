import { withRondel } from '../rondel'

export const pushArm = (expireAfterTen = false) =>
  withRondel((rondel) => {
    if (rondel === undefined) return undefined
    const next = rondel.pointingBefore + (1 % 13)
    const bumper = (from?: number) => {
      if (from === next) {
        if (expireAfterTen) return undefined
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
  })

export const rotateRondel = pushArm(false)
export const rotateRondelWithExpire = pushArm(true)

import { GameStatePlaying, Rondel } from '../types'

type TokenName = 'grain' | 'sheep' | 'clay' | 'coin' | 'wood' | 'joker' | 'peat' | 'grape' | 'stone'

export const withRondel =
  (func: (rondel: Rondel | undefined) => Rondel | undefined) =>
  (state: GameStatePlaying | undefined): GameStatePlaying | undefined => {
    if (state === undefined) return state
    const updatedRondel = func(state.rondel)
    if (updatedRondel === undefined) return undefined
    return {
      ...state,
      rondel: updatedRondel,
    }
  }

export const updateRondel =
  (token: TokenName) =>
  (rondel: Rondel | undefined): Rondel | undefined =>
    rondel && {
      ...rondel,
      [token]: rondel[token] !== undefined ? rondel.pointingBefore : rondel[token],
    }

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

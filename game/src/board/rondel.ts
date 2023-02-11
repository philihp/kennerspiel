import { GameStatePlaying, Rondel } from '../types'

type TokenName = 'grain' | 'sheep' | 'clay' | 'coin' | 'wood' | 'joker' | 'peat' | 'grape' | 'stone'

export const withRondel =
  (func: (rondel: Rondel | undefined) => Rondel | undefined) =>
  (state: GameStatePlaying | undefined): GameStatePlaying | undefined => {
    if (state === undefined) return state
    const rondel = func(state.rondel)
    if (rondel === undefined) return undefined
    return {
      ...state,
      rondel,
    }
  }

export const updateRondel =
  (token: TokenName) =>
  (rondel: Rondel | undefined): Rondel | undefined =>
    rondel && {
      ...rondel,
      [token]: rondel[token] !== undefined ? rondel.pointingBefore : rondel[token],
    }

export const introduceToken = (token: 'grape' | 'stone') =>
  withRondel((rondel) => {
    if (rondel === undefined) return undefined
    return {
      [token]: rondel?.pointingBefore,
    } as Rondel
  })
export const introduceGrapeToken = introduceToken('grape')
export const introduceStoneToken = introduceToken('stone')

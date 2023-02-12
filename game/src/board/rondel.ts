import { GameStatePlaying, Rondel, GameCommandConfigParams } from '../types'

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

export const armValues = ({ length, players }: GameCommandConfigParams) => {
  if (players === 2 && length === 'short') {
    return [0, 1, 2, 2, 3, 4, 4, 5, 6, 6, 7, 8, 10]
  }
  return [0, 2, 3, 4, 5, 6, 6, 7, 7, 8, 8, 9, 10]
}

export const take = (armIndex: number, tokenIndex: number, config: GameCommandConfigParams): number => {
  const armVals = armValues(config)
  return armVals[(armIndex - tokenIndex + armVals.length) % armVals.length]
}

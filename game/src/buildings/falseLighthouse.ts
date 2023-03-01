import { xor } from 'ramda'
import { getCost, withActivePlayer } from '../board/player'
import { parseResourceParam } from '../board/resource'
import { StateReducer } from '../types'

export const falseLighthouse = (param = ''): StateReducer => {
  const { whiskey = 0, beer = 0 } = parseResourceParam(param)
  if (!xor(whiskey === 1, beer === 1)) return () => undefined
  return withActivePlayer(
    getCost({
      penny: 3,
      whiskey,
      beer,
    })
  )
}

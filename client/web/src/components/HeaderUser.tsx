import { Color } from '../../../../api/types'
import { useHathoraContext } from '../context/GameContext'

const colorToName = (c?: Color): string => {
  switch (c) {
    case Color.Blue:
      return 'blue'
    case Color.Red:
      return 'red'
    case Color.Green:
      return 'green'
    case Color.White:
      return 'white'
    default:
      return 'unknown'
  }
}

type ColorStyle = {
  backgroundColor?: string
  borderColor?: string
}

const colorToStyle = (c?: Color): ColorStyle => {
  switch (c) {
    case Color.Blue:
      return { backgroundColor: '#80b1d3', borderColor: '#5f849e' }
    case Color.Red:
      return { backgroundColor: '#fb8072', borderColor: '#ad574d' }
    case Color.Green:
      return { backgroundColor: '#b3de69', borderColor: '#87a74f' }
    case Color.White:
      return { backgroundColor: '#d9d9d9', borderColor: '#b1b1b1' }
    default:
      return {}
  }
}

export const HeaderUser = () => {
  const { user, getUserName, state } = useHathoraContext()
  return (
    <div
      style={
        state?.active
          ? {
              backgroundColor: '#fdb462',
            }
          : {}
      }
    >
      {/* <button type="button" onClick={login}>
        Login
      </button> */}
      {user && (
        <>
          {state?.me?.color !== undefined && (
            <span style={colorToStyle(state?.me?.color)}>({colorToName(state?.me?.color)})</span>
          )}
          {getUserName(user?.id)}
        </>
      )}
    </div>
  )
}

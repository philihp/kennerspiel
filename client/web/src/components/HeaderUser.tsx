import { Color } from '../../../../api/types'
import { useHathoraContext } from '../context/GameContext'

type ColorStyle = {
  backgroundColor?: string
  borderColor?: string
}

const colorToStyle = (c?: Color): ColorStyle => {
  switch (c) {
    case Color.Blue:
      return { borderColor: '#80b1d3' } // , borderColor: '#5f849e' }
    case Color.Red:
      return { borderColor: '#fb8072' } // , borderColor: '#ad574d' }
    case Color.Green:
      return { borderColor: '#b3de69' } // , borderColor: '#87a74f' }
    case Color.White:
      return { borderColor: '#d9d9d9' } // , borderColor: '#b1b1b1' }
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
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <img
            src={user.picture}
            height="32"
            width="32"
            alt={user.name}
            style={{ ...colorToStyle(state?.me?.color), borderRadius: 16, borderWidth: 4, borderStyle: 'solid' }}
          />
          <div style={{ display: 'flex' }}>{getUserName(user?.id)}</div>
        </div>
      )}
    </div>
  )
}

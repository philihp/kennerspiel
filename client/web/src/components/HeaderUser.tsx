import { useHathoraContext } from '../context/GameContext'

export const HeaderUser = () => {
  const { user, login, getUserName, state } = useHathoraContext()
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
      <button type="button" onClick={login}>
        Login
      </button>
      {user && <span>{getUserName(user?.id)}</span>}
    </div>
  )
}

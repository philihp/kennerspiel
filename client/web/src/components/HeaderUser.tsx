import { useHathoraContext } from '../context/GameContext'

export const HeaderUser = () => {
  const { user, login } = useHathoraContext()
  return (
    <div>
      {!user && (
        <button type="button" onClick={login}>
          Login
        </button>
      )}
      {user && <span>username: {user?.name}</span>}
    </div>
  )
}

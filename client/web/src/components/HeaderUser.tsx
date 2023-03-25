import { useHathoraContext } from '../context/GameContext'

export const HeaderUser = () => {
  const { user, login, getUserName } = useHathoraContext()
  return (
    <div>
      {!user && (
        <button type="button" onClick={login}>
          Login
        </button>
      )}
      {user && <span>{getUserName(user?.id)}</span>}
    </div>
  )
}

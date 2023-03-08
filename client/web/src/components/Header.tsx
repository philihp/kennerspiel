import { useHathoraContext } from '../context/GameContext'

export const Header = () => {
  const { user, login } = useHathoraContext()
  return (
    <div>
      <button type="button" onClick={login}>
        Login
      </button>
      <span>{user?.name}</span>
    </div>
  )
}

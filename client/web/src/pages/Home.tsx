import { useNavigate } from 'react-router-dom'
import { useHathoraContext } from '../context/GameContext'
import { HeaderUser } from '../components/HeaderUser'
import { useAutoLogin } from '../hooks/useAutoLogin'

const Home = () => {
  const navigate = useNavigate()
  const { createGame } = useHathoraContext()
  useAutoLogin()

  return (
    <>
      <HeaderUser />
      <h1>Hathora et Labora</h1>
      <p>
        <button
          type="button"
          onClick={async () => {
            const stateId = await createGame()
            navigate(`/game/${stateId}`)
          }}
        >
          Create Game
        </button>
      </p>
    </>
  )
}

export default Home

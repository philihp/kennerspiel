import { useNavigate } from 'react-router-dom'
import { useHathoraContext } from '../context/GameContext'
import { HeaderUser } from '../components/HeaderUser'

const Home = () => {
  const navigate = useNavigate()
  const { createPrivateLobby, createPublicLobby, getPublicLobbies, user } = useHathoraContext()

  return (
    <>
      <HeaderUser />
      <h1>Hathora et Labora</h1>
      <p>
        <button
          disabled={!user}
          type="button"
          onClick={async () => {
            const stateId = await createPrivateLobby()
            navigate(`/game/${stateId}`)
          }}
        >
          Create Private Game
        </button>
      </p>
      <p>
        <button
          disabled={!user}
          type="button"
          onClick={async () => {
            const stateId = await createPublicLobby()
            navigate(`/game/${stateId}`)
          }}
        >
          Create Public Game
        </button>
      </p>
      {JSON.stringify(getPublicLobbies())}
    </>
  )
}

export default Home

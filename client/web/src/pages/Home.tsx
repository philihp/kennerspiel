import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

import { useHathoraContext } from '../context/GameContext'

const Home = () => {
  const navigate = useNavigate()
  const { user, connect, createGame, login } = useHathoraContext()
  const [gameId, setGameId] = useState<string>()

  return (
    <>
      <h1>Hathora et Labora</h1>
      <p>
        <button
          type="button"
          onClick={async () => {
            const stateId = await login()
          }}
        >
          Login
        </button>
      </p>
      <pre>{JSON.stringify(user)}</pre>
      <p>
        <input onChange={(e) => setGameId(e.target.value)} placeholder="Room code" />
        <button
          type="button"
          onClick={() => {
            navigate(`/game/${gameId}`)
          }}
        >
          Join Existing Game
        </button>
      </p>
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

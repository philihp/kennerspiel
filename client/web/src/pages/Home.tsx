import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useHathoraContext } from '../context/GameContext'
import { HeaderUser } from '../components/HeaderUser'
import { HathoraClient } from '../../../.hathora/client'

const Home = () => {
  const navigate = useNavigate()
  const { createPrivateLobby, createPublicLobby, getPublicLobbies, user } = useHathoraContext()

  const [lobbies, setLobbies] = useState<Awaited<ReturnType<HathoraClient['getPublicLobbies']>>>([])
  useEffect(() => {
    getPublicLobbies().then((lobbyInfo) => {
      setLobbies(lobbyInfo)
    })
  }, [setLobbies, getPublicLobbies])

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
          New Private Lobby
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
          New Public Lobby
        </button>
      </p>
      {lobbies.length > 0 && (
        <>
          <h3>Debug (please ignore):</h3>
          <pre>{JSON.stringify(lobbies, undefined, 2)}</pre>
        </>
      )}
    </>
  )
}

export default Home

import { useNavigate } from 'react-router-dom'
import { ReactNode, useEffect, useState } from 'react'
import { useHathoraContext } from '../context/GameContext'
import { HeaderUser } from '../components/HeaderUser'
import { HathoraClient } from '../../../.hathora/client'

const getBuildMessage = (): ReactNode => {
  if (process.env.VERCEL_GIT_COMMIT_SHA === undefined) return null
  const fullHash = process.env.VERCEL_GIT_COMMIT_SHA
  const shortHash = fullHash.slice(fullHash.length - 7)
  return (
    <>
      Made with &heart; in San Francisco, running on <a href="https://hathora.dev">Hathora</a>, built from{' '}
      <a href={`https://github.com/philihp/hathora-et-labora/commit/${fullHash}`}>{shortHash}</a>, playing{' '}
      <a href="https://amzn.to/3QdnouS">Ora et Labora</a> by <a href="http://lookout-spiele.de">Lookout Games</a>.
    </>
  )
}

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
      <hr />
      {getBuildMessage()}
    </>
  )
}

export default Home

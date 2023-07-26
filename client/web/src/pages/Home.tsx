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
        <h3>Public Servers</h3>
        <table border={1} cellPadding={3} cellSpacing={0}>
          <thead>
            <tr>
              <th>Room Code</th>
              <th>Region</th>
              <th colSpan={3}>Details</th>
            </tr>
          </thead>
          <tbody>
            {lobbies &&
              lobbies.map((lobby) => {
                const { roomId } = lobby
                const { region } = lobby
                const state = (lobby as unknown as { state: { players?: number; country?: string } })?.state
                return (
                  <tr>
                    <td>{roomId}</td>
                    <td>{region}</td>
                    <td>
                      {state?.players} players
                      <br />
                      {state?.country}
                    </td>
                    <td>{!state?.players && !state?.country && JSON.stringify({ state })}</td>
                    <td>
                      <button
                        type="button"
                        onClick={async () => {
                          navigate(`/game/${roomId}`)
                        }}
                      >
                        Join
                      </button>
                    </td>
                  </tr>
                )
              })}
          </tbody>
        </table>
        <button
          disabled={!user}
          type="button"
          onClick={async () => {
            const roomId = await createPublicLobby()
            navigate(`/game/${roomId}`)
          }}
        >
          Create Public Server
        </button>
      </p>
      <p>
        <h3>Private Servers</h3>
        <button
          disabled={!user}
          type="button"
          onClick={async () => {
            const roomId = await createPrivateLobby()
            navigate(`/game/${roomId}`)
          }}
        >
          Create Private Lobby
        </button>
      </p>
      <hr />
      {getBuildMessage()}
      <pre>{JSON.stringify(process.env, undefined, 2)}</pre>
    </>
  )
}

export default Home

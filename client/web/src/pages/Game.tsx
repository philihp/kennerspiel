import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { useHathoraContext } from '../context/GameContext'

const Game = () => {
  const { gameId } = useParams()
  const { engineState, token, user, login, connect, connecting } = useHathoraContext()

  useEffect(() => {
    if (!token) {
      login()
    }
    if (token && gameId) {
      connect(gameId)
    }
  }, [gameId, token, connect, login])

  if (connecting || !token) {
    return <div role="status">connecting...</div>
  }
  return (
    <>
      <pre>USE: {JSON.stringify(user)}</pre>
      <pre>STATE: {JSON.stringify(engineState, undefined, 2)}</pre>
    </>
  )
}

export default Game

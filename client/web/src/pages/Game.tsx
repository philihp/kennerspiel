import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { useHathoraContext } from '../context/GameContext'

const Game = () => {
  const { gameId } = useParams()
  const { user, loading, error, engineState, token, login, connect } = useHathoraContext()

  useEffect(() => {
    if (!token) {
      login()
    }
  }, [token, login])

  useEffect(() => {
    if (token && gameId) {
      connect(gameId)
    }
  }, [gameId, token, connect])

  return (
    <>
      <pre>{JSON.stringify({ token, user, loading, error }, undefined, 2)}</pre>
      <pre>STATE: {JSON.stringify(engineState, undefined, 2)}</pre>
    </>
  )
}

export default Game

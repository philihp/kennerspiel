import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

import { useHathoraContext } from '../context/GameContext'

const Home = () => {
  const navigate = useNavigate()
  const { token, user, connecting, connectionError, createGame, login } = useHathoraContext()

  return (
    <>
      <pre>{JSON.stringify({ token, user, connecting, connectionError }, undefined, 2)}</pre>
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

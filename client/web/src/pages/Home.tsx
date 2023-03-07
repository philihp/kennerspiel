import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

import { useHathoraContext } from '../context/GameContext'

const Home = () => {
  const navigate = useNavigate()
  const { token, user, createGame, login } = useHathoraContext()

  return (
    <>
      <pre>{JSON.stringify({ token, user }, undefined, 2)}</pre>
      <h1>Hathora et Labora</h1>
      <p>
        <button
          type="button"
          onClick={async () => {
            await login()
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

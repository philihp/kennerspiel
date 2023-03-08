import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

import { useHathoraContext } from '../context/GameContext'
import { Header } from '../components/Header'

const Home = () => {
  const navigate = useNavigate()
<<<<<<< Updated upstream
  const { token, user, connecting, connectionError, createGame, login } = useHathoraContext()

  return (
    <>
      <pre>{JSON.stringify({ token, user, connecting, connectionError }, undefined, 2)}</pre>
=======
  const { createGame, login } = useHathoraContext()

  return (
    <>
      <Header />
>>>>>>> Stashed changes
      <h1>Hathora et Labora</h1>
      <p>
        <button
          type="button"
          onClick={async () => {
<<<<<<< Updated upstream
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
=======
>>>>>>> Stashed changes
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

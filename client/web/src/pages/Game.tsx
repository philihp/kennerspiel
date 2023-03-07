import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Color, Country, Length } from '../../../../api/types'

import { useHathoraContext } from '../context/GameContext'

const Game = () => {
  const { gameId } = useParams()
  const { user, loading, error, state, token, login, connect, join, config, start, move } = useHathoraContext()
  const [command, setCommand] = useState<string>('')

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

  const handleSubmit = () => {
    move(command)
    setCommand('')
  }

  return (
    <>
      <pre>{JSON.stringify({ token, user, loading, error }, undefined, 2)}</pre>
      <>
        Join
        <button type="button" onClick={() => join(Color.Red)}>
          R
        </button>
        <button type="button" onClick={() => join(Color.Green)}>
          G
        </button>
        <button type="button" onClick={() => join(Color.Blue)}>
          B
        </button>
        <button type="button" onClick={() => join(Color.White)}>
          W
        </button>
        | Config
        <button type="button" onClick={() => config(Country.france, Length.long)}>
          France Long
        </button>
        <button type="button" onClick={() => config(Country.france, Length.short)}>
          France Short
        </button>
        <button type="button" disabled>
          Ireland Long
        </button>
        <button type="button" disabled>
          Ireland Long
        </button>
        |
        <button type="button" onClick={() => start()}>
          Start
        </button>
        |
        <input type="text" placeholder="command" onChange={(e) => setCommand(e.target.value)} />
        <button type="button" onClick={handleSubmit}>
          Submit
        </button>
      </>
      <pre>STATE: {JSON.stringify(state, undefined, 2)}</pre>
    </>
  )
}

export default Game

import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
<<<<<<< Updated upstream
=======
import { Color, Country, EngineStatus, Length } from '../../../../api/types'
import { Header } from '../components/Header'
import { Loading } from '../components/Loading'
import { Player } from '../components/Player'
import { StatePlaying } from '../components/StatePlaying'
import { StateSetup } from '../components/StateSetup'
>>>>>>> Stashed changes

import { useHathoraContext } from '../context/GameContext'

const Game = () => {
  const { gameId } = useParams()
<<<<<<< Updated upstream
  const { user, loading, error, engineState, token, login, connect } = useHathoraContext()
=======
  const { state, loading, token, login, connect } = useHathoraContext()
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
      <pre>{JSON.stringify({ token, user, loading, error }, undefined, 2)}</pre>
      <pre>STATE: {JSON.stringify(engineState, undefined, 2)}</pre>
=======
      <Header />
      <hr />
      {loading && <Loading />}
      {state?.status === EngineStatus.SETUP && <StateSetup />}
      {state?.status === EngineStatus.PLAYING && <StatePlaying />}
>>>>>>> Stashed changes
    </>
  )
}

export default Game

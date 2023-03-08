import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Header } from '../components/Header'
import { Loading } from '../components/Loading'
import { Player } from '../components/Player'
import { StatePlaying } from '../components/StatePlaying'
import { StateSetup } from '../components/StateSetup'
import { Color, Country, EngineStatus, Length } from '../../../../api/types'

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

  return (
    <>
      <Header />
      <hr />
      {loading && <Loading />}
      {state?.status === EngineStatus.SETUP && <StateSetup />}
      {state?.status === EngineStatus.PLAYING && <StatePlaying />}
    </>
  )
}

export default Game

import { useParams } from 'react-router-dom'
import { HeaderUser } from '../components/HeaderUser'
import { Loading } from '../components/Loading'
import { StatePlaying } from '../components/StatePlaying'
import { StateSetup } from '../components/StateSetup'
import { EngineStatus } from '../../../../api/types'

import { useHathoraContext } from '../context/GameContext'
import { useAutoLogin } from '../hooks/useAutoLogin'
import { useAutoConnect } from '../hooks/useAutoConnect'

const Game = () => {
  const { gameId } = useParams()
  const { connecting, state } = useHathoraContext()
  useAutoLogin()
  useAutoConnect(gameId)

  return (
    <>
      <HeaderUser />
      {connecting && <Loading />}
      {state?.status === EngineStatus.SETUP && <StateSetup />}
      {state?.status === EngineStatus.PLAYING && <StatePlaying />}
    </>
  )
}

export default Game

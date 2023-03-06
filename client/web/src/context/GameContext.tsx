import { ToastContainer, toast } from 'react-toastify'
import { createContext, ReactNode, useCallback, useContext, useRef, useState } from 'react'

import { HathoraClient, HathoraConnection } from '../../../.hathora/client'
import { EngineState, IInitializeRequest } from '../../../../api/types'
import { UserData } from '../../../../api/base'
import { ConnectionFailure } from '../../../.hathora/failures'

interface GameContext {
  token?: string
  engineState?: EngineState
  user?: UserData
  connecting?: boolean
  connectionError?: ConnectionFailure
  login: () => Promise<string>
  connect: (gameId: string) => Promise<HathoraConnection>
  createGame: () => Promise<string>
}

interface HathoraContextProviderProps {
  children: ReactNode | ReactNode[]
}
const client = new HathoraClient()

const HathoraContext = createContext<GameContext | null>(null)

export const HathoraContextProvider = ({ children }: HathoraContextProviderProps) => {
  const [token, setToken] = useState<string | undefined>(localStorage.getItem('token') || '')
  const [engineState, setEngineState] = useState<EngineState>()
  const [user, setUserInfo] = useState<UserData>()
  const [connecting, setConnecting] = useState<boolean>()
  const [connection, setConnection] = useState<HathoraConnection>()
  const [connectionError, setConnectionError] = useState<ConnectionFailure>()

  console.log({ token })

  const login = useCallback(async (): Promise<string> => {
    console.log('login...')
    const token = await client.loginAnonymous()
    localStorage.setItem('token', token)
    setToken(token)
    const user = HathoraClient.getUserFromToken(token)
    setUserInfo(user)
    console.log('login done!')
    return token
  }, [])

  const createGame = useCallback(async (): Promise<string> => {
    console.log('createGame')
    if (token) {
      return client.create(token, IInitializeRequest.default())
    }
    const token = await login()!
    return client.create(token!, IInitializeRequest.default())
  }, [token])
  // {
  //   new Promise<string>((fulfill, _reject) => {
  //   setTimeout(() => {
  //     fulfill("ok")
  //   }, 500)
  // }
  // ),
  // [])

  const connect = useCallback(
    async (stateId: string) => {
      console.log('connect...')
      setConnecting(true)
      let currentToken = token
      if (!currentToken) {
        currentToken = await login()
      }
      const connection = await client.connect(
        currentToken,
        stateId,
        ({ state }) => setEngineState(state),
        setConnectionError
      )
      setConnection(connection)
      setConnecting(false)
      return connection
    },
    [token, login]
  )

  return (
    <HathoraContext.Provider
      value={{
        token,
        engineState,
        user,
        login,
        connect,
        createGame,
      }}
    >
      {children}
      <ToastContainer
        autoClose={1000}
        limit={3}
        newestOnTop
        position="top-center"
        pauseOnFocusLoss={false}
        hideProgressBar
      />
    </HathoraContext.Provider>
  )
}

export function useHathoraContext() {
  const context = useContext(HathoraContext)
  if (!context) {
    throw new Error('Component must be within the HathoraContext')
  }
  return context
}

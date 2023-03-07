import { ToastContainer } from 'react-toastify'
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

import { HathoraClient, HathoraConnection } from '../../../.hathora/client'
import { EngineState, IInitializeRequest } from '../../../../api/types'
import { UserData } from '../../../../api/base'
import { ConnectionFailure } from '../../../.hathora/failures'

interface GameContext {
  token?: string
  engineState?: EngineState
  user?: UserData
  loading?: boolean
  error?: ConnectionFailure
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
  const [loading, setLoading] = useState<boolean>(false)
  const [connection, setConnection] = useState<HathoraConnection>()
  const [error, setError] = useState<ConnectionFailure>()

  // if we have a stored token, immediately use that to load things
  useEffect(() => {
    if (!token) return
    const user = HathoraClient.getUserFromToken(token)
    setUserInfo(user)
  }, [token])

  const login = useCallback(async (): Promise<string> => {
    const token = await client.loginAnonymous()
    localStorage.setItem('token', token)
    setToken(token)
    const user = HathoraClient.getUserFromToken(token)
    setUserInfo(user)
    return token
  }, [])

  const createGame = useCallback(async (): Promise<string> => {
    let currentToken = token
    if (currentToken) {
      return client.create(currentToken, IInitializeRequest.default())
    }
    currentToken = await login()
    return client.create(currentToken, IInitializeRequest.default())
  }, [token, login])

  const connect = useCallback(
    async (stateId: string) => {
      setLoading(true)
      if (!token) throw new Error('Unable to connect, no token')
      const connection = await client.connect(
        token,
        stateId,
        ({ state }) => setEngineState(state),
        (error) => {
          setLoading(false)
          return setError(error)
        }
      )
      setConnection(connection)
      setLoading(false)
      return connection
    },
    [token, setLoading]
  )

  const exported = useMemo(
    () => ({
      token,
      engineState,
      user,
      loading,
      error,
      login,
      connect,
      createGame,
    }),
    [token, engineState, user, loading, error, login, connect, createGame]
  )

  return (
    <HathoraContext.Provider value={exported}>
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

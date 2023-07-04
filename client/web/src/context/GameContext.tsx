import { ToastContainer } from 'react-toastify'
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

import { CredentialResponse } from '@react-oauth/google'
import { HathoraClient, HathoraConnection } from '../../../.hathora/client'
import { EngineColor, EngineCountry, EngineState, EngineLength, EngineUser } from '../../../../api/types'
import { GoogleUserData, UserData } from '../../../../api/base'
import { ConnectionFailure } from '../../../.hathora/failures'

interface GameContext {
  token?: string
  state?: EngineState
  user?: UserData
  connecting?: boolean
  error?: ConnectionFailure
  login: (cred: CredentialResponse) => void
  connect: (gameId: string) => Promise<HathoraConnection | undefined>
  disconnect: () => void
  createPublicLobby: () => ReturnType<HathoraClient['createPublicLobby']>
  createPrivateLobby: () => ReturnType<HathoraClient['createPrivateLobby']>
  getPublicLobbies: () => ReturnType<HathoraClient['getPublicLobbies']>
  join: (color: EngineColor) => Promise<void>
  config: (country: EngineCountry, length: EngineLength) => Promise<void>
  start: () => Promise<void>
  move: (command: string) => Promise<void>
  control: (partial: string) => Promise<void>
  undo: () => Promise<void>
  redo: () => Promise<void>
  endGame: () => Promise<void>
  getUser: (userId: string) => EngineUser | undefined
}

interface HathoraContextProviderProps {
  children: ReactNode | ReactNode[]
}
const client = new HathoraClient()

const HathoraContext = createContext<GameContext | null>(null)

export const HathoraContextProvider = ({ children }: HathoraContextProviderProps) => {
  const [token, setToken] = useState<string | undefined>(localStorage.getItem('token') || undefined)
  const [state, setEngineState] = useState<EngineState>()
  const [user, setUser] = useState<GoogleUserData>()
  const [connection, setConnection] = useState<HathoraConnection>()
  const [error, setError] = useState<ConnectionFailure>()
  const [connecting, setConnecting] = useState<boolean>()

  // if we have a stored token, immediately use that to load things
  useEffect(() => {
    if (token === undefined) return
    setUser(HathoraClient.getUserFromToken(token) as GoogleUserData)
  }, [token, setUser])

  const login = useCallback(async (cred: CredentialResponse) => {
    if (cred.credential === undefined) return
    const token = await client.loginGoogle(cred.credential)
    if (!token) return
    const user = HathoraClient.getUserFromToken(token) as GoogleUserData
    setUser(user)
    setToken(token)
    localStorage.setItem('token', token)
  }, [])

  const connect = useCallback(
    async (stateId: string): Promise<HathoraConnection | undefined> => {
      if (!token) {
        console.log('connect with no token, returning')
        return undefined
      }
      setConnecting(true)
      const connection = await client.connect(token, stateId, ({ state }) => setEngineState(state), setError)
      setConnection(connection)
      setConnecting(false)
      return connection
    },
    [token]
  )

  const disconnect = useCallback(() => {
    if (connection === undefined) return
    connection.disconnect()
    setConnection(undefined)
    setEngineState(undefined)
    setError(undefined)
  }, [connection])

  const createPublicLobby = useCallback(async (): ReturnType<HathoraClient['createPublicLobby']> => {
    if (!token) return ''
    return client.createPublicLobby(token)
  }, [token])

  const createPrivateLobby = useCallback(async (): ReturnType<HathoraClient['createPrivateLobby']> => {
    if (!token) return ''
    const lobby = await client.createPrivateLobby(token)
    return lobby
  }, [token])

  const getPublicLobbies = useCallback(async (): ReturnType<HathoraClient['getPublicLobbies']> => {
    if (!token) return []
    return client.getPublicLobbies(token)
  }, [token])

  const join = useCallback(
    async (color: EngineColor) => {
      if (user === undefined) {
        console.log("Can't join, user is undefined")
        return
      }
      await connection?.join({ color, picture: user.picture, name: user.name })
    },
    [connection, user]
  )
  const config = useCallback(
    async (country: EngineCountry, length: EngineLength) => {
      await connection?.config({ country, length })
    },
    [connection]
  )
  const start = useCallback(async () => {
    await connection?.start({})
  }, [connection])

  const move = useCallback(
    async (command: string) => {
      await connection?.move({ command })
    },
    [connection]
  )

  const control = useCallback(
    async (partial: string) => {
      await connection?.control({ partial })
    },
    [connection]
  )

  const undo = useCallback(async () => {
    await connection?.undo({})
  }, [connection])

  const redo = useCallback(async () => {
    await connection?.redo({})
  }, [connection])

  const endGame = useCallback(async () => {
    setEngineState(undefined)
    connection?.disconnect()
  }, [connection])

  const getUser = useCallback(
    (userId: string): EngineUser | undefined => {
      return state?.users?.find((u) => u.id === userId)
    },
    [state]
  )

  const exported = useMemo(
    () => ({
      token,
      state,
      user,
      connecting: connecting && !state,
      error,
      login,
      connect,
      disconnect,
      createPublicLobby,
      createPrivateLobby,
      getPublicLobbies,
      join,
      config,
      start,
      move,
      control,
      undo,
      redo,
      endGame,
      getUser,
    }),
    [
      token,
      state,
      user,
      connecting,
      error,
      login,
      connect,
      disconnect,
      createPublicLobby,
      createPrivateLobby,
      getPublicLobbies,
      join,
      config,
      start,
      move,
      control,
      undo,
      redo,
      endGame,
      getUser,
    ]
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

export const useHathoraContext = () => {
  const context = useContext(HathoraContext)
  if (!context) {
    throw new Error('Component must be within the HathoraContext')
  }
  return context
}

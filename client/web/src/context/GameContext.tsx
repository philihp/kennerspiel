import { ToastContainer } from 'react-toastify'
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

import { CredentialResponse } from '@react-oauth/google'
import { HathoraClient, HathoraConnection } from '../../../.hathora/client'
import { Color, Country, EngineState, IInitializeRequest, Length } from '../../../../api/types'
import { lookupUser, UserData } from '../../../../api/base'
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
  createGame: () => Promise<string>
  join: (color: Color) => Promise<void>
  config: (country: Country, length: Length) => Promise<void>
  start: () => Promise<void>
  move: (command: string) => Promise<void>
  control: (partial: string) => Promise<void>
  undo: () => Promise<void>
  redo: () => Promise<void>
  endGame: () => Promise<void>
  getUserName: (userId: string) => string
}

interface HathoraContextProviderProps {
  children: ReactNode | ReactNode[]
}
const client = new HathoraClient()

const HathoraContext = createContext<GameContext | null>(null)

export const HathoraContextProvider = ({ children }: HathoraContextProviderProps) => {
  const [token, setToken] = useState<string | undefined>(localStorage.getItem('token') || undefined)
  const [state, setEngineState] = useState<EngineState>()
  const [user, setUserInfo] = useState<UserData>()
  const [connection, setConnection] = useState<HathoraConnection>()
  const [events, setEvents] = useState<string[]>()
  const [error, setError] = useState<ConnectionFailure>()
  const [connecting, setConnecting] = useState<boolean>()
  // const [loggingIn, setLoggingIn] = useState<boolean>()
  const [playerNameMapping, setPlayerNameMapping] = useState<Record<string, UserData>>({})

  // if we have a stored token, immediately use that to load things
  useEffect(() => {
    if (token === undefined) return
    const user = HathoraClient.getUserFromToken(token)
    setUserInfo(user)
    setPlayerNameMapping((current) => ({ ...current, [user.id]: user }))
  }, [setPlayerNameMapping, token])

  const login = useCallback(async (cred: CredentialResponse) => {
    if (cred.credential !== undefined) {
      const token = await client.loginGoogle(cred.credential)
      if (token) {
        const user = HathoraClient.getUserFromToken(token)
        setUserInfo(user)
        setPlayerNameMapping((current) => ({ ...current, [user.id]: user }))
        setToken(token)
        localStorage.setItem('token', token)
      }
    }
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
    if (connection !== undefined) {
      connection.disconnect()
      setConnection(undefined)
      setEngineState(undefined)
      setEvents(undefined)
      setError(undefined)
    }
  }, [connection])

  const createGame = useCallback(async (): Promise<string> => {
    if (token) {
      return client.create(token, IInitializeRequest.default())
    }
    return ''
  }, [token])

  const join = useCallback(
    async (color: Color) => {
      await connection?.join({ color })
    },
    [connection]
  )
  const config = useCallback(
    async (country: Country, length: Length) => {
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
      const start = new Date()
      console.log(`${start.toISOString()}: await connection?.control({ ${partial} })`)
      await connection?.control({ partial })
      const end = new Date()
      const diff = end.getTime() - start.getTime()
      console.log(`${end.toISOString()}: returned in ${diff} ms`)
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

  const getUserName = useCallback(
    (userId: string) => {
      if (playerNameMapping[userId]) {
        return playerNameMapping[userId].name
      }
      lookupUser(userId).then((response) => {
        setPlayerNameMapping((curr) => ({ ...curr, [userId]: response }))
      })
      return userId
    },
    [setPlayerNameMapping, playerNameMapping]
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
      createGame,
      join,
      config,
      start,
      move,
      control,
      undo,
      redo,
      endGame,
      getUserName,
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
      createGame,
      join,
      config,
      start,
      move,
      control,
      undo,
      redo,
      endGame,
      getUserName,
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

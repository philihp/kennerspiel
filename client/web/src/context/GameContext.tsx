import { useSessionstorageState } from 'rooks'
import { ToastContainer, toast } from 'react-toastify'
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react'

import { ConnectionFailure } from '../../../.hathora/failures'
import { HathoraClient, HathoraConnection } from '../../../.hathora/client'
import { EngineState, IInitializeRequest } from '../../../../api/types'
import { lookupUser, UserData, Response } from '../../../../api/base'

interface GameContext {
  token?: string
  login: () => Promise<string | undefined>
  connect: (gameId: string) => Promise<HathoraConnection>
  disconnect: () => void
  createGame: () => Promise<string>
  // joinGame: (gameId: string) => Promise<void>;
  // startGame: () => Promise<void>;
  engineState?: EngineState
  connectionError?: ConnectionFailure
  // playCard: (card: Card) => Promise<void>;
  // drawCard: () => Promise<void>;
  endGame: () => void
  getUserName: (id: string) => string
  user?: UserData
  connecting?: boolean
  loggingIn?: boolean
}

interface HathoraContextProviderProps {
  children: ReactNode | ReactNode[]
}
const client = new HathoraClient()

const HathoraContext = createContext<GameContext | null>(null)

const handleResponse = async (prom: Promise<Response>) => {
  const response = await prom

  if (response.type === 'error') {
    toast.error(response.error, {
      position: 'top-center',
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    })
  }

  return response
}

export const HathoraContextProvider = ({ children }: HathoraContextProviderProps) => {
  const [token, setToken] = useSessionstorageState<string>(client.appId)
  const [connection, setConnection] = useState<HathoraConnection>()
  const [engineState, setEngineState] = useState<EngineState>()
  const [events, setEvents] = useState<string[]>()
  const [connectionError, setConnectionError] = useState<ConnectionFailure>()
  const [connecting, setConnecting] = useState<boolean>()
  const [loggingIn, setLoggingIn] = useState<boolean>()
  const [playerNameMapping, setPlayerNameMapping] = useSessionstorageState<Record<string, UserData>>(
    `${client.appId}_player_mapping`,
    {}
  )
  const [user, setUserInfo] = useState<UserData>()
  const isLoginIn = useRef(false)

  const login = async (): Promise<string | undefined> => {
    if (isLoginIn.current) return
    try {
      setLoggingIn(true)
      isLoginIn.current = true
      const token = await client.loginAnonymous()
      if (token) {
        const user = HathoraClient.getUserFromToken(token)
        setUserInfo(user)
        setPlayerNameMapping((current) => ({ ...current, [user.id]: user }))
      }
      setToken(token)
      return token
    } catch (e) {
      console.error(e)
    } finally {
      isLoginIn.current = false
      setLoggingIn(false)
    }
  }

  const connect = useCallback(
    async (stateId: string) => {
      setConnecting(true)
      const connection = await client.connect(token, stateId, ({ state }) => setEngineState(state), setConnectionError)
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
      setConnectionError(undefined)
    }
  }, [connection])

  const createGame = useCallback(async () => {
    if (token) {
      return client.create(token, IInitializeRequest.default())
    }
    const token = await login()!
    return client.create(token!, IInitializeRequest.default())
  }, [token])

  // const joinGame = useCallback(
  //   async (gameId: string) => {
  //     const connection = await connect(gameId);
  //     await connection.joinGame({});
  //   },
  //   [token, connect]
  // );

  // const startGame = useCallback(async () => {
  //   if (connection) {
  //     await handleResponse(connection.startGame({}));
  //   }
  // }, [token, connection]);

  // const playCard = useCallback(
  //   async (card: Card) => {
  //     if (connection) {
  //       await handleResponse(connection.playCard({ card }));
  //     }
  //   },
  //   [connection]
  // );

  // const drawCard = useCallback(async () => {
  //   if (connection) {
  //     await handleResponse(connection.drawCard({}));
  //   }
  // }, [connection]);

  const endGame = () => {
    setEngineState(undefined)
    connection?.disconnect()
  }

  useEffect(() => {
    if (connectionError) {
      toast.error(connectionError?.message)
    }
  }, [connectionError])

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
    [playerNameMapping, setPlayerNameMapping]
  )

  useEffect(() => {
    if (token) {
      setUserInfo(HathoraClient.getUserFromToken(token))
    }
  }, [token])

  // useEffect(() => {
  //   if (EngineState?.turn) {
  //     if (EngineState?.turn === user?.id) {
  //       toast.success("It's your turn", { position: "top-center", hideProgressBar: true });
  //     } else {
  //       toast.info(`it is ${getUserName(EngineState?.turn)}'s turn`, { position: "top-center", hideProgressBar: true });
  //     }
  //   }
  // }, [EngineState?.turn]);

  return (
    <HathoraContext.Provider
      value={{
        token,
        login,
        connect,
        connecting,
        disconnect,
        createGame,
        engineState,
        connectionError,
        loggingIn,
        user,
        endGame,
        getUserName,
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

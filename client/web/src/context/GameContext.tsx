import { ToastContainer, toast } from 'react-toastify'
import React, { createContext, ReactNode, useCallback, useContext,  useState } from 'react'

import { HathoraClient } from '../../../.hathora/client'
import { EngineState } from '../../../../api/types'

interface GameContext {
    engineState?: EngineState,
    createGame: () => Promise<string>,
}

interface HathoraContextProviderProps {
  children: ReactNode | ReactNode[]
}
const client = new HathoraClient()

const HathoraContext = createContext<GameContext | null>(null)

export const HathoraContextProvider = ({ children }: HathoraContextProviderProps) => {
  const [engineState] = useState<EngineState>()

  const createGame = useCallback(async () => new Promise<string>((fulfill, _reject) => {
    setTimeout(() => {
      fulfill("ok")
    }, 500)
  }),
  [])

  return (
    <HathoraContext.Provider
      value={{
        engineState,
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
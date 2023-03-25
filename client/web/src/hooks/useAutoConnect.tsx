import { useEffect } from 'react'
import { useHathoraContext } from '../context/GameContext'

export const useAutoConnect = (gameId?: string) => {
  const { token, connect } = useHathoraContext()
  useEffect(() => {
    if (token && gameId) {
      connect(gameId)
    }
  }, [gameId, token, connect])
}

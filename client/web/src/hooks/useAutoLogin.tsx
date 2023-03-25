import { useEffect } from 'react'

import { useHathoraContext } from '../context/GameContext'

export const useAutoLogin = () => {
  const { token, login } = useHathoraContext()
  useEffect(() => {
    if (!token) {
      login()
    }
  }, [token, login])
}

import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { useHathoraContext } from '../context/GameContext'

export default function Game() {
  const { gameId } = useParams()
  const { disconnect, engineState, token, user, login, connecting } = useHathoraContext()

  useEffect(() => {
    // auto join the game once on this page
    // if (gameId && token && !playerState?.players?.find((p:any) => p.id === user?.id)) {
    //   joinGame(gameId).catch(console.error);
    // }

    if (!token) {
      // log the user in if they aren't already logged in
      login()
    }
    return disconnect
  }, [gameId, token])

  return (
    <>
      {!connecting && token ? (
        <>
          <pre>USE: {JSON.stringify(user)}</pre>
          <pre>STATE: {JSON.stringify(engineState, undefined, 2)}</pre>
        </>
      ) : (
        <div role="status">connecting...</div>
      )}
    </>
  )
}

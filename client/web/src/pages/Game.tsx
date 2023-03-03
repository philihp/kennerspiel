import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { useHathoraContext } from "../context/GameContext";

export default function Game() {
  const { gameId } = useParams();
  const { disconnect, joinGame, playerState, token, user, login, connecting } =
    useHathoraContext();

  useEffect(() => {
    // auto join the game once on this page
    if (gameId && token && !playerState?.players?.find((p:any) => p.id === user?.id)) {
      joinGame(gameId).catch(console.error);
    }

    if (!token) {
      // log the user in if they aren't already logged in
      login();
    }
    return disconnect;
  }, [gameId, token]);


  return (
    <>
      {!connecting && token ? (
        <div >
          connected
        </div>
      ) : (
        <div role="status">connecting...</div>
      )}
    </>
  );
}

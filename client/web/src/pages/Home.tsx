import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { useHathoraContext } from "../context/GameContext";

export default function Home() {
  const navigate = useNavigate();
  const { createGame } = useHathoraContext();
  const [gameId, setGameId] = useState<string>();

  return (
    <>
      <h1>Hathora et Labora</h1>
      <p>
        <input
          onChange={(e) => setGameId(e.target.value)}
          placeholder="Room code"
        />
        <button
          onClick={() => {
            navigate(`/game/${gameId}`);
          }}
        >
          Join Existing Game
        </button>
      </p>
      <p>
        <button
          onClick={() => {
            createGame().then((stateId) => {
              navigate(`/game/${stateId}`);
            });
          }}
        >
          Create Game
        </button>
      </p>
    </>
  );
}

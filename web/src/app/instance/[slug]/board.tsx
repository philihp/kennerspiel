'use client'

import { reducer, control, GameConfigPlayers, GameConfigLength, GameConfigCountry, GameStateSetup, GameStatePlaying, GameState } from 'hathora-et-labora-game'
import { initialState } from 'hathora-et-labora-game'
import { GameStatusEnum } from 'hathora-et-labora-game/dist/types'
import { GameSetup } from './gameSetup'

type BoardParams = {
  commands: string[]
}

export const Board = ({ commands: c0 }: BoardParams) => {
  // const c0 = ["CONFIG 3 france long", "START R G B"]
  const c1 = [
    "CONFIG 3 france long",
    ...c0].map(s => s.split(' '))

  const s0: GameStateSetup | undefined = initialState
  const s1: GameState | undefined = c1.reduce<GameState | undefined>(reducer as (state: GameState | undefined, [command, ...params]: string[]) => GameState | undefined, s0)

  // const s1 = reducer(s0, ['CONFIG', '3', 'france', 'long'])! as GameStateSetup
  // const s2 = reducer(s1, ['START', 'R', 'G', 'B'])! as GameStatePlaying
  // const c2 = control(s2, [])

  const s2: GameStatePlaying = s1 as GameStatePlaying

  if (s1?.status === GameStatusEnum.SETUP)
    return <>
      <GameSetup />
    </>

  if (s1?.status === GameStatusEnum.FINISHED)
    return <>
      game finished
    </>

  return <>
    <pre>{JSON.stringify({ s1 }, undefined, 2)}</pre>
    <hr />
    {/* <pre>{JSON.stringify({ s2, c2 }, undefined, 2)}</pre> */}
    {/* <hr /> */}
  </>
}

import { useState } from 'react'
import { useHathoraContext } from '../context/GameContext'
import { ControlCommit } from './ControlCommit'
import { ControlCutPeat } from './ControlCutPeat'
import { ControlFellTrees } from './ControlFellTrees'

export const Controls = () => {
  const [command, setCommand] = useState<string>('')
  const { move, undo, redo } = useHathoraContext()

  const handleSubmit = () => {
    move(command)
    setCommand('')
  }

  return (
    <>
      <button type="button" onClick={undo}>
        Undo
      </button>
      <button type="button" onClick={redo}>
        Redo
      </button>
      <input type="text" placeholder="command" value={command} onChange={(e) => setCommand(e.target.value)} />
      <button type="submit" onClick={handleSubmit}>
        Explore
      </button>
      <hr />
      <ControlCutPeat />
      <ControlFellTrees />
      <ControlCommit />
    </>
  )
}

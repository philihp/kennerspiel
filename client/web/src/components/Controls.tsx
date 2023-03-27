import { useState } from 'react'
import { useHathoraContext } from '../context/GameContext'
import { ControlBuild } from './ControlBuild'
import { ControlCommit } from './ControlCommit'
import { ControlCutPeat } from './ControlCutPeat'
import { ControlFellTrees } from './ControlFellTrees'
import { ControlUse } from './ControlUse'
import { ControlWith } from './ControlWith'
import { ControlWorkContract } from './ControlWorkContract'

export const Controls = () => {
  const [command, setCommand] = useState<string>('')
  const { state, move, undo, redo } = useHathoraContext()

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
      <ControlBuild />
      <ControlWorkContract />
      <ControlWith />
      <ControlUse />
      <ControlCommit />
      <pre>{JSON.stringify(state?.frame, undefined, 2)}</pre>
    </>
  )
}

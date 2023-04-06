import { useState } from 'react'
import { useHathoraContext } from '../context/GameContext'
import { ControlBuild } from './ControlBuild'
import { ControlCommit } from './ControlCommit'
import { ControlConvert } from './ControlConvert'
import { ControlCutPeat } from './ControlCutPeat'
import { ControlFellTrees } from './ControlFellTrees'
import { ControlSettle } from './ControlSettle'
import { ControlUse } from './ControlUse'
import { ControlWith } from './ControlWith'
import { ControlWorkContract } from './ControlWorkContract'

export const Controls = () => {
  const [command, setCommand] = useState<string>('')
  const [suffix, setSuffix] = useState<string>('')
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
      <br />

      <select name="prefix" value={suffix} onChange={(e) => setSuffix(e.target.value)}>
        <option value={undefined}> </option>
        {state?.control?.completion && state.control.completion.map((l) => <option key={l}>{l}</option>)}
      </select>

      <pre>{JSON.stringify(state?.control?.completion, undefined, 2)}</pre>
      <hr />
      <ControlConvert />
      <ControlCutPeat />
      <ControlFellTrees />
      <ControlBuild />
      <ControlWorkContract />
      <ControlWith />
      <ControlUse />
      <ControlSettle />
      <ControlCommit />
    </>
  )
}

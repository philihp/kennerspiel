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
  const [suffix, setSuffix] = useState<string>('')
  const { state, control, move, undo, redo } = useHathoraContext()

  const handleComplete = () => {
    const tokens = state?.control?.partial?.split(/\s+/) ?? []
    if (tokens.length === 1 && tokens[0] === '') tokens.pop()
    tokens.push(suffix)
    control(tokens.join(' ').trim())
    setSuffix('')
  }

  const handleTrimPartial = () => {
    const tokens = state?.control?.partial?.split(/\s+/)
    if (tokens === undefined) return
    const partial = tokens.slice(0, tokens.length - 1).join(' ')
    console.log({ msg: 'trim partial', tokens, partial })
    control(partial)
    setSuffix('')
  }

  // const handleSubmit = () => {
  //   move(command)
  //   setCommand('')
  // }

  return (
    <>
      <button type="button" onClick={undo}>
        Undo
      </button>
      <button type="button" onClick={redo}>
        Redo
      </button>
      <br />

      <input type="text" placeholder="command" value={state?.control?.partial} disabled />
      <button type="button" onClick={handleTrimPartial}>
        &larr;
      </button>
      <select
        name="prefix"
        value={suffix}
        onClick={(e) => {
          console.log('click')
        }}
        onChange={(e) => {
          console.log('change')
          setSuffix(e.target.value)
        }}
      >
        <option value={undefined}> </option>
        {state?.control?.completion && state.control.completion.map((l) => <option key={l}>{l}</option>)}
      </select>
      <button type="button" onClick={handleComplete}>
        &rarr;
      </button>
      {/* 
      <pre>{JSON.stringify(state?.control, undefined, 2)}</pre> */}
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

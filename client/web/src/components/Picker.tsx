import { equals, reject } from 'ramda'
import { ChangeEvent, useState } from 'react'
import { useHathoraContext } from '../context/GameContext'
import { EngineColor } from '../../../../api/types'

export const Picker = () => {
  const [resource, setResource] = useState<string>('')
  const { state, control, undo, redo } = useHathoraContext()
  const completions = state?.control?.completion ?? []
  const noSelectableOptions = reject(equals(''), completions).length < 1
  if (noSelectableOptions)
    return <div>{EngineColor[state?.players?.[state?.frame?.activePlayerIndex ?? -1]?.color ?? -1]}'s turn</div>

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const tokens = state?.control?.partial?.split(/\s+/) ?? []
    if (tokens.length === 1 && tokens[0] === '') tokens.pop()
    tokens.push(e.target.value)
    control(`${state?.control?.partial} ${e.target.value}`)
    setResource('')
  }

  return (
    <div>
      <button type="button" onClick={undo}>
        Undo
      </button>
      <button type="button" onClick={redo}>
        Redo
      </button>
      <select value={resource} onChange={handleChange}>
        <option> </option>
        {state?.control?.completion?.map((completion) => <option key={completion}>{completion}</option>)}
      </select>
    </div>
  )
}

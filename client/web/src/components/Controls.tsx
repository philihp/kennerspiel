import { ChangeEvent, useState } from 'react'
import { equals, filter, reject } from 'ramda'
import { useHathoraContext } from '../context/GameContext'

export const Controls = () => {
  const [suffix, setSuffix] = useState<string>('')
  const { state, control, move, undo, redo } = useHathoraContext()

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    console.log({ msg: 'change' })
    const tokens = state?.control?.partial?.split(/\s+/) ?? []
    if (tokens.length === 1 && tokens[0] === '') tokens.pop()
    tokens.push(e.target.value)
    control(tokens.join(' ').trim())
    setSuffix('')
  }

  const handleBack = () => {
    const tokens = state?.control?.partial?.split(/\s+/)
    if (tokens === undefined) return
    const partial = tokens.slice(0, tokens.length - 1).join(' ')
    console.log({ msg: 'trim partial', tokens, partial })
    control(partial)
    setSuffix('')
  }

  const handleSubmit = () => {
    console.log({ msg: 'submit' })
    const command = state?.control?.partial
    if (command) {
      setSuffix('')
      control('')
      move(command)
    }
  }

  const nonBlankCompletions = reject(equals(''), state?.control?.completion ?? [])

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
      <button type="button" onClick={handleBack}>
        &larr;
      </button>
      {nonBlankCompletions && (
        <select name="prefix" value={suffix} onChange={handleChange}>
          <option value={undefined}>(select option)</option>
          {nonBlankCompletions.map((l) => (
            <option key={l}>{l}</option>
          ))}
        </select>
      )}
      <button
        type="submit"
        style={{
          WebkitAppearance: 'textfield',
          appearance: 'textfield',
        }}
        onClick={handleSubmit}
        disabled={(state?.control?.completion ?? []).includes('') === false}
      >
        Commit
      </button>
    </>
  )
}

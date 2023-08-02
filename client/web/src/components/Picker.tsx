import { ChangeEvent, useState } from 'react'
import { useHathoraContext } from '../context/GameContext'

export const Picker = () => {
  const [resource, setResource] = useState<string>('')
  const { state, control } = useHathoraContext()

  const completions = state?.control?.completion?.filter?.((c) => c !== '') ?? []
  const showPicker = completions.length > 0

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const tokens = state?.control?.partial?.split(/\s+/) ?? []
    if (tokens.length === 1 && tokens[0] === '') tokens.pop()
    tokens.push(e.target.value)
    control(tokens.join(' '))
    setResource('')
  }

  return (
    <div style={{ minWidth: 300 }}>
      {showPicker && (
        <select value={resource} onChange={handleChange} style={{ width: '100%' }}>
          <option> </option>
          {completions.map((completion) => (
            <option key={completion}>{completion}</option>
          ))}
        </select>
      )}
    </div>
  )
}

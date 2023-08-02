import { useState } from 'react'
import { useHathoraContext } from '../context/GameContext'

export const Debug = () => {
  const [expanded, setExpanded] = useState<boolean>(false)
  const { state, control } = useHathoraContext()
  const handleClick = () => setExpanded(!expanded)
  const handleReset = () => control('')

  return (
    <div>
      <button type="button" onClick={handleReset}>
        Reset
      </button>
      <button type="button" onClick={handleClick}>
        Debug
      </button>
      {expanded && <pre>{JSON.stringify(state, undefined, 2)}</pre>}
    </div>
  )
}

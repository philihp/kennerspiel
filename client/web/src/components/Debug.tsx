import { useState } from 'react'
import { useHathoraContext } from '../context/GameContext'

export const Debug = () => {
  const [expanded, setExpanded] = useState<boolean>(false)
  const { state } = useHathoraContext()
  const handleClick = () => setExpanded(!expanded)

  return (
    <div>
      <button type="button" onClick={handleClick}>
        Debug
      </button>
      {expanded && <pre>{JSON.stringify(state, undefined, 2)}</pre>}
    </div>
  )
}

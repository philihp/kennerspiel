import { useHathoraContext } from '../context/GameContext'
import { Picker } from './Picker'

const resetStyle = {
  fontFamily: 'monospace',
  margin: 0,
  padding: 0,
  listStyle: 'none',
  textIndent: 0,
  listStyleType: 'none',
}

export const MoveList = () => {
  const { state, control, undo, redo } = useHathoraContext()
  return (
    <div style={{ paddingTop: 20 }}>
      <button type="button" onClick={undo}>
        &lt;
      </button>
      <button type="button" onClick={redo}>
        &gt;
      </button>
      <ul style={resetStyle}>
        {state?.moves.map((m, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <li key={`${i}:${m}`} style={resetStyle}>
            {m}
          </li>
        ))}
        <li style={{ fontWeight: 'bold' }}>
          {state?.control?.partial}
          <Picker />
          <button type="button" onClick={() => control('')}>
            Clear Command
          </button>
        </li>
      </ul>
    </div>
  )
}

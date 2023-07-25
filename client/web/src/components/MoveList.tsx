import { collectBy } from 'ramda'
import { useHathoraContext } from '../context/GameContext'
import { Picker } from './Picker'
import { EngineColor } from '../../../../api/types'

const resetStyle = {
  fontFamily: 'monospace',
  margin: 0,
  padding: 0,
  listStyle: 'none',
  textIndent: 0,
  listStyleType: 'none',
}

const colorToChar = (color?: EngineColor): string => {
  switch (color) {
    case EngineColor.Red:
      return 'R'
    case EngineColor.Blue:
      return 'B'
    case EngineColor.Green:
      return 'G'
    case EngineColor.White:
      return 'W'
    default:
      return ''
  }
}

export const MoveList = () => {
  const { state, undo, redo } = useHathoraContext()

  const flow = collectBy((f) => `${f.round}`, state?.flow ?? [])
  return (
    <div style={{ paddingTop: 20 }}>
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

          <button type="button" onClick={undo}>
            &lt;
          </button>
          <button type="button" onClick={redo}>
            &gt;
          </button>
        </li>

        {flow.map((roundFrames) =>
          roundFrames.map((frame) => (
            <li>
              {frame.settle && `Settle ${frame.player}`}
              {!frame.settle && frame.bonus && `Bonus ${colorToChar(frame.player)}`}
              {!frame.settle && !frame.bonus && `Round ${frame.round} ${colorToChar(frame.player)}`}
            </li>
          ))
        )}
      </ul>
    </div>
  )
}

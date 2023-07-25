import classes from './submit.module.css'
import { useHathoraContext } from '../../context/GameContext'

export const Submit = () => {
  const { state, control, move } = useHathoraContext()
  const position = state?.control?.completion?.includes('') ? -80 : 0

  const handleReset = () => {
    control('')
  }

  const handleSubmit = () => {
    const command = state?.control?.partial
    if (command) {
      control('')
      move(command)
    }
  }

  return (
    <div className={classes.container} style={{ transform: `translateY(${position}px)` }}>
      <button className={classes.submit} type="submit" onClick={handleReset}>
        Reset
      </button>
      <button className={classes.submit} type="submit" onClick={handleSubmit}>
        Send Move
      </button>
    </div>
  )
}

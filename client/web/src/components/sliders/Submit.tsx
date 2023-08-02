import classes from './submit.module.css'
import { useHathoraContext } from '../../context/GameContext'

export const Submit = () => {
  const { state, control, move } = useHathoraContext()
  const position = state?.control?.completion?.includes('COMMIT') ? -80 : 0

  const handleSubmit = () => {
    const command = state?.control?.partial
    if (command !== undefined) {
      // command could be '', dont remove !== undefined
      control('')
      console.log('commit')
      move('COMMIT')
    }
  }

  return (
    <div className={classes.container} style={{ transform: `translateY(${position}px)` }}>
      <button className={classes.submit} type="submit" onClick={handleSubmit}>
        End Turn
      </button>
    </div>
  )
}

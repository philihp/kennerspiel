import classes from './debug.module.css'
import { useHathoraContext } from '../../context/GameContext'

export const Debug = () => {
  const { state } = useHathoraContext()
  return (
    <div className={classes.container}>
      <pre>{JSON.stringify(state?.control, undefined, 2)}</pre>
    </div>
  )
}

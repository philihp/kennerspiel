import { collectBy } from 'ramda'
import classes from './Flower.module.css'
import { useHathoraContext } from '../context/GameContext'

export const Flower = () => {
  const { state } = useHathoraContext()

  const flow = collectBy((f) => `${f.round}`, state?.flow ?? [])

  return (
    <div className={classes.flower}>
      {flow.map((roundFrames) => (
        <div className={classes.round}>
          {roundFrames.map((frames) => (
            <div className={classes.frame}>{frames.settle ? 'Settle' : frames.round}</div>
          ))}
        </div>
      ))}
    </div>
  )
}

import { ChangeEvent } from 'react'
import classes from './Erection.module.css'
import { useHathoraContext } from '../context/GameContext'

interface Props {
  id: string
  disabled?: boolean
  onClick?: () => void
}

const decolor = (id: string) => {
  if (id === undefined) return id
  if (['L', 'S'].includes(id[0]) && ['R', 'G', 'B', 'W'].includes(id[1])) {
    return `${id[0]}0${id[2]}`
  }
  return id
}

const isFarmYard = (id: string) => decolor(id) === 'L02'

const multiplier = 0.4

export const Erection = ({ id, disabled, onClick }: Props) => {
  const { state, control } = useHathoraContext()
  const onFarmYardClick = (e: ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === ' ') return
    console.log({ target: e.target.value, control: `${state?.control?.partial} ${e.target.value}` })
    control(`${state?.control?.partial} ${e.target.value}`)
  }

  return (
    <div style={{ display: 'inline-block' }}>
      <img
        alt={id}
        style={{ display: 'inline' }}
        src={`https://hathora-et-labora.s3-us-west-2.amazonaws.com/${decolor(id)}.jpg`}
        width={150 * multiplier}
        height={250 * multiplier}
      />
      <br />

      {isFarmYard(id) && state?.control?.partial?.endsWith(`${id}`) && (
        <div className={classes.dialog}>
          <select onChange={onFarmYardClick}>
            <option> </option>
            <option>Gn</option>
            <option>Sh</option>
            <option>JoGn</option>
            <option>JoSh</option>
          </select>
        </div>
      )}
      <button type="button" onClick={onClick} disabled={disabled}>
        {id}
      </button>
    </div>
  )
}

Erection.defaultProps = {
  disabled: true,
  onClick: () => undefined,
}

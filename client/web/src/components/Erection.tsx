import { ChangeEvent } from 'react'
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
      {isFarmYard(id) && state?.control?.partial?.endsWith(`${id}`) && (
        <div
          // open={state?.control?.partial?.includes(` ${id}`)}
          style={{
            zIndex: 10,
            background: 'pink',
            padding: 4,
            borderWidth: 1,
            borderStyle: 'dotted',
            // position: 'relative',
            position: 'absolute',
            // position: 'fixed',
            // position: 'inherit',
            // position: 'initial',
            // position: 'revert',
            // position: 'revert-layer',
            // position: 'static',
            // position: 'sticky',
            //
          }}
        >
          {id}
          <hr />
          <select onChange={onFarmYardClick}>
            <option> </option>
            <option>Gn</option>
            <option>Sh</option>
            <option>JoGn</option>
            <option>JoSh</option>
          </select>
        </div>
      )}
      <img
        alt={id}
        style={{ display: 'inline' }}
        src={`https://hathora-et-labora.s3-us-west-2.amazonaws.com/${decolor(id)}.jpg`}
        width={150 * multiplier}
        height={250 * multiplier}
      />
      <br />

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

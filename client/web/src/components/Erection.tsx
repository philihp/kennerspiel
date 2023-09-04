import { useHathoraContext } from '../context/GameContext'

interface Props {
  id: string
  primary?: boolean
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

const multiplier = 0.7

export const Erection = ({ id, primary, disabled, onClick }: Props) => {
  const { state } = useHathoraContext()
  const partial = state?.control?.partial ?? ''

  return (
    <div style={{ display: 'inline-block' }}>
      <img
        alt={id}
        style={{ display: 'inline' }}
        src={`https://hathora-et-labora.s3-us-west-2.amazonaws.com/${decolor(id)}.jpg`}
        width={150 * multiplier}
        height={250 * multiplier}
      />
      {onClick !== undefined && (
        <>
          <br />
          <button
            className={primary || partial.includes(id) ? 'primary' : ''}
            type="button"
            onClick={onClick}
            disabled={disabled}
          >
            {id}
          </button>
        </>
      )}
    </div>
  )
}

Erection.defaultProps = {
  primary: false,
  disabled: true,
  onClick: undefined,
}

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

const multiplier = 0.4

export const Erection = ({ id, disabled, onClick }: Props) => (
  <div style={{ display: 'inline-block' }}>
    <img
      alt={id}
      title={id}
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

Erection.defaultProps = {
  disabled: true,
  onClick: () => undefined,
}

interface Props {
  id: string
}

const decolor = (id: string) => {
  if (id === undefined) return id
  if (id[0] === 'L' && ['R', 'G', 'B', 'W'].includes(id[1])) {
    return `${id[0]}0${id[2]}`
  }
  return id
}

const multiplier = 0.4

export const Erection = ({ id }: Props) => (
  <div style={{ display: 'inline-block' }}>
    {id}
    <br />
    <img
      alt={id}
      title={id}
      style={{ display: 'inline' }}
      src={`https://hathora-et-labora.s3-us-west-2.amazonaws.com/${decolor(id)}.jpg`}
      width={150 * multiplier}
      height={250 * multiplier}
    />
  </div>
)

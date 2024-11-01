import { useInstanceContext } from '@/context/InstanceContext'
import Image from 'next/image'

interface Props {
  id: string
  primary?: boolean
  disabled?: boolean
  ghosted?: boolean
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

export const Erection = ({ id, primary = false, disabled = true, ghosted = false, onClick = () => {} }: Props) => {
  const { controls, state } = useInstanceContext()
  const partial = controls?.partial ?? ''

  return (
    <div style={{ display: 'inline-block' }}>
      <Image
        alt={id}
        style={{
          display: 'inline',
          ...(ghosted
            ? {
                opacity: 0.5,
              }
            : {}),
        }}
        src={`https://hathora-et-labora.s3-us-west-2.amazonaws.com/${decolor(id)}.jpg`}
        width={150 * multiplier}
        height={250 * multiplier}
      />
      {onClick !== undefined && (
        <>
          <br />
          <button className={`primary`} type="button" onClick={onClick} disabled={disabled}>
            {id}
          </button>
        </>
      )}
    </div>
  )
}

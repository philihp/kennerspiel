import { useInstanceContext } from '@/context/InstanceContext'
import Image from 'next/image'
import { Farmyard } from './erection/farmyard'
import { BuildingEnum, ErectionEnum } from 'hathora-et-labora-game/dist/types'
import { FuelMerchant } from './erection/fuelMerchant'
import { PeatCoalKiln } from './erection/peatCoalKiln'
import { ErectionModal } from './erection/'

interface Props {
  id: ErectionEnum
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

const commandComplete = (command: string[], completion: string[] = []): boolean => {
  if (completion[0] === '' && completion.length === 1) return true
  return false
}

const multiplier = 0.7

export const Erection = ({ id, primary = false, disabled = true, ghosted = false, onClick = () => {} }: Props) => {
  const { controls, state } = useInstanceContext()
  const partial = controls?.partial
  const used = partial?.slice(0, 2)?.join(' ') === `USE ${id}` && !commandComplete(partial, controls?.completion)

  return (
    <div style={{ display: 'inline-block' }}>
      {onClick !== undefined && (
        <>
          <button className="primary" type="button" onClick={onClick} disabled={disabled && !used}>
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
          </button>
          <br />
          {used && <ErectionModal id={id} />}
        </>
      )}
    </div>
  )
}

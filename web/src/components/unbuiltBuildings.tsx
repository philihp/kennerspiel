import { useInstanceContext } from '@/context/InstanceContext'
import { head } from 'ramda'
import { Erection } from './erection'

interface Props {
  buildings: string[]
}

export const UnbuiltBuildings = ({ buildings }: Props) => {
  const { controls, addPartial } = useInstanceContext()
  const partial = controls?.partial ?? []
  const command = head(partial)
  const primary = command === 'BUILD' && partial.length === 1
  return (
    <div>
      {buildings.map((building) => (
        <span key={building} style={{ marginRight: 10 }}>
          <Erection
            primary={primary}
            id={building}
            disabled={!controls?.completion?.includes(building)}
            onClick={() => {
              addPartial(`${building}`)
            }}
          />
        </span>
      ))}
    </div>
  )
}

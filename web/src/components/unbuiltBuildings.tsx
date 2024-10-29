import { useInstanceContext } from '@/context/InstanceContext'
import { head } from 'ramda'
import { Erection } from './erection'

interface Props {
  buildings: string[]
}

export const UnbuiltBuildings = ({ buildings }: Props) => {
  const { controls } = useInstanceContext()
  const partial = controls?.partial ?? []
  const command = head(partial)
  const primary = command === 'BUILD' && partial.length === 1
  return (
    <div style={{ margin: 10 }}>
      {buildings.map((building) => {
        const buildable = controls?.completion?.includes(building)
        const handleClick = () => {
          console.log('handleClick unbuilt building')
          // control(`${controls?.partial} ${building}`)
        }
        return <Erection key={building} primary={primary} id={building} disabled={!buildable} onClick={handleClick} />
      })}
    </div>
  )
}

import { head } from 'ramda'
import { useHathoraContext } from '../context/GameContext'
import { Erection } from './Erection'

interface Props {
  buildings: string[]
}

export const UnbuiltBuildings = ({ buildings }: Props) => {
  const { state, control } = useHathoraContext()
  const partial = state?.control?.partial?.split(/ +/) ?? []
  const command = head(partial)
  const primary = command === 'BUILD' && partial.length === 1
  return (
    <div style={{ margin: 10 }}>
      {buildings.map((building) => {
        const buildable = state?.control?.completion?.includes(building)
        const handleClick = () => {
          control(`${state?.control?.partial} ${building}`)
        }
        return <Erection key={building} primary={primary} id={building} disabled={!buildable} onClick={handleClick} />
      })}
    </div>
  )
}

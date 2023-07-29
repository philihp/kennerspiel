import { useHathoraContext } from '../context/GameContext'
import { Erection } from './Erection'

interface Props {
  settlements: string[]
}

export const PlayerSettlements = ({ settlements }: Props) => {
  const { state, control } = useHathoraContext()
  return (
    <div style={{ margin: 10 }}>
      {settlements.map((settlement) => {
        const disabled = !state?.control?.completion?.includes(settlement)
        const handleClick = () => {
          if (!disabled) {
            control(`${state?.control?.partial} ${settlement}`)
          }
        }
        return <Erection key={settlement} id={settlement} onClick={handleClick} disabled={disabled} />
      })}
    </div>
  )
}

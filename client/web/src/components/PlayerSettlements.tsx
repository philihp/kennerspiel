import { useHathoraContext } from '../context/GameContext'
import { Erection } from './Erection'

interface Props {
  settlements: string[]
  landscape: (string | undefined)[][][]
  color: string
}

export const PlayerSettlements = ({ settlements, landscape, color }: Props) => {
  const { state, control } = useHathoraContext()

  const placed = new Set(landscape.flat().map((tile) => tile[1]).filter(Boolean))
  const has = (id: string) => settlements.includes(id) || placed.has(id)

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
      {!has(`S${color}5`) && <Erection key={`S${color}5`} id={`S${color}5`} onClick={() => {}} disabled ghosted />}
      {!has(`S${color}6`) && <Erection key={`S${color}6`} id={`S${color}6`} onClick={() => {}} disabled ghosted />}
      {!has(`S${color}7`) && <Erection key={`S${color}7`} id={`S${color}7`} onClick={() => {}} disabled ghosted />}
      {!has(`S${color}8`) && <Erection key={`S${color}8`} id={`S${color}8`} onClick={() => {}} disabled ghosted />}
    </div>
  )
}

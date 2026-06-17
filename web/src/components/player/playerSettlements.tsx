import { useInstanceContext } from '@/context/InstanceContext'
import { Erection } from '../erection'
import { ErectionEnum } from 'hathora-et-labora-game'
import { Tile } from 'hathora-et-labora-game/dist/types'

interface Props {
  settlements: string[]
  landscape: Tile[][]
  color: string
}

export const PlayerSettlements = ({ settlements, landscape, color }: Props) => {
  const { controls, addPartial } = useInstanceContext()

  const placed = new Set(landscape.flat().map((tile) => tile[1]).filter(Boolean))
  const has = (id: string) => settlements.includes(id) || placed.has(id as ErectionEnum)

  return (
    <div style={{ margin: 10 }}>
      {settlements.map((settlement) => {
        const disabled = !controls?.completion?.includes(settlement)
        const handleClick = () => {
          if (!disabled) {
            addPartial(`${settlement}`)
          }
        }
        return <Erection key={settlement} id={settlement as ErectionEnum} onClick={handleClick} disabled={disabled} />
      })}
      {!has(`S${color}5`) && <Erection key={`S${color}5`} id={`S${color}5` as ErectionEnum} onClick={() => {}} disabled ghosted />}
      {!has(`S${color}6`) && <Erection key={`S${color}6`} id={`S${color}6` as ErectionEnum} onClick={() => {}} disabled ghosted />}
      {!has(`S${color}7`) && <Erection key={`S${color}7`} id={`S${color}7` as ErectionEnum} onClick={() => {}} disabled ghosted />}
      {!has(`S${color}8`) && <Erection key={`S${color}8`} id={`S${color}8` as ErectionEnum} onClick={() => {}} disabled ghosted />}
    </div>
  )
}

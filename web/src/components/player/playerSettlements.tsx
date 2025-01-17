import { useInstanceContext } from '@/context/InstanceContext'
import { Erection } from '../erection'

interface Props {
  settlements: string[]
  color: string
}

export const PlayerSettlements = ({ settlements, color }: Props) => {
  const { state, controls, addPartial } = useInstanceContext()
  const flow = controls?.flow

  const showS05 =
    state?.frame?.settlementRound &&
    (['S'].includes(state?.frame?.settlementRound) || (state?.frame?.settlementRound === 'A' && flow?.[0]?.settle))
  const showS06 =
    state?.frame?.settlementRound &&
    (['S', 'A'].includes(state?.frame?.settlementRound) || (state?.frame?.settlementRound === 'B' && flow?.[0]?.settle))
  const showS07 =
    state?.frame?.settlementRound &&
    (['S', 'A', 'B'].includes(state?.frame?.settlementRound) ||
      (state?.frame?.settlementRound === 'C' && flow?.[0]?.settle))
  const showS08 =
    state?.frame?.settlementRound &&
    (['S', 'A', 'B', 'C'].includes(state?.frame?.settlementRound) ||
      (state?.frame?.settlementRound === 'D' && flow?.[0]?.settle))
  return (
    <div style={{ margin: 10 }}>
      {settlements.map((settlement) => {
        const disabled = !controls?.completion?.includes(settlement)
        const handleClick = () => {
          if (!disabled) {
            addPartial(`${settlement}`)
          }
        }
        return <Erection key={settlement} id={settlement} onClick={handleClick} disabled={disabled} />
      })}
      {showS05 && <Erection key={`S${color}5`} id={`S${color}5`} onClick={() => {}} disabled ghosted />}
      {showS06 && <Erection key={`S${color}6`} id={`S${color}6`} onClick={() => {}} disabled ghosted />}
      {showS07 && <Erection key={`S${color}7`} id={`S${color}7`} onClick={() => {}} disabled ghosted />}
      {showS08 && <Erection key={`S${color}8`} id={`S${color}8`} onClick={() => {}} disabled ghosted />}
    </div>
  )
}

import { useInstanceContext } from '@/context/InstanceContext'
import { range } from 'ramda'

export const UnbuiltWonders = () => {
  const { state } = useInstanceContext()
  if (state === undefined) return <></>
  const { wonders } = state

  return (
    <div>
      Wonders:
      {range(0, wonders).map((n) => (
        <span key={n}>🖼️</span>
      ))}
    </div>
  )
}

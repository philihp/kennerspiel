import { useInstanceContext } from '@/context/InstanceContext'
import { range } from 'ramda'

export const UnbuiltWonders = () => {
  const { state } = useInstanceContext()
  if (state === undefined) return <></>
  const { wonders } = state

  return (
    <p>
      Remaining wonders ({wonders}):
      {range(0, wonders).map((n) => (
        <span key={n}>🖼️</span>
      ))}
    </p>
  )
}

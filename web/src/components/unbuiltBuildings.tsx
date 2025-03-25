import { useInstanceContext } from '@/context/InstanceContext'
import { head, map } from 'ramda'
import { Erection } from './erection'

export const UnbuiltBuildings = () => {
  const { state, partial, controls, addPartial } = useInstanceContext()
  if (state === undefined) return <></>
  const { buildings } = state

  return (
    <div style={{ minHeight: 450 }}>
      {map(
        (building) => (
          <span key={building} style={{ marginRight: 10 }}>
            <Erection
              primary={head(partial) === 'BUILD' && partial.length === 1}
              id={building}
              disabled={!controls?.completion?.includes(building)}
              onClick={() => {
                addPartial(`${building}`)
              }}
            />
          </span>
        ),
        buildings
      )}
    </div>
  )
}

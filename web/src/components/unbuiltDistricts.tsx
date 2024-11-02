import { useInstanceContext } from '@/context/InstanceContext'
import { match, P } from 'ts-pattern'

export const UnbuiltDistricts = () => {
  const { state } = useInstanceContext()
  if (state === undefined) return <></>
  const { districtPurchasePrices } = state

  return (
    <div>
      {match(districtPurchasePrices)
        .with([], () => 'no districts left')
        .with(
          [P.select('next', P.number), ...P.array(P.select('stack', P.number))],
          ({ next, stack }) => `Next District: [ graph ] for ${next} and then costs are ${stack.join(', ')}`
        )
        .otherwise(() => '')}
    </div>
  )
}

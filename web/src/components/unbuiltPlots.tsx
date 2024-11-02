import { useInstanceContext } from '@/context/InstanceContext'
import { match, P } from 'ts-pattern'

export const UnbuiltPlots = () => {
  const { state } = useInstanceContext()
  if (state === undefined) return <></>
  const { plotPurchasePrices } = state

  return (
    <div>
      {match(plotPurchasePrices)
        .with([], () => 'no plots left')
        .with(
          [P.select('next', P.number), ...P.array(P.select('stack', P.number))],
          ({ next, stack }) => `Next Plot: [ graph ] for ${next} and then costs are ${stack.join(', ')}`
        )
        .otherwise(() => '')}
    </div>
  )
}

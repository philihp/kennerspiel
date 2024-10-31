import { match, P } from 'ts-pattern'

interface Props {
  plots: number[]
}

export const UnbuiltPlots = ({ plots }: Props) => (
  <div>
    {match(plots)
      .with([], () => 'no plots left')
      .with([P.select('next', P.number), ...P.array(P.select('stack', P.number))], ({ next, stack }) => (
        <>
          Next Plot: [ graph ] for {next} and then costs are {stack.join(', ')}
        </>
      ))
      .otherwise(() => '')}
  </div>
)

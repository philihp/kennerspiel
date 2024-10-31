import { match, P } from 'ts-pattern'

interface Props {
  districts: number[]
}

export const UnbuiltDistricts = ({ districts }: Props) => (
  <div>
    {match(districts)
      .with([], () => 'no districts left')
      .with([P.select('next', P.number), ...P.array(P.select('stack', P.number))], ({ next, stack }) => (
        <>
          Next District: [ graph ] for {next} and then costs are {stack.join(', ')}
        </>
      ))
      .otherwise(() => '')}
  </div>
)

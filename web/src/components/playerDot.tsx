import { PlayerColor } from 'hathora-et-labora-game/dist/types'
import { match } from 'ts-pattern'
import Dot from './dot'

type PlayerDotProps = {
  color?: PlayerColor
}

export const PlayerDot = ({ color }: PlayerDotProps) =>
  match(color)
    .with(PlayerColor.Red, () => <Dot color={'#fb8072'} border={'#ad574d'} />)
    .with(PlayerColor.Green, () => <Dot color={'#b3de69'} border={'#87a74f'} />)
    .with(PlayerColor.Blue, () => <Dot color={'#80b1d3'} border={'#5f849e'} />)
    .with(PlayerColor.White, () => <Dot color={'#d9d9d9'} border={'#b1b1b1'} />)
    .otherwise(() => <></>)

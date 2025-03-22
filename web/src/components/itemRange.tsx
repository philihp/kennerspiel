import { ResourceEnum } from 'hathora-et-labora-game/dist/types'
import { map, range } from 'ramda'
import { ItemList } from './itemList'

type ItemRangeProps = {
  type: ResourceEnum
  from?: number
  to?: number
  onClick: () => void
}

export const ItemRange = ({ from = 0, to = 0, type, onClick }: ItemRangeProps) =>
  map((n) => <ItemList key={`${type}:${n}`} items={type} onClick={onClick} />, range(from, to))

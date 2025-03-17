import { ResourceEnum } from 'hathora-et-labora-game/dist/types'
import Image from 'next/image'
import { map, splitEvery } from 'ramda'

const multiplier = 1.5

type Props = {
  items: string
}

export const ItemList = ({ items: itemsRaw }: Props) => {
  const items = splitEvery(2, itemsRaw) as ResourceEnum[]

  return (
    <>
      {map(
        (type) => (
          <Image
            alt={type}
            title={type}
            style={{
              display: 'inline',
              margin: 0.5,
              borderWidth: 0.5,
              borderRadius: 4,
              borderColor: '#000',
              borderStyle: 'solid',
            }}
            src={`https://hathora-et-labora.s3-us-west-2.amazonaws.com/${type}.jpg`}
            width={24 * multiplier}
            height={24 * multiplier}
          />
        ),
        items
      )}
    </>
  )
}

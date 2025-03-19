import { ResourceEnum } from 'hathora-et-labora-game/dist/types'
import Image from 'next/image'
import { addIndex, map, splitEvery } from 'ramda'
import { MouseEventHandler, ReactNode } from 'react'

const multiplier = 1.5

type Props = {
  items: string
  onClick?: (index: number, type: ResourceEnum) => void
}

export const ItemList = ({ items: itemsRaw, onClick }: Props) => {
  const items = splitEvery(2, itemsRaw) as ResourceEnum[]

  return (
    <>
      {addIndex<ResourceEnum, ReactNode>(map)(
        (type: ResourceEnum, i: number) => (
          <>
            <Image
              key={`${type}:${i}`}
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
              onClick={() => {
                onClick?.(i, type)
              }}
            />
          </>
        ),
        items
      )}
    </>
  )
}

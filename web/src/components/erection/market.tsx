import { useInstanceContext } from '@/context/InstanceContext'
import { Modal } from '../modal'
import { useState } from 'react'
import { BuildingEnum, ResourceEnum, Tableau } from 'hathora-et-labora-game/dist/types'
import { genDenormalize, partiallyUsed, normalize } from './util'
import { ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { ItemList } from '../itemList'
import { any, concat, equals, filter, includes, join, map, none, pipe, reduce, reject, splitEvery } from 'ramda'

const id = BuildingEnum.Market

const multiplier = 1

const uniqueResources = (player?: Tableau): string =>
  join('')(
    map<[ResourceEnum, (number | undefined)?], string>(([type, amount]) => (!amount ? '' : `${type}`))([
      // lolwtf
      [ResourceEnum.Wood, player?.wood],
      [ResourceEnum.Whiskey, player?.whiskey],
      [ResourceEnum.Grain, player?.grain],
      [ResourceEnum.Straw, player?.straw],
      [ResourceEnum.Sheep, player?.sheep],
      [ResourceEnum.Meat, player?.meat],
      [ResourceEnum.Clay, player?.clay],
      [ResourceEnum.Ceramic, player?.ceramic],
      [ResourceEnum.Peat, player?.peat],
      [ResourceEnum.Coal, player?.coal],
      [ResourceEnum.Penny, player?.penny],
      [ResourceEnum.Book, player?.book],
      [ResourceEnum.Stone, player?.stone],
      [ResourceEnum.Ornament, player?.ornament],
      [ResourceEnum.Flour, player?.flour],
      [ResourceEnum.Bread, player?.bread],
      [ResourceEnum.Grape, player?.grape],
      [ResourceEnum.Wine, player?.wine],
      [ResourceEnum.Nickel, player?.nickel],
      [ResourceEnum.Reliquary, player?.reliquary],
      [ResourceEnum.Malt, player?.malt],
      [ResourceEnum.Beer, player?.beer],
    ])
  )

export const Market = () => {
  const { state, setPartial, addPartial, controls } = useInstanceContext()
  const [open, setOpen] = useState(partiallyUsed([id], controls?.partial))
  const player = state?.players[state?.frame?.currentPlayerIndex]

  const [[unusedResources, usedResources], setResources] = useState<[string, string]>([uniqueResources(player), ''])

  const handleClose = () => {
    setPartial(['USE'])
    setOpen(false)
  }

  const handleOK = (param: string) => () => {
    addPartial(param)
    setOpen(false)
  }

  const options = controls?.completion ?? []
  const viableOptions = map<string, string>(normalize)(
    reduce<string, string[]>(
      (options, substr) => filter<string, string[]>(includes(substr), options),
      options,
      splitEvery(2, usedResources)
    )
  )
  const denormalizer = genDenormalize(options)
  const param = normalize(usedResources)

  return (
    <Modal title="Market" openModal={open} closeModal={handleClose}>
      <Image
        alt={id}
        src={`https://hathora-et-labora.s3-us-west-2.amazonaws.com/${id}.jpg`}
        style={{ float: 'left' }}
        width={150 * multiplier}
        height={250 * multiplier}
      />
      <br />
      <>
        Select 4 different goods to consume
        <br />
        <ItemList
          items={unusedResources}
          onClick={(_, type) => {
            if (none(includes(type), options)) return
            const resourceList = splitEvery(2, unusedResources) as ResourceEnum[]
            setResources([
              //
              normalize(join('', reject(equals<ResourceEnum>(type), resourceList))),
              normalize(concat(type, usedResources)),
            ])
          }}
        />
        <ChevronRight />
        <ItemList
          items={usedResources}
          onClick={(_, type) => {
            const resourceList = splitEvery(2, usedResources) as ResourceEnum[]
            setResources([
              //
              normalize(concat(type, unusedResources)),
              normalize(join('', reject(equals<ResourceEnum>(type), resourceList))),
            ])
          }}
        />
        <br />
        for
        <br />
        <ItemList items={'BrNiPnPn'} />
        <hr />
        <button
          style={{ float: 'right' }}
          className="primary"
          disabled={!includes(param, viableOptions) || param === ''}
          onClick={handleOK(param)}
        >
          Consume
        </button>
        <button
          style={{ float: 'right' }}
          className="primary"
          disabled={!includes(param, viableOptions) || param !== ''}
          onClick={handleOK(param)}
        >
          Skip
        </button>
      </>
    </Modal>
  )
}

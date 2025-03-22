import { useInstanceContext } from '@/context/InstanceContext'
import { useState } from 'react'
import { Modal } from '../modal'
import { BuildingEnum, ResourceEnum } from 'hathora-et-labora-game/dist/types'
import Image from 'next/image'
import { filter, flatten, includes, join, map, max, min, range, reduce, repeat } from 'ramda'
import { ItemList } from '../itemList'
import { ChevronsRight } from 'lucide-react'
import { normalize, genDenormalize, partiallyUsed } from './util'

const id = BuildingEnum.Inn

const multiplier = 0.75
const COINS_FOR_WINE = 6
const MAX_FOOD = 7

type ClickableListProps = {
  type: ResourceEnum
  from?: number
  to?: number
  onClick: () => void
}

const ClickableList = ({ from = 0, to = 0, type, onClick }: ClickableListProps) =>
  map((n) => <ItemList key={`${type}:${n}`} items={type} onClick={onClick} />, range(from, to))

export const Inn = () => {
  const { state, setPartial, addPartial, controls } = useInstanceContext()
  const [open, setOpen] = useState(partiallyUsed([id], controls?.partial))
  const [grainUsed, setGrainUsed] = useState(0)
  const [flourUsed, setFlourUsed] = useState(0)
  const [sheepUsed, setSheepUsed] = useState(0)
  const [grapeUsed, setGrapeUsed] = useState(0)
  const [breadUsed, setBreadUsed] = useState(0)
  const [pennyUsed, setPennyUsed] = useState(0)
  const [nickelUsed, setNickelUsed] = useState(0)
  const [meatUsed, setMeatUsed] = useState(0)
  const [beerUsed, setBeerUsed] = useState(0)
  const [whiskeyUsed, setWhiskeyUsed] = useState(0)

  const [wineUsed, setWineUsed] = useState(0)

  const player = state?.players[state?.frame?.currentPlayerIndex]

  const options = controls?.completion ?? []

  const denormalizer = genDenormalize(options)

  const foodUsed =
    1 * grainUsed +
    2 * sheepUsed +
    1 * grapeUsed +
    3 * breadUsed +
    1 * pennyUsed +
    5 * nickelUsed +
    5 * meatUsed +
    5 * beerUsed +
    2 * whiskeyUsed +
    1 * wineUsed

  const coinsMade = 1 * min(foodUsed - max(wineUsed - 1, 0), MAX_FOOD) + COINS_FOR_WINE * min(1, wineUsed)

  const substrings = [
    join('', repeat(ResourceEnum.Grain, grainUsed)),
    join('', repeat(ResourceEnum.Flour, flourUsed)),
    join('', repeat(ResourceEnum.Sheep, sheepUsed)),
    join('', repeat(ResourceEnum.Grape, grapeUsed)),
    join('', repeat(ResourceEnum.Nickel, nickelUsed)),
    join('', repeat(ResourceEnum.Meat, meatUsed)),
    join('', repeat(ResourceEnum.Beer, beerUsed)),
    join('', repeat(ResourceEnum.Whiskey, whiskeyUsed)),
    join('', repeat(ResourceEnum.Wine, wineUsed)),
    join('', repeat(ResourceEnum.Bread, breadUsed)),
    join('', repeat(ResourceEnum.Penny, pennyUsed)),
  ]
  const param = normalize(join('', substrings))

  const handleClose = () => {
    setPartial(['USE'])
    setOpen(false)
  }

  const handleOK = (param: string) => () => {
    addPartial(param)
    setOpen(false)
  }

  return (
    <Modal title="Inn" closeModal={handleClose} openModal={open} close={'Cancel'}>
      <Image
        alt={id}
        src={`https://hathora-et-labora.s3-us-west-2.amazonaws.com/${id}.jpg`}
        style={{ float: 'left' }}
        width={150 * multiplier}
        height={250 * multiplier}
      />
      Convert food and wine
      <br />
      <ClickableList
        type={ResourceEnum.Grain}
        from={grainUsed}
        to={player?.grain}
        onClick={() => setGrainUsed(min(grainUsed + 1, player?.grain ?? 0))}
      />
      <ClickableList
        type={ResourceEnum.Flour}
        from={flourUsed}
        to={player?.flour}
        onClick={() => setFlourUsed(min(flourUsed + 1, player?.flour ?? 0))}
      />
      <ClickableList
        type={ResourceEnum.Sheep}
        from={sheepUsed}
        to={player?.sheep}
        onClick={() => setSheepUsed(min(sheepUsed + 1, player?.sheep ?? 0))}
      />
      <ClickableList
        type={ResourceEnum.Grape}
        from={grapeUsed}
        to={player?.grape}
        onClick={() => setGrapeUsed(min(grapeUsed + 1, player?.grape ?? 0))}
      />
      <ClickableList
        type={ResourceEnum.Bread}
        from={breadUsed}
        to={player?.bread}
        onClick={() => setBreadUsed(min(breadUsed + 1, player?.bread ?? 0))}
      />
      <ClickableList
        type={ResourceEnum.Penny}
        from={pennyUsed}
        to={player?.penny}
        onClick={() => setPennyUsed(min(pennyUsed + 1, player?.penny ?? 0))}
      />
      <ClickableList
        type={ResourceEnum.Nickel}
        from={nickelUsed}
        to={player?.nickel}
        onClick={() => setNickelUsed(min(nickelUsed + 1, player?.nickel ?? 0))}
      />
      <ClickableList
        type={ResourceEnum.Meat}
        from={meatUsed}
        to={player?.meat}
        onClick={() => setMeatUsed(min(meatUsed + 1, player?.meat ?? 0))}
      />
      <ClickableList
        type={ResourceEnum.Beer}
        from={beerUsed}
        to={player?.beer}
        onClick={() => setBeerUsed(min(beerUsed + 1, player?.beer ?? 0))}
      />
      <ClickableList
        type={ResourceEnum.Whiskey}
        from={whiskeyUsed}
        to={player?.whiskey}
        onClick={() => setWhiskeyUsed(min(whiskeyUsed + 1, player?.whiskey ?? 0))}
      />
      <ClickableList
        type={ResourceEnum.Wine}
        from={wineUsed}
        to={min(0, (player?.wine ?? 0) - 1)}
        onClick={() => setWineUsed(min(wineUsed + 1, player?.wine ?? 0))}
      />
      <ChevronsRight />
      <ClickableList type={ResourceEnum.Grain} to={grainUsed} onClick={() => setGrainUsed(max(0, grainUsed - 1))} />
      <ClickableList type={ResourceEnum.Flour} to={flourUsed} onClick={() => setFlourUsed(max(0, flourUsed - 1))} />
      <ClickableList type={ResourceEnum.Sheep} to={sheepUsed} onClick={() => setSheepUsed(max(0, sheepUsed - 1))} />
      <ClickableList type={ResourceEnum.Grape} to={grapeUsed} onClick={() => setGrapeUsed(max(0, grapeUsed - 1))} />
      <ClickableList type={ResourceEnum.Bread} to={breadUsed} onClick={() => setBreadUsed(max(0, breadUsed - 1))} />
      <ClickableList type={ResourceEnum.Penny} to={pennyUsed} onClick={() => setPennyUsed(max(0, pennyUsed - 1))} />
      <ClickableList type={ResourceEnum.Nickel} to={nickelUsed} onClick={() => setNickelUsed(max(0, nickelUsed - 1))} />
      <ClickableList type={ResourceEnum.Meat} to={meatUsed} onClick={() => setMeatUsed(max(0, meatUsed - 1))} />
      <ClickableList type={ResourceEnum.Beer} to={beerUsed} onClick={() => setBeerUsed(max(0, beerUsed - 1))} />
      <ClickableList
        type={ResourceEnum.Whiskey}
        to={whiskeyUsed}
        onClick={() => setWhiskeyUsed(max(0, whiskeyUsed - 1))}
      />
      <ClickableList
        type={ResourceEnum.Wine}
        to={min(0, wineUsed - 1)}
        onClick={() => setWineUsed(max(0, wineUsed - 1))}
      />
      <hr />
      <ClickableList
        type={ResourceEnum.Wine}
        from={wineUsed}
        to={player?.wine}
        onClick={() => setWineUsed(min(wineUsed + 1, player?.wine ?? 0))}
      />
      <ChevronsRight />
      <ClickableList type={ResourceEnum.Wine} to={min(wineUsed, 1)} onClick={() => setWineUsed(max(0, wineUsed - 1))} />
      <hr />
      into
      <ItemList items={join('', repeat(ResourceEnum.Nickel, Math.floor(coinsMade / 5)))} />
      <ItemList items={join('', repeat(ResourceEnum.Penny, coinsMade % 5))} />
      <hr />
      {param}
      <button
        style={{ float: 'right' }}
        className="primary"
        disabled={!includes(param, map(normalize, options))}
        onClick={handleOK(denormalizer[param])}
      >
        Settle
      </button>
    </Modal>
  )
}

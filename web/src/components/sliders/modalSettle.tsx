import { useInstanceContext } from '@/context/InstanceContext'
import { useState } from 'react'
import { Modal } from '../modal'
import { ResourceEnum } from 'hathora-et-labora-game/dist/types'
import Image from 'next/image'
import { filter, includes, join, map, max, min, range, reduce, repeat } from 'ramda'
import { ItemList } from '../itemList'
import { ChevronsRight } from 'lucide-react'
import { normalize } from 'path'
import { genDenormalize } from '../erection/util'

const multiplier = 0.75

type CLickableListProps = {
  type: ResourceEnum
  from?: number
  to?: number
  onClick: () => void
}

const ClickableList = ({ from = 0, to = 0, type, onClick }: CLickableListProps) =>
  map((n) => <ItemList key={`${type}:${n}`} items={type} onClick={onClick} />, range(from, to))

export const ModalSettle = () => {
  const { state, setPartial, addPartial, controls } = useInstanceContext()
  const partial = controls?.partial ?? []
  const id = `${partial[1].slice(0, 1)}0${partial[1].slice(2)}`
  const [open, setOpen] = useState(
    partial[0] === 'SETTLE' &&
      partial[1] !== undefined &&
      partial[2] !== undefined &&
      partial[3] !== undefined &&
      partial[4] === undefined
  )
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

  const [woodUsed, setWoodUsed] = useState(0)
  const [peatUsed, setPeatUsed] = useState(0)
  const [coalUsed, setCoalUsed] = useState(0)
  const [strawUsed, setStrawUsed] = useState(0)

  const player = state?.players[state?.frame?.currentPlayerIndex]

  const options = controls?.completion ?? []

  const denormalizer = genDenormalize(options)

  const foodUsed =
    1 * grainUsed +
    2 * sheepUsed +
    1 * grapeUsed +
    3 * breadUsed +
    1 * pennyUsed +
    5 * meatUsed +
    5 * beerUsed +
    2 * whiskeyUsed
  const energyUsed = 1 * woodUsed + 2 * peatUsed + 3 * coalUsed + 0.5 * strawUsed

  const substrings = [
    join('', repeat(ResourceEnum.Grain, grainUsed)),
    join('', repeat(ResourceEnum.Flour, flourUsed)),
    join('', repeat(ResourceEnum.Sheep, sheepUsed)),
    join('', repeat(ResourceEnum.Grape, grapeUsed)),
    join('', repeat(ResourceEnum.Bread, breadUsed)),
    join('', repeat(ResourceEnum.Penny, pennyUsed)),
    join('', repeat(ResourceEnum.Nickel, nickelUsed)),
    join('', repeat(ResourceEnum.Meat, meatUsed)),
    join('', repeat(ResourceEnum.Beer, beerUsed)),
    join('', repeat(ResourceEnum.Whiskey, whiskeyUsed)),
    join('', repeat(ResourceEnum.Wood, woodUsed)),
    join('', repeat(ResourceEnum.Peat, peatUsed)),
    join('', repeat(ResourceEnum.Coal, coalUsed)),
    join('', repeat(ResourceEnum.Straw, strawUsed)),
  ]
  const param = normalize(join('', substrings))

  const viableOptions = map<string, string>(normalize)(
    reduce<string, string[]>(
      (options, substr) => filter<string, string[]>(includes(substr), options),
      options,
      substrings
    )
  )

  const handleClose = () => {
    setPartial(['SETTLE'])
    setOpen(false)
  }

  const handleOK = (param: string) => () => {
    addPartial(param)
    setOpen(false)
  }

  return (
    <Modal closeModal={handleClose} openModal={open} close={'Cancel'}>
      <h1>Settle</h1>
      <Image
        alt={id}
        src={`https://hathora-et-labora.s3-us-west-2.amazonaws.com/${id}.jpg`}
        style={{ float: 'left' }}
        width={150 * multiplier}
        height={250 * multiplier}
      />
      Consume {foodUsed} food from
      <hr />
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
      <hr />
      and {energyUsed} energy from
      <ClickableList
        type={ResourceEnum.Wood}
        from={woodUsed}
        to={player?.wood}
        onClick={() => setWoodUsed(min(woodUsed + 1, player?.wood ?? 0))}
      />
      <ClickableList
        type={ResourceEnum.Peat}
        from={peatUsed}
        to={player?.peat}
        onClick={() => setPeatUsed(min(peatUsed + 1, player?.peat ?? 0))}
      />
      <ClickableList
        type={ResourceEnum.Coal}
        from={coalUsed}
        to={player?.coal}
        onClick={() => setCoalUsed(min(coalUsed + 1, player?.coal ?? 0))}
      />
      <ClickableList
        type={ResourceEnum.Straw}
        from={strawUsed}
        to={player?.straw}
        onClick={() => setStrawUsed(min(strawUsed + 1, player?.straw ?? 0))}
      />
      <ChevronsRight />
      <ClickableList type={ResourceEnum.Wood} to={woodUsed} onClick={() => setWoodUsed(max(0, woodUsed - 1))} />
      <ClickableList type={ResourceEnum.Peat} to={peatUsed} onClick={() => setPeatUsed(max(0, peatUsed - 1))} />
      <ClickableList type={ResourceEnum.Coal} to={coalUsed} onClick={() => setCoalUsed(max(0, coalUsed - 1))} />
      <ClickableList type={ResourceEnum.Straw} to={strawUsed} onClick={() => setStrawUsed(max(0, strawUsed - 1))} />
      <hr />
      <button
        style={{ float: 'right' }}
        className="primary"
        disabled={!includes(param, viableOptions)}
        onClick={handleOK(denormalizer[param])}
      >
        Settle
      </button>
    </Modal>
  )
}

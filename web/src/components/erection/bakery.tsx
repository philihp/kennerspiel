import { useInstanceContext } from '@/context/InstanceContext'
import { Modal } from '../modal'
import { match, P } from 'ts-pattern'
import { filter, includes, join, map, max, min, range, reduce, repeat, splitEvery } from 'ramda'
import { useState } from 'react'
import { BuildingEnum, ResourceEnum } from 'hathora-et-labora-game/dist/types'
import { genDenormalize, normalize, partiallyUsed } from './util'
import { ItemList } from '../itemList'

import { ChevronsRight } from 'lucide-react'
import { ItemRange } from '../itemRange'

const id = BuildingEnum.Bakery

export const Bakery = () => {
  const { state, setPartial, addPartial, controls } = useInstanceContext()
  const [open, setOpen] = useState(partiallyUsed([id], controls?.partial))

  const player = state?.players[state?.frame?.currentPlayerIndex]

  const [flourUsed, setFlourUsed] = useState(0)
  const [woodUsed, setWoodUsed] = useState(0)
  const [peatUsed, setPeatUsed] = useState(0)
  const [strawUsed, setStrawUsed] = useState(0)
  const [coalUsed, setCoalUsed] = useState(0)
  const [breadUsed, setBreadUsed] = useState(0)

  const powerGenerated = woodUsed + peatUsed * 2 + coalUsed * 3 + strawUsed * 0.5

  const handleClose = () => {
    setPartial(['USE'])
    setOpen(false)
  }

  const sendPartial = (param: string) => () => {
    addPartial(param)
    setOpen(false)
  }

  const options = controls?.completion ?? []
  const substrings = [
    join('', repeat(ResourceEnum.Flour, flourUsed)),
    join('', repeat(ResourceEnum.Wood, woodUsed)),
    join('', repeat(ResourceEnum.Coal, coalUsed)),
    join('', repeat(ResourceEnum.Straw, strawUsed)),
    join('', repeat(ResourceEnum.Peat, peatUsed)),
    join('', repeat(ResourceEnum.Bread, breadUsed)),
  ]
  const param = normalize(join('', substrings))
  const denormalizer = genDenormalize(options)

  const viableOptions = map<string, string>(normalize)(
    reduce<string, string[]>(
      (options, substr) => filter<string, string[]>(includes(substr), options),
      options,
      splitEvery(2, param)
    )
  )

  return (
    <Modal title="Bakery" openModal={open} closeModal={handleClose}>
      Turning {flourUsed} flour into bread
      <br />
      <ItemRange
        type={ResourceEnum.Flour}
        to={(player?.flour ?? 0) - flourUsed}
        onClick={() => setFlourUsed(min(flourUsed + 1, player?.flour ?? 0))}
      />
      <ChevronsRight />
      <ItemRange type={ResourceEnum.Flour} to={flourUsed} onClick={() => setFlourUsed(max(0, flourUsed - 1))} />
      <br />
      by generating {powerGenerated} power from burning
      <br />
      <ItemRange
        type={ResourceEnum.Wood}
        to={(player?.wood ?? 0) - woodUsed}
        onClick={() => setWoodUsed(min(woodUsed + 1, player?.wood ?? 0))}
      />
      <ItemRange
        type={ResourceEnum.Peat}
        to={(player?.peat ?? 0) - peatUsed}
        onClick={() => setPeatUsed(min(peatUsed + 1, player?.peat ?? 0))}
      />
      <ItemRange
        type={ResourceEnum.Coal}
        to={(player?.coal ?? 0) - coalUsed}
        onClick={() => setCoalUsed(min(coalUsed + 1, player?.coal ?? 0))}
      />
      <ItemRange
        type={ResourceEnum.Straw}
        to={(player?.straw ?? 0) - strawUsed}
        onClick={() => setStrawUsed(min(strawUsed + 1, player?.straw ?? 0))}
      />
      <ChevronsRight />
      <ItemRange type={ResourceEnum.Wood} to={woodUsed} onClick={() => setWoodUsed(max(0, woodUsed - 1))} />
      <ItemRange type={ResourceEnum.Peat} to={peatUsed} onClick={() => setPeatUsed(max(0, peatUsed - 1))} />
      <ItemRange type={ResourceEnum.Coal} to={coalUsed} onClick={() => setCoalUsed(max(0, coalUsed - 1))} />
      <ItemRange type={ResourceEnum.Straw} to={strawUsed} onClick={() => setStrawUsed(max(0, strawUsed - 1))} />
      <br />
      and then selling {breadUsed} bread for {breadUsed * 4} coins
      <br />
      <ItemRange
        type={ResourceEnum.Bread}
        to={min(flourUsed, 2) - breadUsed}
        onClick={() => setBreadUsed(min(breadUsed + 1, 2))}
      />
      <ChevronsRight />
      <ItemRange type={ResourceEnum.Bread} to={breadUsed} onClick={() => setBreadUsed(max(0, breadUsed - 1))} />
      <hr />
      {JSON.stringify({ param, viableOptions })}
      <div style={{ float: 'right' }}>
        <button
          className="primary"
          disabled={!includes(param, viableOptions) || param !== ''}
          onClick={sendPartial('')}
        >
          Skip
        </button>
        <button
          className="primary"
          disabled={!includes(param, viableOptions) || param === ''}
          onClick={sendPartial(param)}
        >
          Bake and Sell
        </button>
      </div>
    </Modal>
  )
}

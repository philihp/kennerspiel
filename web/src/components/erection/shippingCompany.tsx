import { useInstanceContext } from '@/context/InstanceContext'
import { Modal } from '../modal'
import { equals, findIndex, flatten, includes, join, map, max, min, range, repeat } from 'ramda'
import { useState } from 'react'
import { BuildingEnum, ResourceEnum } from 'hathora-et-labora-game/dist/types'
import { normalize, partiallyUsed } from './util'
import { ItemList } from '../itemList'

import { ChevronsRight } from 'lucide-react'
import { ItemRange } from '../itemRange'
import { take } from '../rondel/values'

const id = BuildingEnum.ShippingCompany

export const ShippingCompany = () => {
  const { state, setPartial, addPartial, controls } = useInstanceContext()
  const [open, setOpen] = useState(partiallyUsed([id], controls?.partial))
  const options = controls?.completion ?? []
  const normOptions = map(normalize, options)

  const player = state?.players[state?.frame?.currentPlayerIndex]

  const [woodUsed, setWoodUsed] = useState(0)
  const [peatUsed, setPeatUsed] = useState(0)
  const [strawUsed, setStrawUsed] = useState(0)
  const [coalUsed, setCoalUsed] = useState(0)

  const [meatUsed, setMeatUsed] = useState(0)
  const [breadUsed, setBreadUsed] = useState(0)
  const [wineUsed, setWineUsed] = useState(0)

  const powerGenerated = woodUsed + peatUsed * 2 + coalUsed * 3 + strawUsed * 0.5

  const command = normalize(
    join(
      '',
      flatten([
        repeat(ResourceEnum.Wood, woodUsed),
        repeat(ResourceEnum.Peat, peatUsed),
        repeat(ResourceEnum.Straw, strawUsed),
        repeat(ResourceEnum.Coal, coalUsed),
        repeat(ResourceEnum.Meat, meatUsed),
        repeat(ResourceEnum.Bread, breadUsed),
        repeat(ResourceEnum.Wine, wineUsed),
      ])
    )
  )

  const handleClose = () => {
    setPartial(['USE'])
    setOpen(false)
  }

  const sendPartial = () => {
    const i = findIndex(equals(command), normOptions)
    addPartial(options[i])
    setOpen(false)
  }

  return (
    <Modal title="Shipping Company" openModal={open} closeModal={handleClose}>
      Generate {powerGenerated} of 3 power from
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
      with 🃏 for {take(state?.rondel?.pointingBefore!, state?.rondel?.joker!, state?.config!)}
      <br />
      <ItemRange type={ResourceEnum.Meat} to={1 - meatUsed} onClick={() => setMeatUsed(meatUsed + 1)} />
      <ItemRange type={ResourceEnum.Bread} to={1 - breadUsed} onClick={() => setBreadUsed(breadUsed + 1)} />
      <ItemRange type={ResourceEnum.Wine} to={1 - wineUsed} onClick={() => setWineUsed(wineUsed + 1)} />
      <ChevronsRight />
      <ItemRange type={ResourceEnum.Meat} to={meatUsed} onClick={() => setMeatUsed(max(0, meatUsed - 1))} />
      <ItemRange type={ResourceEnum.Bread} to={breadUsed} onClick={() => setBreadUsed(max(0, breadUsed - 1))} />
      <ItemRange type={ResourceEnum.Wine} to={wineUsed} onClick={() => setWineUsed(max(0, wineUsed - 1))} />
      <hr />
      <div style={{ float: 'right' }}>
        <button className="primary" disabled={!includes(command, normOptions) || command !== ''} onClick={sendPartial}>
          Skip
        </button>
        <button className="primary" disabled={!includes(command, normOptions) || command === ''} onClick={sendPartial}>
          Use
        </button>
      </div>
    </Modal>
  )
}

import { useInstanceContext } from '@/context/InstanceContext'
import { Modal } from '../modal'
import { match, P } from 'ts-pattern'
import { all, filter, includes, join, map, max, min, range, reduce, repeat } from 'ramda'
import { useState } from 'react'
import { BuildingEnum, ResourceEnum } from 'hathora-et-labora-game/dist/types'
import { partiallyUsed } from './util'
import { ItemList } from '../itemList'

import classes from './index.module.css'
import Image from 'next/image'
import { ChevronRight, ChevronsRight } from 'lucide-react'

const multiplier = 1.5

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

  const button = (completion: string) =>
    match(completion)
      .with('', () => (
        <li key={completion}>
          <button className="primary" onClick={sendPartial('')}>
            <i>Skip</i>
          </button>
        </li>
      ))
      .with(P.any, (param) => (
        <li key={completion}>
          <button className="primary" onClick={sendPartial(param)}>
            <ItemList items={param} />
          </button>
        </li>
      ))
      .otherwise(() => undefined)

  const options = controls?.completion ?? []
  const substrings = [
    join('', repeat(ResourceEnum.Flour, flourUsed)),
    join('', repeat(ResourceEnum.Wood, woodUsed)),
    join('', repeat(ResourceEnum.Coal, coalUsed)),
    join('', repeat(ResourceEnum.Straw, strawUsed)),
    join('', repeat(ResourceEnum.Bread, breadUsed)),
  ]
  const param = join('', substrings)

  const viableOptions = reduce<string, string[]>(
    (options, substr) => filter<string, string[]>(includes(substr), options),
    options,
    substrings
  )

  return (
    <Modal title="Bakery" openModal={open} closeModal={handleClose}>
      Turning {flourUsed} flour into bread
      <br />
      {map(
        (n) => (
          <ItemList key={n} items="Fl" onClick={() => setFlourUsed(min(flourUsed + 1, player?.flour ?? 0))} />
        ),
        range(0, (player?.flour ?? 0) - flourUsed)
      )}
      <ChevronsRight />
      {map(
        (n) => (
          <ItemList key={n} items="Fl" onClick={() => setFlourUsed(max(0, flourUsed - 1))} />
        ),
        range(0, flourUsed)
      )}
      <br />
      by generating {powerGenerated} power from burning
      <br />
      {map(
        (n) => (
          <ItemList key={n} items="Wo" onClick={() => setWoodUsed(min(woodUsed + 1, player?.wood ?? 0))} />
        ),
        range(0, (player?.wood ?? 0) - woodUsed)
      )}
      {map(
        (n) => (
          <ItemList key={n} items="Pt" onClick={() => setPeatUsed(min(peatUsed + 1, player?.peat ?? 0))} />
        ),
        range(0, (player?.peat ?? 0) - peatUsed)
      )}
      {map(
        (n) => (
          <ItemList key={n} items="Co" onClick={() => setCoalUsed(min(coalUsed + 1, player?.coal ?? 0))} />
        ),
        range(0, (player?.coal ?? 0) - coalUsed)
      )}
      {map(
        (n) => (
          <ItemList key={n} items="Sw" onClick={() => setStrawUsed(min(strawUsed + 1, player?.straw ?? 0))} />
        ),
        range(0, (player?.straw ?? 0) - strawUsed)
      )}
      <ChevronsRight />
      {map(
        (n) => (
          <ItemList key={n} items="Wo" onClick={() => setWoodUsed(max(0, woodUsed - 1))} />
        ),
        range(0, woodUsed)
      )}
      {map(
        (n) => (
          <ItemList key={n} items="Pt" onClick={() => setPeatUsed(max(0, peatUsed - 1))} />
        ),
        range(0, peatUsed)
      )}
      {map(
        (n) => (
          <ItemList key={n} items="Co" onClick={() => setCoalUsed(max(0, coalUsed - 1))} />
        ),
        range(0, coalUsed)
      )}
      {map(
        (n) => (
          <ItemList key={n} items="Sw" onClick={() => setStrawUsed(max(0, strawUsed - 1))} />
        ),
        range(0, strawUsed)
      )}
      <br />
      and then selling {breadUsed} bread for {breadUsed * 4} coins
      <br />
      {map(
        (n) => (
          <ItemList key={n} items="Br" onClick={() => setBreadUsed(min(breadUsed + 1, 2))} />
        ),
        range(0, min(flourUsed, 2) - breadUsed)
      )}
      <ChevronsRight />
      {map(
        (n) => (
          <ItemList key={n} items="Br" onClick={() => setBreadUsed(max(0, breadUsed - 1))} />
        ),
        range(0, breadUsed)
      )}
      <hr />
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

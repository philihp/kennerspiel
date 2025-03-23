import { useInstanceContext } from '@/context/InstanceContext'
import { Modal } from '../modal'
import { equals, findIndex, includes, join, map, max, min, range, repeat } from 'ramda'
import { useState } from 'react'
import { BuildingEnum, ResourceEnum } from 'hathora-et-labora-game/dist/types'
import { normalize, partiallyUsed } from './util'
import { ItemList } from '../itemList'

import { ChevronsRight } from 'lucide-react'

const id = BuildingEnum.CloisterWorkshop

export const CloisterWorkshop = () => {
  const { state, setPartial, addPartial, controls } = useInstanceContext()
  const [open, setOpen] = useState(partiallyUsed([id], controls?.partial))
  const options = controls?.completion ?? []
  const normOptions = map(normalize, options)

  const player = state?.players[state?.frame?.currentPlayerIndex]

  const [clayUsed, setClayUsed] = useState(0)
  const [stoneUsed, setStoneUsed] = useState(0)
  const [woodUsed, setWoodUsed] = useState(0)
  const [peatUsed, setPeatUsed] = useState(0)
  const [strawUsed, setStrawUsed] = useState(0)
  const [coalUsed, setCoalUsed] = useState(0)

  const powerGenerated = woodUsed + peatUsed * 2 + coalUsed * 3 + strawUsed * 0.5

  const command = normalize(
    join('', [
      repeat(ResourceEnum.Clay, clayUsed),
      repeat(ResourceEnum.Stone, stoneUsed),
      repeat(ResourceEnum.Wood, woodUsed),
      repeat(ResourceEnum.Peat, peatUsed),
      repeat(ResourceEnum.Straw, strawUsed),
      repeat(ResourceEnum.Coal, coalUsed),
    ])
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
    <Modal title="CloisterWorkshop" openModal={open} closeModal={handleClose}>
      {map(
        (n) => (
          <ItemList key={n} items="Cl" onClick={() => setClayUsed(min(clayUsed + 1, player?.clay ?? 0))} />
        ),
        range(0, (player?.clay ?? 0) - clayUsed)
      )}
      {map(
        (n) => (
          <ItemList key={n} items="Sn" onClick={() => setStoneUsed(min(stoneUsed + 1, player?.stone ?? 0))} />
        ),
        range(0, (player?.stone ?? 0) - stoneUsed)
      )}
      <ChevronsRight />
      {map(
        (n) => (
          <ItemList key={n} items="Cl" onClick={() => setClayUsed(max(0, clayUsed - 1))} />
        ),
        range(0, clayUsed)
      )}
      {map(
        (n) => (
          <ItemList key={n} items="Sn" onClick={() => setStoneUsed(max(0, stoneUsed - 1))} />
        ),
        range(0, stoneUsed)
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

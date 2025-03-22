import { useInstanceContext } from '@/context/InstanceContext'
import { useState } from 'react'
import { Modal } from '../modal'
import { BuildingEnum, ResourceEnum } from 'hathora-et-labora-game/dist/types'
import Image from 'next/image'
import { includes, join, map, max, min, range, reduce, repeat } from 'ramda'
import { ChevronsRight } from 'lucide-react'
import { normalize, genDenormalize, partiallyUsed } from './util'
import { ItemRange } from '../itemRange'

const id = BuildingEnum.Winery

const multiplier = 0.75

export const Winery = () => {
  const { state, setPartial, addPartial, controls } = useInstanceContext()
  const [open, setOpen] = useState(partiallyUsed([id], controls?.partial))
  const [grapeUsed, setGrapeUsed] = useState(0)
  const [wineUsed, setWineUsed] = useState(0)

  const player = state?.players[state?.frame?.currentPlayerIndex]

  const options = controls?.completion ?? []

  const denormalizer = genDenormalize(options)

  const substrings = [join('', repeat(ResourceEnum.Grape, grapeUsed)), join('', repeat(ResourceEnum.Wine, wineUsed))]
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
    <Modal title="Winery" closeModal={handleClose} openModal={open} close={'Cancel'}>
      <Image
        alt={id}
        src={`https://hathora-et-labora.s3-us-west-2.amazonaws.com/${id}.jpg`}
        style={{ float: 'left' }}
        width={150 * multiplier}
        height={250 * multiplier}
      />
      Ferment grapes to wine
      <br />
      <ItemRange
        type={ResourceEnum.Grape}
        from={grapeUsed}
        to={player?.grape}
        onClick={() => setGrapeUsed(min(grapeUsed + 1, player?.grape ?? 0))}
      />
      <ChevronsRight />
      <ItemRange type={ResourceEnum.Grape} to={grapeUsed} onClick={() => setGrapeUsed(max(0, grapeUsed - 1))} />
      <ItemRange type={ResourceEnum.Wine} to={min(0, wineUsed - 1)} onClick={() => setWineUsed(max(0, wineUsed - 1))} />
      <hr />
      Then sell wine for 7 coins
      <br />
      <ItemRange
        type={ResourceEnum.Wine}
        from={wineUsed}
        to={min((player?.wine ?? 0) + wineUsed, 1)}
        onClick={() => setWineUsed(min(wineUsed + 1, player?.wine ?? 0))}
      />
      <ChevronsRight />
      <ItemRange type={ResourceEnum.Wine} to={wineUsed} onClick={() => setWineUsed(max(0, wineUsed - 1))} />
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

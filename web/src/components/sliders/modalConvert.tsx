import { useInstanceContext } from '@/context/InstanceContext'
import { ReactNode, useState } from 'react'
import { Modal } from '../modal'
import { filter, flatten, includes, join, map, reduce, repeat, splitEvery } from 'ramda'
import { match, P } from 'ts-pattern'
import { genDenormalize, normalize } from '../erection/util'
import { ItemList } from '../itemList'
import { ChevronDown, ChevronsDown } from 'lucide-react'

export const ModalConvert = () => {
  const { state, setPartial, addPartial, controls } = useInstanceContext()
  const partial = controls?.partial ?? []
  const [open, setOpen] = useState(partial[0] === 'CONVERT' && partial[2] === undefined)

  const player = state?.players?.[state?.frame?.currentPlayerIndex]

  const [wineUsed, setWineUsed] = useState(0)
  const [grainUsed, setGrainUsed] = useState(0)
  const [nickelUsed, setNickelUsed] = useState(0)
  const [pennyUsed, setPennyUsed] = useState(0)
  const [whiskeyUsed, setWhiskeyUsed] = useState(0)

  const options = controls?.completion ?? []

  const param = normalize(
    join(
      '',
      flatten([
        //
        repeat('Wn', wineUsed),
        repeat('Gn', grainUsed),
        repeat('Ni', nickelUsed),
        repeat('Pn', pennyUsed),
        repeat('Wh', whiskeyUsed),
      ])
    )
  )
  const viableOptions = map<string, string>(normalize)(
    reduce<string, string[]>(
      (options, substr) => filter<string, string[]>(includes(substr), options),
      options,
      splitEvery(2, param)
    )
  )
  const denormalizer = genDenormalize(options)

  const handleClose = () => {
    setPartial([])
    setOpen(false)
  }

  const handleOK = (param: string) => () => {
    addPartial(param)
  }

  return (
    <Modal title="Convert" closeModal={handleClose} openModal={open} close={'Cancel'}>
      <ItemList
        items={join('', repeat('Pn', (player?.penny ?? 0) - pennyUsed))}
        onClick={() => setPennyUsed(pennyUsed + 1)}
      />
      <ItemList
        items={join('', repeat('Wn', (player?.wine ?? 0) - wineUsed))}
        onClick={() => setWineUsed(wineUsed + 1)}
      />
      <ItemList
        items={join('', repeat('Gn', (player?.grain ?? 0) - grainUsed))}
        onClick={() => setGrainUsed(grainUsed + 1)}
      />
      <ItemList
        items={join('', repeat('Ni', (player?.nickel ?? 0) - nickelUsed))}
        onClick={() => setNickelUsed(nickelUsed + 1)}
      />
      <ItemList
        items={join('', repeat('Wh', (player?.whiskey ?? 0) - whiskeyUsed))}
        onClick={() => setWhiskeyUsed(whiskeyUsed + 1)}
      />
      <br />
      <ChevronsDown />
      <br />
      <ItemList items={join('', repeat('Pn', pennyUsed))} onClick={() => setPennyUsed(pennyUsed - 1)} />
      <ItemList items={join('', repeat('Wn', wineUsed))} onClick={() => setWineUsed(wineUsed - 1)} />
      <ItemList items={join('', repeat('Gn', grainUsed))} onClick={() => setGrainUsed(grainUsed - 1)} />
      <ItemList items={join('', repeat('Ni', nickelUsed))} onClick={() => setNickelUsed(nickelUsed - 1)} />
      <ItemList items={join('', repeat('Wh', whiskeyUsed))} onClick={() => setWhiskeyUsed(whiskeyUsed - 1)} />
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
    </Modal>
  )
}

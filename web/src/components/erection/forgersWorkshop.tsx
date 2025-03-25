import { useInstanceContext } from '@/context/InstanceContext'
import { Modal } from '../modal'
import { equals, findIndex, flatten, includes, join, map, max, min, range, repeat } from 'ramda'
import { useState } from 'react'
import { BuildingEnum, ResourceEnum } from 'hathora-et-labora-game/dist/types'
import { normalize, partiallyUsed } from './util'

import { ChevronsRight } from 'lucide-react'
import { ItemRange } from '../itemRange'
import { take } from '../rondel/values'

const id = BuildingEnum.ForgersWorkshop

export const ForgersWorkshop = () => {
  const { state, setPartial, addPartial, controls } = useInstanceContext()
  const [open, setOpen] = useState(partiallyUsed([id], controls?.partial))
  const options = controls?.completion ?? []
  const normOptions = map(normalize, options)

  const player = state?.players[state?.frame?.currentPlayerIndex]

  const [pennyUsed, setPennyUsed] = useState(0)
  const [nickelUsed, setNickelUsed] = useState(0)
  const [whiskeyUsed, setWhiskeyUsed] = useState(0)
  const [wineUsed, setWineUsed] = useState(0)

  const coinsGenerated = pennyUsed + nickelUsed * 5 + wineUsed * 1 + whiskeyUsed * 1

  const command = normalize(
    join(
      '',
      flatten([
        repeat(ResourceEnum.Penny, pennyUsed),
        repeat(ResourceEnum.Nickel, nickelUsed),
        repeat(ResourceEnum.Whiskey, whiskeyUsed),
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
    <Modal title="Forger's Workshop" openModal={open} closeModal={handleClose}>
      <ItemRange
        type={ResourceEnum.Penny}
        to={(player?.penny ?? 0) - pennyUsed}
        onClick={() => setPennyUsed(min(pennyUsed + 1, player?.penny ?? 0))}
      />
      <ItemRange
        type={ResourceEnum.Nickel}
        to={(player?.nickel ?? 0) - nickelUsed}
        onClick={() => setNickelUsed(min(nickelUsed + 1, player?.nickel ?? 0))}
      />
      <ItemRange
        type={ResourceEnum.Wine}
        to={(player?.wine ?? 0) - wineUsed}
        onClick={() => setWineUsed(min(wineUsed + 1, player?.wine ?? 0))}
      />
      <ItemRange
        type={ResourceEnum.Whiskey}
        to={(player?.whiskey ?? 0) - whiskeyUsed}
        onClick={() => setWhiskeyUsed(min(whiskeyUsed + 1, player?.whiskey ?? 0))}
      />
      <ChevronsRight />
      <ItemRange type={ResourceEnum.Penny} to={pennyUsed} onClick={() => setPennyUsed(max(0, pennyUsed - 1))} />
      <ItemRange type={ResourceEnum.Nickel} to={nickelUsed} onClick={() => setNickelUsed(max(0, nickelUsed - 1))} />
      <ItemRange type={ResourceEnum.Wine} to={wineUsed} onClick={() => setWineUsed(max(0, wineUsed - 1))} />
      <ItemRange type={ResourceEnum.Whiskey} to={whiskeyUsed} onClick={() => setWhiskeyUsed(max(0, whiskeyUsed - 1))} />
      <br />
      Spending {coinsGenerated} for
      <br />
      <ItemRange type={ResourceEnum.Reliquary} to={Math.round(coinsGenerated / 10)} />
      <br />
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

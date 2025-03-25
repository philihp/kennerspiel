/*

TODO: use this if you ever refactor the game logic to be a 1 param building

*/

import { useInstanceContext } from '@/context/InstanceContext'
import { Modal } from '../modal'
import { equals, findIndex, flatten, includes, join, map, max, min, range, repeat } from 'ramda'
import { useState } from 'react'
import { BuildingEnum, ResourceEnum } from 'hathora-et-labora-game/dist/types'
import { normalize, partiallyUsed } from './util'

import { ChevronsRight } from 'lucide-react'
import { ItemRange } from '../itemRange'

const id = BuildingEnum.PilgrimageSite

const MAX_UPGRADES = 2

export const PilgrimageSite = () => {
  const { state, setPartial, addPartial, controls } = useInstanceContext()
  const [open, setOpen] = useState(partiallyUsed([id], controls?.partial))
  const options = controls?.completion ?? []
  const normOptions = map(normalize, options)

  const player = state?.players[state?.frame?.currentPlayerIndex]

  const [bookUsed, setBookUsed] = useState(0)
  const [ceramicUsed, setCeramicUsed] = useState(0)
  const [ornamentUsed, setOrnamentUsed] = useState(0)
  const totalUsed = bookUsed + ceramicUsed + ornamentUsed

  const command = normalize(
    join(
      '',
      flatten([
        repeat(ResourceEnum.Book, bookUsed),
        repeat(ResourceEnum.Ceramic, ceramicUsed),
        repeat(ResourceEnum.Ornament, ornamentUsed),
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
  }

  return (
    <Modal title="Pilgrimage Site" openModal={open} closeModal={handleClose}>
      First upgrade
      <br />
      {
        // <ItemRange
        //   type={ResourceEnum.Book}
        //   to={min(MAX_UPGRADES - totalUsed, player?.book ?? 0)}
        //   onClick={() => setBookUsed(min(bookUsed + 1, player?.book ?? 0))}
        // />
        // <ChevronsRight />
        // <ItemRange type={ResourceEnum.Book} to={bookUsed} onClick={() => setBookUsed(max(0, bookUsed - 1))} />
        // <br />
        // <ItemRange
        //   type={ResourceEnum.Ceramic}
        //   to={min(MAX_UPGRADES - totalUsed, bookUsed + (player?.ceramic ?? 0))}
        //   onClick={() => setCeramicUsed(min(ceramicUsed + 1, player?.ceramic ?? 0))}
        // />
        // <ChevronsRight />
        // <ItemRange type={ResourceEnum.Ceramic} to={ceramicUsed} onClick={() => setCeramicUsed(max(0, ceramicUsed - 1))} />
        // <br />
        // <ItemRange
        //   type={ResourceEnum.Ornament}
        //   to={min(MAX_UPGRADES - totalUsed, player?.ornament ?? 0)}
        //   onClick={() => setOrnamentUsed(min(ornamentUsed + 1, player?.ornament ?? 0))}
        // />
        // <ChevronsRight />
        // <ItemRange
        //   type={ResourceEnum.Ornament}
        //   to={ornamentUsed}
        //   onClick={() => setOrnamentUsed(max(0, ornamentUsed - 1))}
        // />
      }
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

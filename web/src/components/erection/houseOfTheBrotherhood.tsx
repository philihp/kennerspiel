import { useInstanceContext } from '@/context/InstanceContext'
import { Modal } from '../modal'
import { any, equals, findIndex, includes, join, map, max, repeat } from 'ramda'
import { useState } from 'react'
import { BuildingEnum, ResourceEnum } from 'hathora-et-labora-game/dist/types'
import { normalize, partiallyUsed } from './util'

import { ChevronsRight } from 'lucide-react'
import { ItemRange } from '../itemRange'

const id = BuildingEnum.HouseOfTheBrotherhood

export const HouseOfTheBrotherhood = () => {
  const { state, setPartial, addPartial, controls } = useInstanceContext()
  const [open, setOpen] = useState(partiallyUsed([id], controls?.partial))
  const options = controls?.completion ?? []
  const normOptions = map(normalize, options)

  const player = state?.players[state?.frame?.currentPlayerIndex]

  const [pennyUsed, setPennyUsed] = useState(0)
  const [nickelUsed, setNickelUsed] = useState(0)
  const [whiskeyUsed, setWhiskeyUsed] = useState(0)
  const [wineUsed, setWineUsed] = useState(0)

  const [bookUsed, setBookUsed] = useState(0)
  const [ceramicUsed, setCeramicUsed] = useState(0)
  const [ornamentUsed, setOrnamentUsed] = useState(0)
  const [reliquaryUsed, setReliquaryUsed] = useState(0)

  const selectParam1 = controls?.partial?.length === 2
  const selectParam2 = controls?.partial?.length === 3

  const coinsSpent = 1 * pennyUsed + 5 * nickelUsed + 2 * whiskeyUsed + 1 * wineUsed

  const resources1 = map(join(''), [
    repeat(ResourceEnum.Penny, pennyUsed),
    repeat(ResourceEnum.Nickel, nickelUsed),
    repeat(ResourceEnum.Whiskey, whiskeyUsed),
    repeat(ResourceEnum.Wine, wineUsed),
  ])
  const resources2 = map(join(''), [
    repeat(ResourceEnum.Book, bookUsed),
    repeat(ResourceEnum.Ceramic, ceramicUsed),
    repeat(ResourceEnum.Ornament, ornamentUsed),
    repeat(ResourceEnum.Reliquary, reliquaryUsed),
  ])

  const command1 = normalize(join('', resources1))
  const command2 = normalize(join('', resources2))

  const canSelectBook = any(includes(normalize(`Bo${command2}`)), normOptions)
  const canSelectCeramic = any(includes(normalize(`Ce${command2}`)), normOptions)
  const canSelectOrnament = any(includes(normalize(`Or${command2}`)), normOptions)
  const canSelectReliquary = any(includes(normalize(`Rq${command2}`)), normOptions)

  const handleClose = () => {
    setPartial(['USE'])
    setOpen(false)
  }

  const sendParam1 = () => {
    const i = findIndex(equals(command1), normOptions)
    addPartial(options[i])
  }

  const sendParam2 = () => {
    const i = findIndex(equals(command2), normOptions)
    addPartial(options[i])
    setOpen(false)
  }

  return (
    <Modal title="House of the Brotherhood" openModal={open} closeModal={handleClose}>
      Pay {coinsSpent} of 5 coins from
      <br />
      {selectParam1 ? (
        <>
          <ItemRange type={ResourceEnum.Penny} to={player?.penny ?? 0} onClick={() => setPennyUsed(pennyUsed + 1)} />
          <ItemRange
            type={ResourceEnum.Nickel}
            to={player?.nickel ?? 0}
            onClick={() => setNickelUsed(nickelUsed + 1)}
          />
          <ItemRange
            type={ResourceEnum.Whiskey}
            to={player?.whiskey ?? 0}
            onClick={() => setWhiskeyUsed(whiskeyUsed + 1)}
          />
          <ItemRange type={ResourceEnum.Wine} to={player?.wine ?? 0} onClick={() => setWineUsed(wineUsed + 1)} />
          <ChevronsRight />
          <ItemRange type={ResourceEnum.Penny} to={pennyUsed} onClick={() => setPennyUsed(max(0, pennyUsed - 1))} />
          <ItemRange type={ResourceEnum.Nickel} to={nickelUsed} onClick={() => setNickelUsed(max(0, nickelUsed - 1))} />
          <ItemRange type={ResourceEnum.Whiskey} to={wineUsed} onClick={() => setWineUsed(max(0, wineUsed - 1))} />
          <ItemRange type={ResourceEnum.Wine} to={wineUsed} onClick={() => setWineUsed(max(0, wineUsed - 1))} />
        </>
      ) : (
        <>
          <ChevronsRight />
          <ItemRange type={ResourceEnum.Penny} to={pennyUsed} />
          <ItemRange type={ResourceEnum.Nickel} to={nickelUsed} />
          <ItemRange type={ResourceEnum.Whiskey} to={wineUsed} />
          <ItemRange type={ResourceEnum.Wine} to={wineUsed} />
        </>
      )}
      <br />
      {selectParam2 && (
        <>
          for
          <br />
          <ItemRange type={ResourceEnum.Book} to={canSelectBook ? 1 : 0} onClick={() => setBookUsed(bookUsed + 1)} />
          <ItemRange
            type={ResourceEnum.Ceramic}
            to={canSelectCeramic ? 1 : 0}
            onClick={() => setCeramicUsed(ceramicUsed + 1)}
          />
          <ItemRange
            type={ResourceEnum.Ornament}
            to={canSelectOrnament ? 1 : 0}
            onClick={() => setOrnamentUsed(ornamentUsed + 1)}
          />
          <ItemRange
            type={ResourceEnum.Reliquary}
            to={canSelectReliquary ? 1 : 0}
            onClick={() => setReliquaryUsed(reliquaryUsed + 1)}
          />
          <ChevronsRight />
          <ItemRange type={ResourceEnum.Book} to={bookUsed} onClick={() => setBookUsed(max(0, bookUsed - 1))} />
          <ItemRange
            type={ResourceEnum.Ceramic}
            to={ceramicUsed}
            onClick={() => setCeramicUsed(max(0, ceramicUsed - 1))}
          />
          <ItemRange
            type={ResourceEnum.Ornament}
            to={ornamentUsed}
            onClick={() => setOrnamentUsed(max(0, ornamentUsed - 1))}
          />
          <ItemRange
            type={ResourceEnum.Reliquary}
            to={reliquaryUsed}
            onClick={() => setReliquaryUsed(max(0, reliquaryUsed - 1))}
          />
        </>
      )}
      <hr />
      <div style={{ float: 'right' }}>
        {selectParam1 && (
          <>
            <button
              className="primary"
              disabled={!includes(command1, normOptions) || command1 !== ''}
              onClick={sendParam1}
            >
              Skip
            </button>
            <button
              className="primary"
              disabled={!includes(command1, normOptions) || command1 === ''}
              onClick={sendParam1}
            >
              Use
            </button>
          </>
        )}
        {selectParam2 && (
          <>
            <button
              className="primary"
              disabled={!includes(command2, normOptions) || command2 === ''}
              onClick={sendParam2}
            >
              Use
            </button>
          </>
        )}
      </div>
    </Modal>
  )
}

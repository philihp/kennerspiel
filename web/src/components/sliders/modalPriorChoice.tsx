import { useInstanceContext } from '@/context/InstanceContext'
import { ReactNode, useState } from 'react'
import { Modal } from '../modal'
import { map } from 'ramda'
import Image from 'next/image'
import { decolor } from '../erection'
import { PlayerDot } from '../playerDot'
import { Clergy } from '../clergy'
import { match } from 'ts-pattern'

const multiplier = 0.75

export const ModalPriorChoice = () => {
  const { state, addPartial, controls, active } = useInstanceContext()
  const [open, setOpen] = useState(active)

  const activePlayer = state?.players?.[state?.frame.activePlayerIndex]
  const currentPlayer = state?.players?.[state?.frame.currentPlayerIndex]
  const id = state?.frame?.usableBuildings?.[0]

  const options = controls?.completion ?? []

  const handleClose = () => {
    setOpen(false)
  }

  const handleOK = (param: string) => () => {
    addPartial(param)
    setOpen(false)
  }

  return (
    <>
      <Modal title="Work Contract" closeModal={handleClose} openModal={open} close={'Cancel'}>
        <Image
          alt={`${id}`}
          src={`https://hathora-et-labora.s3-us-west-2.amazonaws.com/${decolor(id)}.jpg`}
          style={{ float: 'right' }}
          width={150 * multiplier}
          height={250 * multiplier}
        />
        <PlayerDot color={currentPlayer?.color} /> Player has issued a work contract.
        <br />
        <br />
        You may send either your prior or a laybrother
        <br />
        <>
          {map<string, ReactNode>(
            (param) =>
              match(param)
                .with('WITH_PRIOR', () => (
                  <button key={param} className="primary" onClick={handleOK(param)}>
                    <Clergy id={`PRI${activePlayer?.color}`} />
                    Prior
                  </button>
                ))
                .with('WITH_LAYBROTHER', () => (
                  <button key={param} className="primary" onClick={handleOK(param)}>
                    <Clergy id={`LB1${activePlayer?.color}`} />
                    Laybrother
                  </button>
                ))
                .otherwise(() => <></>),
            options
          )}
        </>
      </Modal>
    </>
  )
}

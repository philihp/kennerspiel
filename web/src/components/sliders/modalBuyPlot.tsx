import { useInstanceContext } from '@/context/InstanceContext'
import { ReactNode, useState } from 'react'
import { Modal } from '../modal'
import { map } from 'ramda'
import { match, P } from 'ts-pattern'

export const ModalBuyPlot = () => {
  const { setPartial, addPartial, controls } = useInstanceContext()
  const partial = controls?.partial ?? []
  const [open, setOpen] = useState(partial[0] === 'BUY_PLOT' && partial[2] === undefined)

  const options = controls?.completion ?? []

  const handleClose = () => {
    setPartial([])
    setOpen(false)
  }

  const handleOK = (param: string) => () => {
    addPartial(param)
  }

  return match(partial)
    .with(['BUY_PLOT'], () => (
      <Modal closeModal={handleClose} openModal={open} close={'Cancel'}>
        <h1>Buy Plot</h1>
        Which Row?
        <ul>
          {map<string, ReactNode>(
            (param) => (
              <li key={param}>
                <button className="primary" onClick={handleOK(param)}>
                  {param}
                </button>
              </li>
            ),
            options
          )}
        </ul>
      </Modal>
    ))
    .with(['BUY_PLOT', P.string], () => (
      <Modal closeModal={handleClose} openModal={open} close={'Cancel'}>
        <h1>Buy Plot</h1>
        Coast or Mountain?
        <ul>
          {map<string, ReactNode>(
            (param) => (
              <li key={param}>
                <button className="primary" onClick={handleOK(param)}>
                  {param}
                </button>
              </li>
            ),
            options
          )}
        </ul>
      </Modal>
    ))
    .otherwise(() => <></>)
}

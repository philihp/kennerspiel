import { useInstanceContext } from '@/context/InstanceContext'
import { ReactNode, useState } from 'react'
import { Modal } from '../modal'
import { map } from 'ramda'
import { match, P } from 'ts-pattern'
import { TinyLandscape } from './tinyLandscape'
import { LandEnum } from 'hathora-et-labora-game/dist/types'

export const ModalBuyPlot = () => {
  const { state, setPartial, addPartial, controls } = useInstanceContext()
  const partial = controls?.partial ?? []
  const [open, setOpen] = useState(partial[0] === 'BUY_PLOT' && partial[2] === undefined)
  const player = state?.players?.[state?.frame.activePlayerIndex]
  if (player === undefined) return
  const { landscape, landscapeOffset } = player

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
        <TinyLandscape landscape={landscape} offset={landscapeOffset} />
      </Modal>
    ))
    .with(['BUY_PLOT', P.string], () => (
      <Modal closeModal={handleClose} openModal={open} close={'Cancel'}>
        <h1>Buy Plot</h1>
        {map(
          (option: string) =>
            match(option)
              .with('COAST', () => (
                <button key={option} className="primary" onClick={handleOK(option)}>
                  <TinyLandscape
                    landscape={[
                      [[LandEnum.Water], [LandEnum.Coast]],
                      [[LandEnum.Water], [LandEnum.Coast]],
                    ]}
                    rowMin={0}
                    rowMax={1}
                  />
                </button>
              ))
              .with('MOUNTAIN', () => (
                <button key={option} className="primary" onClick={handleOK(option)}>
                  <TinyLandscape
                    landscape={[
                      [[LandEnum.Hillside], [LandEnum.Mountain]],
                      [[LandEnum.Hillside], [LandEnum.BelowMountain]],
                    ]}
                    offset={landscapeOffset}
                    rowMin={0}
                    rowMax={1}
                  />
                </button>
              ))
              .otherwise(() => <></>),
          options
        )}
      </Modal>
    ))
    .otherwise(() => <></>)
}

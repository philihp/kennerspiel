import { useInstanceContext } from '@/context/InstanceContext'
import { ReactNode, useState } from 'react'
import { Modal } from '../modal'
import { map } from 'ramda'
import { match, P } from 'ts-pattern'
import { TinyLandscape } from './tinyLandscape'
import { BuildingEnum, LandEnum } from 'hathora-et-labora-game/dist/types'

export const ModalBuyDistrict = () => {
  const { state, setPartial, addPartial, controls } = useInstanceContext()
  const partial = controls?.partial ?? []
  const [open, setOpen] = useState(partial[0] === 'BUY_DISTRICT' && partial[2] === undefined)
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
    .with(['BUY_DISTRICT'], () => (
      <Modal closeModal={handleClose} openModal={open} close={'Cancel'}>
        <h1>Buy District</h1>
        Which row?
        <TinyLandscape landscape={landscape} offset={landscapeOffset} />
      </Modal>
    ))
    .with(['BUY_DISTRICT', P.string], () => (
      <Modal closeModal={handleClose} openModal={open} close={'Cancel'}>
        <h1>Buy District</h1>
        {map<string, ReactNode>(
          (param) =>
            match(param)
              .with('PLAINS', () => (
                <button className="primary" onClick={handleOK(param)} key={param}>
                  <TinyLandscape
                    landscape={[
                      [
                        [LandEnum.Plains, BuildingEnum.Forest],
                        [LandEnum.Plains],
                        [LandEnum.Plains],
                        [LandEnum.Plains],
                        [LandEnum.Hillside],
                      ],
                    ]}
                    rowMin={0}
                    rowMax={0}
                    showTerrain
                  />
                </button>
              ))
              .with('HILLS', () => (
                <button className="primary" onClick={handleOK(param)} key={param}>
                  <TinyLandscape
                    landscape={[
                      [
                        [LandEnum.Plains, BuildingEnum.Moor],
                        [LandEnum.Plains, BuildingEnum.Forest],
                        [LandEnum.Plains, BuildingEnum.Forest],
                        [LandEnum.Hillside],
                        [LandEnum.Hillside],
                      ],
                    ]}
                    rowMin={0}
                    rowMax={0}
                    showTerrain
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

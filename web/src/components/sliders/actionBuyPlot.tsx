import { useInstanceContext } from '@/context/InstanceContext'
import classes from './actions.module.css'
import { ModalBuyPlot } from './modalBuyPlot'
import { includes } from 'ramda'

export const ActionBuyPlot = () => {
  const { controls, addPartial, active } = useInstanceContext()

  const handleClick = () => {
    addPartial('BUY_PLOT')
  }

  const completion = controls?.completion ?? []
  const disabled = !active || !completion.includes('BUY_PLOT')
  const partial = controls?.partial ?? []
  const showModal = partial[0] === 'BUY_PLOT' && !includes('', completion)

  return (
    <>
      <button type="button" disabled={disabled} className={`${classes.action}`} onClick={handleClick}>
        Buy Plot
      </button>
      {showModal && <ModalBuyPlot />}
    </>
  )
}

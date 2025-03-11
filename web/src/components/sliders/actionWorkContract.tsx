import { useTranslations } from 'next-intl'
import { useInstanceContext } from '@/context/InstanceContext'
import classes from './actions.module.css'

export const ActionWorkContract = () => {
  const t = useTranslations('components/sliders')

  const { controls, addPartial, active } = useInstanceContext()

  const handleClick = () => {
    addPartial('WORK_CONTRACT')
  }

  const disabled = !active || !(controls?.completion ?? []).includes('WORK_CONTRACT')

  return (
    <button type="button" disabled={disabled} className={`${classes.action} ${classes.primary}`} onClick={handleClick}>
      {t('work-contract')}
    </button>
  )
}

import { useTranslations } from 'next-intl'
import { useInstanceContext } from '@/context/InstanceContext'
import classes from './actions.module.css'

export const ActionFellTrees = () => {
  const t = useTranslations('components/sliders')

  const { controls, addPartial, active } = useInstanceContext()

  const handleClick = () => {
    addPartial('FELL_TREES')
  }

  const disabled = !active || !(controls?.completion ?? []).includes('FELL_TREES')

  return (
    <button type="button" disabled={disabled} className={`${classes.action} ${classes.primary}`} onClick={handleClick}>
      {t('fell-trees')}
    </button>
  )
}

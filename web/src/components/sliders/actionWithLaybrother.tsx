import { useTranslations } from 'next-intl'
import { useInstanceContext } from '@/context/InstanceContext'
import classes from './actions.module.css'

export const ActionWithLaybrother = () => {
  const t = useTranslations('components/sliders')

  const { controls, addPartial, active } = useInstanceContext()

  const handleClick = () => {
    addPartial('WITH_LAYBROTHER')
  }

  const disabled = !active || !(controls?.completion ?? []).includes('WITH_LAYBROTHER')

  return (
    <button type="button" disabled={disabled} className={`primary ${classes.action}`} onClick={handleClick}>
      {t('with-laybrother')}
    </button>
  )
}

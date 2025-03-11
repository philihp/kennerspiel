import { useTranslations } from 'next-intl'
import { useInstanceContext } from '@/context/InstanceContext'
import { range } from 'ramda'

export const UnbuiltWonders = () => {
  const t = useTranslations('components')

  const { state } = useInstanceContext()
  if (state === undefined) return <></>
  const { wonders } = state

  return (
    <div>
      {t('wonders-fragment')}
      {range(0, wonders).map((n) => (
        <span key={n}>🖼️</span>
      ))}
    </div>
  )
}

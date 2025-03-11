import { useTranslations } from 'next-intl'
import { ReactNode, useEffect, useRef } from 'react'
import classes from './frameModal.module.css'

type Params = {
  openModal?: boolean
  closeModal?: () => void
  children: ReactNode | ReactNode[]
}

export const FrameModal = ({ children, openModal = false, closeModal = () => {} }: Params) => {
  const t = useTranslations('components')

  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (dialog === null) return
    if (openModal) {
      dialog.showModal()
      dialog.addEventListener('click', ({ clientY, clientX }) => {
        const { top, height, left, width } = dialog.getBoundingClientRect()
        if (top > clientY || clientY > top + height || left > clientX || clientX > left + width) closeModal?.()
      })
    } else {
      dialog.close()
    }
  }, [openModal, closeModal])

  return (
    <dialog ref={ref} onCancel={closeModal} className={classes.frameModal}>
      {children}
      <form method="dialog" style={{ textAlign: 'right' }}>
        <button type="button" onClick={closeModal} className="primary">
          {t('close-button')}
        </button>
      </form>
    </dialog>
  )
}

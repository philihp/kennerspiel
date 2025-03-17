import { ReactNode, useEffect, useRef } from 'react'
import classes from './modal.module.css'

type Params = {
  title?: string
  openModal?: boolean
  closeModal?: () => void
  close?: string
  children: ReactNode | ReactNode[]
}

export const Modal = ({ title, children, openModal = false, closeModal = () => {}, close = undefined }: Params) => {
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
      {title && <h1>{title}</h1>}
      {children}
    </dialog>
  )
}

'use client'

import { Board } from './board'
import { useInstanceContext } from '@/context/InstanceContext'

type InstanceParams = {
  params: {
    slug: string
  }
}

export const ClientPresenter = ({ params: { slug } }: InstanceParams) => {
  const { user } = useInstanceContext()
  const userId = user?.id
  return <Board />
}

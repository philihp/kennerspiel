import type { Metadata } from 'next'
import { InstanceView } from '../../instance/[slug]/instanceView'

// dark launch: nothing links here yet, and search engines should not index it
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

type MatchParams = { params: Promise<{ id: string }> }

const MatchPage = async (props: MatchParams) => {
  const { id } = await props.params
  return <InstanceView id={id} isometric={true} />
}

export default MatchPage

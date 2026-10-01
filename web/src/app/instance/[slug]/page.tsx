'use server'

import { InstanceView } from './instanceView'

type InstanceParams = { params: Promise<{ slug: string }> }

const InstancePage = async (props: InstanceParams) => {
  const { slug } = await props.params
  return <InstanceView id={slug} isometric={false} />
}

export default InstancePage

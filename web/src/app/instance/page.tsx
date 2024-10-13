'use server'

import { CreateButton } from './createButton'
import { InstancesList } from './instancesList'

const InstancePage = async () => {
  return (
    <>
      <section>
        <InstancesList />
      </section>
      <section>
        <CreateButton />
      </section>
    </>
  )
}

export default InstancePage

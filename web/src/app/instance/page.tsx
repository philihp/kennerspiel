'use client'

import { CreateButton } from './createButton'
import { InstancesList } from './instancesList'
import { createInstance } from './actions'

const InstancePage = () => {
  return (
    <>
      <section>
        {<InstancesList />}
      </section>
      <section>
        <form action={createInstance}>
          <CreateButton />
        </form>
      </section>
    </>
  )
}

export default InstancePage

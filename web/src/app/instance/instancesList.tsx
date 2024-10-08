'use client'

type Instance = {
  id: string
  created_at: string
  commands: string[]
}

export const InstancesList = ({ instances }: { instances: Instance[] }) => {
  return (
    <ul>
      {instances.map((instance) => (
        <li key={instance.id}>
          <a href={`instance/${instance.id}`}>{instance.id}</a>
        </li>
      ))}
      {instances.length === 0 && (
        <li>
          <i>(none)</i>
        </li>
      )}
    </ul>
  )
}

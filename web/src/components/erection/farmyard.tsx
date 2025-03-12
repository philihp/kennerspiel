import { useInstanceContext } from '@/context/InstanceContext'

export const Farmyard = () => {
  const { addPartial } = useInstanceContext()
  return (
    <>
      <button className="primary" onClick={() => addPartial('Sh')}>
        Sheep
      </button>
      <button className="primary" onClick={() => addPartial('Gn')}>
        Grain
      </button>
    </>
  )
}

import { useInstanceContext } from '@/context/InstanceContext'

export const Farmyard = () => {
  const { addPartial } = useInstanceContext()

  const sendPartial = (type: 'Sh' | 'Gn') => () => {
    addPartial(type)
  }

  return (
    <>
      <button className="primary" onClick={sendPartial('Sh')}>
        Sheep
      </button>
      <button className="primary" onClick={sendPartial('Gn')}>
        Grain
      </button>
    </>
  )
}

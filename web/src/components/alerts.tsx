import { useInstanceContext } from '@/context/InstanceContext'
import { CircleAlert } from 'lucide-react'

export const Alerts = () => {
  const { state } = useInstanceContext()
  return (
    <>
      {/* <pre>{JSON.stringify(state?.frame, null, 2)}</pre> */}
      {state?.frame?.neutralBuildingPhase && (
        <div
          style={{
            float: 'right',
            backgroundColor: 'rgba(82, 0, 57, 0.19)',
            borderRadius: 16,
            borderColor: 'rgba(82, 0, 57, 0.49)',
            borderWidth: 1,
            borderStyle: 'solid',

            padding: 8,
          }}
        >
          <br />
          <CircleAlert size={24} style={{ float: 'right' }} />
          <h2>Neutral Building Phase</h2>
          <p>
            Currently in a special phase where all unbuilt buildings can and must be built onto the neutral player
            board. Buildings can replace existing buildings, and afterward the player can issue a work contract to use
            any newly built building with the neutral player&apos;s prior, if available.
          </p>
        </div>
      )}
    </>
  )
}

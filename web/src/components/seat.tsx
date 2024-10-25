import { User } from '@supabase/supabase-js'

import { Clergy } from '@/components/clergy'
import { useInstanceContext } from '@/context/InstanceContext'
import { Enums, Tables } from '@/supabase.types'
import { join } from '@/app/instance/[slug]/actions'
import { find, propEq } from 'ramda'

export interface SeatProps {
  clergyId: string
  color: Enums<'color'>
}

export const Seat = ({ clergyId, color }: SeatProps) => {
  const { user, instance, entrants } = useInstanceContext()
  const entrant = find<Tables<'entrant'>>(propEq(color, 'color'))(entrants)
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <button type="button" disabled={!!entrant} onClick={() => join(instance.id, color)}>
        Pick Color
      </button>
      {user ? (
        <>
          <Clergy
            id={clergyId}
            style={{
              backgroundImage: `url(${user.id})`,
              height: 36,
              width: 36,
              backgroundSize: 36,
              borderRadius: 18,
              borderWidth: 3,
            }}
          />
          {entrant?.profile_id}
          {/* {user.email} */}
          {/* {user?.id && user?.id === me?.id && ( */}
          {/* <button
            type="button"
            onClick={() => {
              // if (users.length === 2 && state?.config?.country !== undefined) {
              //   config(state?.config?.country, EngineLength.long)
              // }
              // join()
            }}
          >
            x
          </button> */}
          {/* )} */}
        </>
      ) : (
        <Clergy
          id={clergyId}
          style={{
            height: 36,
            width: 36,
            borderRadius: 18,
            borderWidth: 4,
          }}
        />
      )}
    </div>
  )
}

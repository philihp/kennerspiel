import { User } from '@supabase/supabase-js'

import { Clergy } from '@/components/clergy'
import { useInstanceContext } from '@/context/InstanceContext'
import { Tables } from '@/supabase.types'
import { MouseEventHandler } from 'react'

export interface SeatProps {
  clergyId: string
  entrant?: Pick<Tables<'entrant'>, 'color' | 'profile_id'>
  onClick: MouseEventHandler<HTMLButtonElement>
  onLeave?: MouseEventHandler<HTMLButtonElement>
}

export const Seat = ({ clergyId, entrant, onClick, onLeave }: SeatProps) => {
  const { user } = useInstanceContext()

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <button type="button" disabled={!!entrant} onClick={onClick}>
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
          {/* {JSON.stringify({entrant: entrant?.profile_id})} */}
          {entrant?.profile_id}
          {entrant?.profile_id === user?.id && (
            <>
              <button onClick={onLeave}>X</button>
            </>
          )}
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

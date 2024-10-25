import { User } from '@supabase/supabase-js'

import { Clergy } from '@/components/clergy'
import { useInstanceContext } from '@/context/InstanceContext'
import { MouseEventHandler } from 'react'
import { Enums } from '@/supabase.types'

export interface SeatProps {
  clergyId: string
  onClick: MouseEventHandler<HTMLButtonElement>
}

const occupied = (color: Enums<'color'>, users: User[] = []) => {
  return false //users.some((user) => user.color === color)
}

export const Seat = ({ clergyId, onClick }: SeatProps) => {
  const { user } = useInstanceContext()
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <button type="button" onClick={onClick}>
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

import { intlFormatDistance } from 'date-fns'
import { Tables } from '@/supabase.types'
import { PlayerDot } from './playerDot'
import { PlayerColor } from 'hathora-et-labora-game/dist/types'

type Props = {
  instance: Tables<'instance'>
  entrants?: Pick<Tables<'entrant'>, 'profile_id' | 'color'>[]
}

export const Instance = ({ instance, entrants = [] }: Props) => {
  return (
    <div
      style={{
        display: 'block',
        padding: 10,
        border: '1px solid #e5e7eb',
        backgroundColor: '#ffffff',
        borderRadius: 12,
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        margin: 10,
      }}
    >
      <b>
        <a href={`instance/${instance.id}`}>{instance.id}</a>
      </b>
      <hr />
      {(entrants ?? []).map((entrant) => (
        <div key={entrant.profile_id}>
          <PlayerDot color={entrant.color.slice(0, 1).toUpperCase() as PlayerColor} />
          {entrant.profile_id}
        </div>
      ))}
      <hr />
      <div>
        <i>
          Last updated{' '}
          {intlFormatDistance(new Date(instance.updated_at), new Date(), { style: 'long', numeric: 'auto' })}{' '}
        </i>
      </div>
    </div>
  )
}

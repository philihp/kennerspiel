import { intlFormatDistance } from 'date-fns'
import { Tables } from '@/supabase.types'
import Dot from './dot'
import { PlayerDot } from './playerDot'
import { PlayerColor } from 'hathora-et-labora-game/dist/types'

type Props = {
  instance: Tables<'instance'>
  entrants?: Tables<'entrant'>[]
}

export const Instance = ({ instance, entrants = [] }: Props) => {
  return (
    <div
      style={{
        display: 'block',
        padding: 10,
        border: '1px solid #ccc',
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        margin: 10,
      }}
    >
      <b>
        <a href={`instance/${instance.id}`}>{instance.id}</a>
      </b>
      <div>
        {' '}
        Created {intlFormatDistance(new Date(instance.created_at), new Date(), { style: 'long', numeric: 'auto' })}{' '}
      </div>
      <div>
        {' '}
        Updated {intlFormatDistance(new Date(instance.updated_at), new Date(), { style: 'long', numeric: 'auto' })}{' '}
      </div>
      <hr />
      {(entrants ?? []).map((entrant) => {
        return (
          <>
            <PlayerDot color={entrant.color.slice(0, 1).toUpperCase() as PlayerColor} />
            {entrant.profile_id}
          </>
        )
      })}
    </div>
  )
}

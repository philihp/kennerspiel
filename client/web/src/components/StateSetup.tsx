import { useParams } from 'react-router-dom'
import { find } from 'ramda'
import { EngineColor, EngineCountry, EngineConfig, EngineLength, EngineUser } from '../../../../api/types'
import { useHathoraContext } from '../context/GameContext'
import { Clergy } from './Clergy'

const IRELAND_DISABLED = true

const occupied = (color: EngineColor, users: EngineUser[] = []) => {
  return users.some((user) => user.color === color)
}

const configured = (country: EngineCountry, length: EngineLength, config?: EngineConfig) =>
  config && config.country === country && config.length === length

interface SeatProps {
  clergyId: string
  color: EngineColor
}

const Seat = ({ clergyId, color }: SeatProps) => {
  const { state, join, user: me } = useHathoraContext()
  const users = state?.users ?? []
  const user = find((u) => u.color === color, users)
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <button type="button" disabled={occupied(color, users)} onClick={() => join(color)}>
        Pick Color
      </button>
      {user?.picture ? (
        <>
          <Clergy
            id={clergyId}
            style={{
              backgroundImage: `url(${user?.picture})`,
              height: 36,
              width: 36,
              backgroundSize: 36,
              borderRadius: 18,
              borderWidth: 3,
            }}
          />
          {user?.name}
          {user?.id && user?.id === me?.id && (
            <button type="button" onClick={() => join()}>
              x
            </button>
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

export const StateSetup = () => {
  const { gameId } = useParams()
  const { state, config, start } = useHathoraContext()
  const users = state?.users ?? []
  const engineConfig = state?.config
  return (
    <>
      <h1>Game Setup</h1>
      <p>
        Share this private URL with players to join: <a href={`/game/${gameId}`}>/game/{gameId}</a>
      </p>
      <hr />
      <h3>Players ({users?.length})</h3>
      <Seat clergyId="LB1R" color={EngineColor.Red} />
      <Seat clergyId="LB1G" color={EngineColor.Green} />
      <Seat clergyId="LB1B" color={EngineColor.Blue} />
      <Seat clergyId="LB1W" color={EngineColor.White} />
      <p>Player order will be randomized upon start.</p>
      {/*-------------------------------------------*/}
      <hr />
      <h3>Mode</h3>
      <input type="radio" disabled checked={configured(EngineCountry.france, EngineLength.long, engineConfig)} />
      <button
        type="button"
        disabled={configured(EngineCountry.france, EngineLength.long, engineConfig)}
        onClick={() => config(EngineCountry.france, EngineLength.long)}
      >
        France {users?.length === 2 && '(long)'}
      </button>
      <br />
      <input type="radio" disabled checked={configured(EngineCountry.ireland, EngineLength.long, engineConfig)} />
      <button
        disabled={IRELAND_DISABLED || configured(EngineCountry.ireland, EngineLength.long, engineConfig)}
        onClick={() => config(EngineCountry.ireland, EngineLength.long)}
        type="button"
      >
        Ireland {users?.length === 2 && '(long)'}
      </button>
      <br />
      {users.length > 1 && (
        <>
          {' '}
          <input type="radio" disabled checked={configured(EngineCountry.france, EngineLength.short, engineConfig)} />
          <button
            type="button"
            disabled={configured(EngineCountry.france, EngineLength.short, engineConfig)}
            onClick={() => config(EngineCountry.france, EngineLength.short)}
          >
            France {users?.length >= 3 && '(short)'}
          </button>
          <br />
          <input type="radio" disabled checked={configured(EngineCountry.ireland, EngineLength.short, engineConfig)} />
          <button
            type="button"
            disabled={IRELAND_DISABLED || configured(EngineCountry.ireland, EngineLength.short, engineConfig)}
            onClick={() => config(EngineCountry.ireland, EngineLength.short)}
          >
            Ireland {users?.length >= 3 && '(short)'}
          </button>
          <br />
        </>
      )}
      <p>Country variants contain different buildings. Ireland disabled during development.</p>

      <hr />
      <button
        className="primary"
        type="button"
        disabled={users?.length === 0 || engineConfig === undefined}
        onClick={() => start()}
      >
        Start
      </button>
    </>
  )
}

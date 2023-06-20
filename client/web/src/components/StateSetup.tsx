import { useParams } from 'react-router-dom'
import { Color, Country, EngineConfig, Length, User } from '../../../../api/types'
import { useHathoraContext } from '../context/GameContext'
import { Clergy } from './PlayerClergy'

const occupied = (color: Color, users: User[] = []) => {
  return users.some((user) => user.color === color)
}

const configured = (country: Country, length: Length, config?: EngineConfig) =>
  config && config.country === country && config.length === length

export const StateSetup = () => {
  const { gameId } = useParams()
  const { state, players, join, config, start } = useHathoraContext()
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
      <Clergy id="LB1R" />
      <button type="button" disabled={occupied(Color.Red, users)} onClick={() => join(Color.Red)}>
        Red
      </button>
      <br />
      <Clergy id="LB1G" />
      <button type="button" disabled={occupied(Color.Green, users)} onClick={() => join(Color.Green)}>
        Green
      </button>
      <br />
      <Clergy id="LB1B" />
      <button type="button" disabled={occupied(Color.Blue, users)} onClick={() => join(Color.Blue)}>
        Blue
      </button>
      <br />
      <Clergy id="LB1W" />
      <button type="button" disabled={occupied(Color.White, users)} onClick={() => join(Color.White)}>
        White
      </button>
      <p>Player order will be randomized upon start.</p>
      <pre>{JSON.stringify({ debug: users })}</pre>
      {/*-------------------------------------------*/}
      <hr />
      <h3>Mode</h3>
      <input type="radio" disabled checked={configured(Country.france, Length.long, engineConfig)} />
      <button
        type="button"
        disabled={configured(Country.france, Length.long, engineConfig)}
        onClick={() => config(Country.france, Length.long)}
      >
        France {users?.length === 2 && '(long)'}
      </button>
      <br />
      <input type="radio" disabled checked={configured(Country.ireland, Length.long, engineConfig)} />
      <button
        disabled={configured(Country.ireland, Length.long, engineConfig)}
        onClick={() => config(Country.ireland, Length.long)}
        type="button"
      >
        Ireland {users?.length === 2 && '(long)'}
      </button>
      <br />
      {users.length > 1 && (
        <>
          {' '}
          <input type="radio" disabled checked={configured(Country.ireland, Length.short, engineConfig)} />
          <button
            type="button"
            disabled={configured(Country.ireland, Length.short, engineConfig)}
            onClick={() => config(Country.ireland, Length.short)}
          >
            Ireland {users?.length >= 3 && '(short)'}
          </button>
          <br />
          <input type="radio" disabled checked={configured(Country.france, Length.short, engineConfig)} />
          <button
            type="button"
            disabled={configured(Country.france, Length.short, engineConfig)}
            onClick={() => config(Country.france, Length.short)}
          >
            France {users?.length >= 3 && '(short)'}
          </button>
          <br />
        </>
      )}
      {JSON.stringify(players)}
      <hr />
      <button type="button" disabled={users?.length === 0 || engineConfig === undefined} onClick={() => start()}>
        Start
      </button>
    </>
  )
}

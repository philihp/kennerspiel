import { useParams } from 'react-router-dom'
import { equals, find } from 'ramda'
import { EngineColor, EngineCountry, EngineConfig, EngineLength, EngineUser } from '../../../../api/types'
import { useHathoraContext } from '../context/GameContext'
import { Clergy } from './PlayerClergy'

const occupied = (color: EngineColor, users: EngineUser[] = []) => {
  return users.some((user) => user.color === color)
}

const configured = (country: EngineCountry, length: EngineLength, config?: EngineConfig) =>
  config && config.country === country && config.length === length

export const StateSetup = () => {
  const { gameId } = useParams()
  const { state, getUser, join, config, start } = useHathoraContext()
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
      {JSON.stringify(find((u) => u.color === EngineColor.Red, users))}
      <button type="button" disabled={occupied(EngineColor.Red, users)} onClick={() => join(EngineColor.Red)}>
        Red
      </button>
      <br />
      <Clergy id="LB1G" />
      <button type="button" disabled={occupied(EngineColor.Green, users)} onClick={() => join(EngineColor.Green)}>
        Green
      </button>
      <br />
      <Clergy id="LB1B" />
      <button type="button" disabled={occupied(EngineColor.Blue, users)} onClick={() => join(EngineColor.Blue)}>
        Blue
      </button>
      <br />
      <Clergy id="LB1W" />
      <button type="button" disabled={occupied(EngineColor.White, users)} onClick={() => join(EngineColor.White)}>
        White
      </button>
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
        disabled={configured(EngineCountry.ireland, EngineLength.long, engineConfig)}
        onClick={() => config(EngineCountry.ireland, EngineLength.long)}
        type="button"
      >
        Ireland {users?.length === 2 && '(long)'}
      </button>
      <br />
      {users.length > 1 && (
        <>
          {' '}
          <input type="radio" disabled checked={configured(EngineCountry.ireland, EngineLength.short, engineConfig)} />
          <button
            type="button"
            disabled={configured(EngineCountry.ireland, EngineLength.short, engineConfig)}
            onClick={() => config(EngineCountry.ireland, EngineLength.short)}
          >
            Ireland {users?.length >= 3 && '(short)'}
          </button>
          <br />
          <input type="radio" disabled checked={configured(EngineCountry.france, EngineLength.short, engineConfig)} />
          <button
            type="button"
            disabled={configured(EngineCountry.france, EngineLength.short, engineConfig)}
            onClick={() => config(EngineCountry.france, EngineLength.short)}
          >
            France {users?.length >= 3 && '(short)'}
          </button>
          <br />
        </>
      )}
      <pre>{JSON.stringify(state?.users, undefined, 2)}</pre>
      <hr />
      <button type="button" disabled={users?.length === 0 || engineConfig === undefined} onClick={() => start()}>
        Start
      </button>
    </>
  )
}
